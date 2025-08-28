import os
import sys

# Ensure local import from this folder
CURRENT_DIR = os.path.dirname(__file__)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from house_link_parsing_agent import HouseLinkParsingAgent


def test_zillow_next_data_parsing():
    agent = HouseLinkParsingAgent()
    html = """
    <html>
      <head>
        <script id="__NEXT_DATA__" type="application/json">
        {
          "props": {
            "pageProps": {
              "property": {
                "price": 825000,
                "bedrooms": 4,
                "bathrooms": 3,
                "livingArea": 2400,
                "address": {
                  "streetAddress": "45 Oak Ave",
                  "city": "San Jose",
                  "state": "CA",
                  "zipcode": "95126"
                }
              }
            }
          }
        }
        </script>
        <title>$825,000 – 45 Oak Ave - Zillow</title>
      </head>
      <body></body>
    </html>
    """
    d = agent.parse_html(html, "https://www.zillow.com/homedetails/12345_zpid/")
    assert d.source == "zillow"
    assert d.price == 825000
    assert d.beds == 4
    assert d.baths == 3
    assert d.living_area_sqft == 2400
    assert d.address == "45 Oak Ave"
    assert d.city == "San Jose"
    assert d.state == "CA"
    assert d.postal_code == "95126"
    assert d.confidence > 0.6


def test_redfin_jsonld_parsing():
    agent = HouseLinkParsingAgent()
    html = """
    <html>
      <head>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "789 Pine St",
            "addressLocality": "Seattle",
            "addressRegion": "WA",
            "postalCode": "98101"
          },
          "offers": {"@type":"Offer","price": 950000, "priceCurrency":"USD"},
          "numberOfBedrooms": 5,
          "numberOfBathroomsTotal": 3.5,
          "floorSize": {"@type":"QuantitativeValue","value": 3100, "unitText":"sqft"},
          "yearBuilt": 2012
        }
        </script>
        <title>$950,000 – 789 Pine St - Redfin</title>
      </head>
      <body></body>
    </html>
    """
    d = agent.parse_html(html, "https://www.redfin.com/WA/Seattle/789-Pine-St/home/111222333")
    assert d.source == "redfin"
    assert d.price == 950000
    assert d.beds == 5
    assert d.baths == 3.5
    assert d.living_area_sqft == 3100
    assert d.address == "789 Pine St"
    assert d.city == "Seattle"
    assert d.state == "WA"
    assert d.postal_code == "98101"
    assert d.year_built == 2012


def test_realtor_jsonld_and_lot_acres():
    agent = HouseLinkParsingAgent()
    html = """
    <html>
      <head>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "RealEstateListing",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1600 Pennsylvania Ave NW",
            "addressLocality": "Washington",
            "addressRegion": "DC",
            "postalCode": "20500"
          },
          "offers": {"@type":"Offer","price": 1234567, "priceCurrency":"USD"},
          "numberOfBedrooms": 6,
          "numberOfBathroomsTotal": 7,
          "floorSize": {"@type":"QuantitativeValue","value": 5500, "unitText":"sqft"},
          "lotSize": {"@type":"QuantitativeValue","value": 2.0, "unitText":"Acre"}
        }
        </script>
        <title>$1,234,567 – 1600 Pennsylvania Ave NW - Realtor</title>
      </head>
      <body></body>
    </html>
    """
    d = agent.parse_html(html, "https://www.realtor.com/realestateandhomes-detail/12345")
    assert d.source == "realtor"
    assert d.price == 1234567
    assert d.beds == 6
    assert d.baths == 7
    assert d.living_area_sqft == 5500
    # 2 acres -> 87120 sqft
    assert d.lot_size_sqft == 2.0 * 43560
    assert d.address.startswith("1600 Pennsylvania")
    assert d.city == "Washington"
    assert (d.state or "").upper() in ("DC", "D.C.")


def test_meta_parsing_generic_site():
    agent = HouseLinkParsingAgent()
    html = """
    <html>
      <head>
        <meta property="og:title" content="3 bed 2 bath 1,800 sq ft • 742 Evergreen Terrace • $699,000" />
        <title>$699,000 – 742 Evergreen Terrace - Example</title>
      </head>
      <body></body>
    </html>
    """
    d = agent.parse_html(html, "https://example.com/742-evergreen-terrace")
    # Pull price from title, details from og:title
    assert d.price == 699000
    assert d.beds == 3
    assert d.baths == 2
    assert d.living_area_sqft == 1800
    assert d.confidence >= 0.5


def test_source_inference():
    agent = HouseLinkParsingAgent()
    assert agent._infer_source("https://www.zillow.com/homedetails/abc/") == "zillow"
    assert agent._infer_source("https://www.redfin.com/CA/SF/xyz") == "redfin"
    assert agent._infer_source("https://www.realtor.com/abc") == "realtor"
    assert agent._infer_source("https://sub.example.com/path") == "sub.example.com"
