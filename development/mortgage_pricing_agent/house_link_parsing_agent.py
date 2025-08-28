"""
House Link Parsing Agent
========================

Parses real-estate listing URLs (Zillow, Redfin, Realtor.com, etc.) to extract
structured property details useful for mortgage analysis: price, address, beds,
baths, square footage, lot size, year built, HOA, taxes, property type, etc.

Approach:
- Fetch the page HTML with a modern User-Agent and basic retry handling.
- Prefer structured data in JSON-LD (script type="application/ld+json").
- Fallback to framework payloads (e.g., __NEXT_DATA__) and meta tags.
- Normalize fields into a PropertyDetails dataclass for downstream use.

This module avoids heavy scraping frameworks and works with public pages.
It does not bypass bot protections and may return lower confidence when
data is incomplete or blocked.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse
import json
import re
import time

import requests
from bs4 import BeautifulSoup


@dataclass
class PropertyDetails:
    # Core identifiers
    url: str
    source: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Listing/pricing
    price: Optional[float] = None
    price_currency: Optional[str] = None
    days_on_market: Optional[int] = None
    listing_status: Optional[str] = None  # active, pending, sold, etc.

    # Physical attributes
    beds: Optional[float] = None
    baths: Optional[float] = None
    living_area_sqft: Optional[float] = None
    lot_size_sqft: Optional[float] = None
    year_built: Optional[int] = None
    property_type: Optional[str] = None  # single_family, condo, townhouse, multi_family, etc.

    # Ownership costs
    hoa_monthly: Optional[float] = None
    property_taxes_annual: Optional[float] = None

    # Schools and extras
    school_district: Optional[str] = None
    schools: List[Dict[str, Any]] = field(default_factory=list)

    # Raw & diagnostics
    raw: Dict[str, Any] = field(default_factory=dict)
    confidence: float = 0.5
    warnings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class HouseLinkParsingAgent:
    USER_AGENTS = [
        # A small rotation of modern desktop browsers
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3 Safari/605.1.15",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0",
    ]

    def __init__(self, timeout: int = 12):
        self.timeout = timeout

    # ---------- Public API ----------
    def parse_property_link(self, url: str) -> PropertyDetails:
        html, final_url, status_code = self._fetch_html(url)
        details = self._parse_html(html, final_url or url)
        # Adjust confidence if blocked or empty
        if status_code and status_code >= 400:
            details.warnings.append(f"HTTP status {status_code}")
            details.confidence = min(details.confidence, 0.4)
        if not any([details.price, details.address, details.living_area_sqft]):
            details.confidence = min(details.confidence, 0.35)
            if "No parsable data found" not in details.warnings:
                details.warnings.append("No parsable data found from page")
        return details

    def parse_html(self, html: str, base_url: str) -> PropertyDetails:
        return self._parse_html(html, base_url)

    # ---------- Fetch ----------
    def _fetch_html(self, url: str) -> Tuple[str, Optional[str], Optional[int]]:
        headers = {
            "User-Agent": self.USER_AGENTS[0],
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Connection": "keep-alive",
        }
        attempts = 0
        last_status = None
        while attempts < 2:
            try:
                resp = requests.get(url, headers=headers, timeout=self.timeout)
                last_status = resp.status_code
                if resp.status_code in (403, 429) and attempts == 0:
                    # Retry once with a different UA after a short backoff
                    time.sleep(1.0)
                    headers["User-Agent"] = self.USER_AGENTS[min(1 + attempts, len(self.USER_AGENTS) - 1)]
                    attempts += 1
                    continue
                return resp.text or "", str(resp.url), resp.status_code
            except Exception:
                if attempts == 0:
                    time.sleep(0.5)
                attempts += 1
        return "", None, last_status

    # ---------- Parse ----------
    def _parse_html(self, html: str, url: str) -> PropertyDetails:
        source = self._infer_source(url)
        soup = BeautifulSoup(html or "", "lxml")
        details = PropertyDetails(url=url, source=source)

        extracted_raw: Dict[str, Any] = {}
        confidence_boost = 0.0

        # 1) JSON-LD blocks
        jsonld_items = self._extract_jsonld(soup)
        if jsonld_items:
            extracted_raw["jsonld"] = jsonld_items
            self._apply_from_jsonld(jsonld_items, details)
            confidence_boost += 0.25

        # 2) Next.js payloads (e.g., Zillow/Redfin often use __NEXT_DATA__)
        next_data = self._extract_next_data(soup)
        if next_data:
            extracted_raw["next_data"] = next_data
            self._apply_from_next_data(next_data, details)
            confidence_boost += 0.2

        # 3) Meta tags and visible hints
        meta = self._extract_meta_tags(soup)
        if meta:
            extracted_raw["meta"] = meta
            self._apply_from_meta(meta, details)
            confidence_boost += 0.1

        # 4) Heuristic text patterns if still missing price
        if not details.price:
            price = self._regex_price(soup.get_text(" "))
            if price:
                details.price = price
                confidence_boost += 0.05

        # Normalize/derive
        self._normalize(details)

        # Confidence estimation
        base_conf = 0.4
        filled_keys = sum(1 for k in [
            details.price,
            details.address,
            details.city,
            details.state,
            details.beds,
            details.baths,
            details.living_area_sqft,
        ] if k not in (None, ""))
        details.confidence = min(0.95, base_conf + confidence_boost + 0.05 * filled_keys)

        # Diagnostics
        details.raw = extracted_raw
        if not (jsonld_items or next_data or meta):
            details.warnings.append("No structured data found on page")

        return details

    # ---------- Extractors ----------
    def _extract_jsonld(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        blocks: List[Dict[str, Any]] = []
        for tag in soup.find_all("script", {"type": "application/ld+json"}):
            try:
                text = tag.string or tag.get_text() or ""
                if not text.strip():
                    continue
                data = json.loads(text)
                if isinstance(data, dict):
                    blocks.append(data)
                elif isinstance(data, list):
                    blocks.extend([d for d in data if isinstance(d, dict)])
            except Exception:
                # Some pages include multiple JSON objects without commas; try to salvage
                parts = self._split_json_objects(tag.get_text())
                for p in parts:
                    try:
                        d = json.loads(p)
                        if isinstance(d, dict):
                            blocks.append(d)
                    except Exception:
                        pass
        return blocks

    def _extract_next_data(self, soup: BeautifulSoup) -> Optional[Dict[str, Any]]:
        # Common id for Next.js apps
        script = soup.find("script", id="__NEXT_DATA__")
        if not script:
            return None
        try:
            text = script.string or script.get_text() or ""
            data = json.loads(text)
            return data if isinstance(data, dict) else None
        except Exception:
            return None

    def _extract_meta_tags(self, soup: BeautifulSoup) -> Dict[str, str]:
        meta: Dict[str, str] = {}
        for tag in soup.find_all("meta"):
            for key in ("property", "name"):
                prop = tag.get(key)
                if not prop:
                    continue
                content = tag.get("content")
                if not content:
                    continue
                meta[prop.lower()] = content
        # Title is often formatted as: "$X – address – Site"
        if soup.title and soup.title.string:
            meta["_title"] = soup.title.string.strip()
        return meta

    # ---------- Appliers ----------
    def _apply_from_jsonld(self, items: List[Dict[str, Any]], d: PropertyDetails) -> None:
        # Prefer RealEstateListing/Offer then Residence types
        best: Optional[Dict[str, Any]] = None
        for it in items:
            t = (it.get("@type") or "").lower()
            if isinstance(it.get("@type"), list):
                t = ",".join([str(x).lower() for x in it.get("@type")])
            if any(x in t for x in ["realestatelisting", "offer", "housinglisting"]):
                best = it
                break
        if not best:
            for it in items:
                t = str(it.get("@type", "")).lower()
                if any(x in t for x in ["residence", "singlefamilyresidence", "apartment", "house"]):
                    best = it
                    break
        if not best and items:
            best = items[0]

        if not best:
            return

        # Address
        addr = best.get("address") or {}
        if isinstance(addr, dict):
            d.address = addr.get("streetAddress") or d.address
            d.city = addr.get("addressLocality") or d.city
            d.state = addr.get("addressRegion") or d.state
            d.postal_code = addr.get("postalCode") or d.postal_code

        # Geo
        geo = best.get("geo") or {}
        if isinstance(geo, dict):
            try:
                lat = geo.get("latitude")
                lon = geo.get("longitude")
                d.latitude = float(lat) if lat is not None else d.latitude
                d.longitude = float(lon) if lon is not None else d.longitude
            except Exception:
                pass

        # Price/Offer
        offer = best.get("offers") or best.get("offer") or {}
        if isinstance(offer, dict):
            price = offer.get("price") or offer.get("priceSpecification", {}).get("price")
            if price is not None:
                try:
                    d.price = float(str(price).replace(",", ""))
                except Exception:
                    pass
            d.price_currency = offer.get("priceCurrency") or offer.get("priceSpecification", {}).get("priceCurrency") or d.price_currency
        else:
            # Some listings put price at top level
            price = best.get("price")
            if price is not None:
                try:
                    d.price = float(str(price).replace(",", ""))
                except Exception:
                    pass

        # Beds/baths/area
        for k in ("numberOfRooms", "numberOfBedrooms", "bedrooms", "beds"):
            v = best.get(k)
            if v is not None and d.beds is None:
                try:
                    d.beds = float(v)
                except Exception:
                    pass
        for k in ("numberOfBathroomsTotal", "bathrooms", "baths"):
            v = best.get(k)
            if v is not None and d.baths is None:
                try:
                    d.baths = float(v)
                except Exception:
                    pass
        for k in ("floorSize", "area", "livingArea" ):
            v = best.get(k)
            if isinstance(v, dict):
                val = v.get("value") or v.get("floorSize") or v.get("area")
                unit = (v.get("unitText") or "").lower()
                try:
                    num = float(str(val).replace(",", ""))
                    if unit in ("sqft", "square feet", "ft2", "ft^2") or not unit:
                        d.living_area_sqft = d.living_area_sqft or num
                except Exception:
                    pass

        # Lot size
        lot = best.get("lotSize") or best.get("lotSizeArea")
        if isinstance(lot, dict):
            val = lot.get("value") or lot.get("lotSize")
            unit = (lot.get("unitText") or "").lower()
            try:
                num = float(str(val).replace(",", ""))
                if unit in ("sqft", "square feet", "ft2", "ft^2"):
                    d.lot_size_sqft = d.lot_size_sqft or num
                elif unit in ("acre", "acres"):
                    d.lot_size_sqft = d.lot_size_sqft or num * 43560.0
            except Exception:
                pass

        # Year built / type
        yb = best.get("yearBuilt")
        try:
            if yb is not None:
                d.year_built = int(yb)
        except Exception:
            pass
        ptype = best.get("@type")
        if isinstance(ptype, list):
            ptype = ",".join(ptype)
        if isinstance(ptype, str):
            d.property_type = d.property_type or ptype.lower()

    def _apply_from_next_data(self, payload: Dict[str, Any], d: PropertyDetails) -> None:
        # Try common shapes for Next.js apps (Zillow, Redfin evolve often)
        try:
            data = payload.get("props", {}).get("pageProps", {})
            # Zillow often nests property data under property or initialReduxState
            z_data = data.get("property") or data.get("gdpClientCache") or {}
            if isinstance(z_data, dict):
                # Attempt to find a price-like field by common keys
                for k in ("price", "unformattedPrice", "homeValue", "zestimate"):
                    v = self._deep_get(z_data, k)
                    if v is not None and d.price is None:
                        try:
                            d.price = float(str(v).replace(",", ""))
                        except Exception:
                            pass
                # Beds/baths/sqft patterns
                for k in ("bedrooms", "beds"):
                    v = self._deep_get(z_data, k)
                    if v is not None and d.beds is None:
                        try:
                            d.beds = float(v)
                        except Exception:
                            pass
                for k in ("bathrooms", "baths"):
                    v = self._deep_get(z_data, k)
                    if v is not None and d.baths is None:
                        try:
                            d.baths = float(v)
                        except Exception:
                            pass
                for k in ("livingArea", "livingAreaValue", "homeSize", "sqft"):
                    v = self._deep_get(z_data, k)
                    if v is not None and d.living_area_sqft is None:
                        try:
                            d.living_area_sqft = float(str(v).replace(",", ""))
                        except Exception:
                            pass
                # Address
                street = self._deep_get(z_data, "streetAddress") or self._deep_get(z_data, "streetLine1")
                d.address = d.address or (street if isinstance(street, str) else None)
                d.city = d.city or self._deep_get(z_data, "city")
                d.state = d.state or self._deep_get(z_data, "state") or self._deep_get(z_data, "stateCode")
                d.postal_code = d.postal_code or self._deep_get(z_data, "zipcode") or self._deep_get(z_data, "postalCode")
        except Exception:
            return

    def _apply_from_meta(self, meta: Dict[str, str], d: PropertyDetails) -> None:
        title = meta.get("_title", "")
        # Possible title pattern: "$X, Address - Site"
        price_match = re.search(r"\$([0-9,]+)", title)
        if price_match and not d.price:
            try:
                d.price = float(price_match.group(1).replace(",", ""))
            except Exception:
                pass
        # og:title sometimes has beds/baths/sqft
        og_title = meta.get("og:title", "") + " " + meta.get("twitter:title", "")
        if not d.beds:
            m = re.search(r"(\d+(?:\.\d+)?)\s*bed", og_title, flags=re.I)
            if m:
                try:
                    d.beds = float(m.group(1))
                except Exception:
                    pass
        if not d.baths:
            m = re.search(r"(\d+(?:\.\d+)?)\s*bath", og_title, flags=re.I)
            if m:
                try:
                    d.baths = float(m.group(1))
                except Exception:
                    pass
        if not d.living_area_sqft:
            m = re.search(r"([0-9,]+)\s*sq\s*ft", og_title, flags=re.I)
            if m:
                try:
                    d.living_area_sqft = float(m.group(1).replace(",", ""))
                except Exception:
                    pass

    # ---------- Helpers ----------
    def _normalize(self, d: PropertyDetails) -> None:
        # Normalize source/type
        if d.property_type:
            pt = d.property_type.lower()
            if "singlefamily" in pt or "single family" in pt or "house" in pt:
                d.property_type = "single_family"
            elif "townhouse" in pt or "townhome" in pt:
                d.property_type = "townhouse"
            elif "condo" in pt or "condominium" in pt:
                d.property_type = "condo"
            elif "multi" in pt:
                d.property_type = "multi_family"
            elif "apartment" in pt:
                d.property_type = "apartment"
        # HOA monthly normalization if provided annually in some sources (rare heuristic)
        # No-op unless we detect unusual large values without other hints.
        if d.hoa_monthly and d.hoa_monthly > 5000:
            d.hoa_monthly = round(d.hoa_monthly / 12.0, 2)

    def _regex_price(self, text: str) -> Optional[float]:
        m = re.search(r"\$\s*([0-9][0-9,]{3,})\b", text)
        if not m:
            return None
        try:
            return float(m.group(1).replace(",", ""))
        except Exception:
            return None

    def _infer_source(self, url: str) -> str:
        try:
            host = urlparse(url).hostname or ""
            host = host.lower()
            if any(s in host for s in ["zillow.com"]):
                return "zillow"
            if any(s in host for s in ["redfin.com"]):
                return "redfin"
            if any(s in host for s in ["realtor.com"]):
                return "realtor"
            if host:
                return host
        except Exception:
            pass
        return "unknown"

    def _split_json_objects(self, text: str) -> List[str]:
        # Splits concatenated JSON objects: {}{}
        items: List[str] = []
        depth = 0
        start = None
        in_str = False
        esc = False
        for i, ch in enumerate(text):
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == '"':
                    in_str = False
            else:
                if ch == '"':
                    in_str = True
                elif ch == '{':
                    if depth == 0:
                        start = i
                    depth += 1
                elif ch == '}':
                    depth -= 1
                    if depth == 0 and start is not None:
                        items.append(text[start:i+1])
                        start = None
        return items

    def _deep_get(self, obj: Any, key: str) -> Any:
        # BFS search for a key in nested dicts/lists
        queue = [obj]
        while queue:
            cur = queue.pop(0)
            if isinstance(cur, dict):
                if key in cur:
                    return cur[key]
                queue.extend(cur.values())
            elif isinstance(cur, list):
                queue.extend(cur)
        return None


def estimate_monthly_ownership_costs(
    details: PropertyDetails,
    tax_rate_annual: float = 0.012,
    insurance_rate_annual: float = 0.0035,
) -> Dict[str, float]:
    """Estimate monthly taxes/insurance based on crude heuristics.

    Returns dict with estimated_taxes_monthly, estimated_insurance_monthly, hoa_monthly.
    """
    val = (details.price or 0.0)
    taxes_m = (val * tax_rate_annual) / 12.0 if val else None
    ins_m = (val * insurance_rate_annual) / 12.0 if val else None
    return {
        "estimated_taxes_monthly": round(taxes_m, 2) if taxes_m is not None else None,
        "estimated_insurance_monthly": round(ins_m, 2) if ins_m is not None else None,
        "hoa_monthly": details.hoa_monthly,
    }
