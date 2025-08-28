import argparse
import json
import os
import sys

from typing import Optional

CURRENT_DIR = os.path.dirname(__file__)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from house_link_parsing_agent import HouseLinkParsingAgent, estimate_monthly_ownership_costs
from autonomous_mortgage_pricing_agent import AutonomousMortgagePricingAgent, BorrowerProfile


def main():
    parser = argparse.ArgumentParser(description="Parse saved real-estate listing HTML and optionally run mortgage pricing.")
    parser.add_argument("html_path", help="Path to saved HTML file (View Source saved as .html)")
    parser.add_argument("--base-url", dest="base_url", default="https://example.com/", help="Original listing URL for source inference (optional but recommended)")
    parser.add_argument("--print-raw", action="store_true", help="Print full raw parsed JSON (including raw blocks)")
    parser.add_argument("--price", action="store_true", help="Run pricing with default borrower assumptions")
    parser.add_argument("--defaults", type=str, default="", help="JSON string with borrower defaults (e.g., '{\"credit_score\":740,\"annual_income\":160000}')")

    args = parser.parse_args()

    with open(args.html_path, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()

    agent = HouseLinkParsingAgent()
    details = agent.parse_html(html, args.base_url)
    costs = estimate_monthly_ownership_costs(details)

    out = details.to_dict()
    out["ownership_cost_estimates"] = costs

    if not args.print_raw:
        # Trim raw payloads for readability
        out.pop("raw", None)

    print(json.dumps(out, indent=2))

    if args.price:
        print("\n--- Running pricing with property-derived borrower profile ---")
        defaults = {}
        if args.defaults:
            try:
                defaults = json.loads(args.defaults)
            except Exception as e:
                print(f"Failed to parse --defaults JSON: {e}")
        autopricer = AutonomousMortgagePricingAgent()
        result = autopricer.process_property_link(args.base_url, default_borrower=defaults)
        if "error" in result:
            print(json.dumps({"pricing_error": result["error"]}, indent=2))
        else:
            print(json.dumps({
                "final_pricing": result.get("final_pricing"),
                "recommendations": result.get("recommendations", []),
                "risk_assessment": result.get("risk_assessment"),
                "processing_mode": result.get("processing_mode")
            }, indent=2))


if __name__ == "__main__":
    main()
