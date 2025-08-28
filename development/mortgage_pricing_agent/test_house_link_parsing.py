import json
import os
import sys

# Ensure we can import the module from this folder when running pytest from repo root
CURRENT_DIR = os.path.dirname(__file__)
if CURRENT_DIR not in sys.path:
  sys.path.insert(0, CURRENT_DIR)

from house_link_parsing_agent import HouseLinkParsingAgent


def test_parse_html_jsonld_basic():
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
            "streetAddress": "123 Main St",
            "addressLocality": "Austin",
            "addressRegion": "TX",
            "postalCode": "78701"
          },
          "offers": {
            "@type": "Offer",
            "price": 650000,
            "priceCurrency": "USD"
          },
          "numberOfBedrooms": 3,
          "numberOfBathroomsTotal": 2,
          "floorSize": {"@type": "QuantitativeValue", "value": 1800, "unitText": "sqft"},
          "yearBuilt": 2005
        }
        </script>
        <title>$650,000 – 123 Main St - Example</title>
      </head>
      <body></body>
    </html>
    """
    d = agent.parse_html(html, "https://example.com/listing/123")
    assert d.price == 650000
    assert d.address == "123 Main St"
    assert d.city == "Austin"
    assert d.state == "TX"
    assert d.beds == 3
    assert d.baths == 2
    assert d.living_area_sqft == 1800
    assert d.year_built == 2005
    assert d.confidence > 0.6


def test_parse_text_regex_price():
    agent = HouseLinkParsingAgent()
    html = """
    <html><head><title>Great house</title></head>
    <body>
      <div>List Price: $799,000</div>
    </body></html>
    """
    d = agent.parse_html(html, "https://example.com/l/abc")
    assert d.price == 799000
    assert d.confidence >= 0.45
