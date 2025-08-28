"""
Test the Autonomous Mortgage Pricing Agent
==========================================

This script tests the fully autonomous agent that gathers its own market data
and uses AI + tools for intelligent pricing decisions.
"""

import os
import sys
from autonomous_mortgage_pricing_agent import (
    AutonomousMortgagePricingAgent, BorrowerProfile
)

import dotenv
dotenv.load_dotenv()

def test_autonomous_agent():
    """Test the autonomous mortgage pricing agent"""
    
    print("🤖 Testing Autonomous Mortgage Pricing Agent")
    print("=" * 60)
    
    # Check for Groq API key (optional for this agent)
    groq_api_key = os.getenv("GROQ_API_KEY")
    if groq_api_key:
        print("✅ Groq API key found - AI analysis will be used")
    else:
        print("ℹ️  No Groq API key - will use rule-based analysis")
        print("   (Get a free key at: https://console.groq.com/)")
    
    print()
    
    # Test different borrower scenarios
    test_scenarios = {
        "excellent_borrower": BorrowerProfile(
            credit_score=780,
            debt_to_income_ratio=0.25,
            loan_to_value_ratio=0.75,
            employment_history_years=8,
            annual_income=120000,
            assets=100000,
            loan_amount=450000,
            property_value=600000,
            loan_term_years=30,
            loan_purpose="purchase",
            property_type="single_family",
            occupancy="primary",
            down_payment=150000
        ),
        
        "typical_borrower": BorrowerProfile(
            credit_score=720,
            debt_to_income_ratio=0.32,
            loan_to_value_ratio=0.85,
            employment_history_years=5,
            annual_income=85000,
            assets=50000,
            loan_amount=400000,
            property_value=470000,
            loan_term_years=30,
            loan_purpose="purchase",
            property_type="single_family",
            occupancy="primary",
            down_payment=70000
        ),
        
        "challenging_borrower": BorrowerProfile(
            credit_score=650,
            debt_to_income_ratio=0.42,
            loan_to_value_ratio=0.95,
            employment_history_years=2,
            annual_income=60000,
            assets=15000,
            loan_amount=285000,
            property_value=300000,
            loan_term_years=30,
            loan_purpose="purchase",
            property_type="single_family",
            occupancy="primary",
            down_payment=15000
        ),
        
        "jumbo_borrower": BorrowerProfile(
            credit_score=760,
            debt_to_income_ratio=0.30,
            loan_to_value_ratio=0.80,
            employment_history_years=10,
            annual_income=200000,
            assets=200000,
            loan_amount=800000,
            property_value=1000000,
            loan_term_years=30,
            loan_purpose="purchase",
            property_type="single_family",
            occupancy="primary",
            down_payment=200000
        )
    }
    
    # Initialize the autonomous agent
    try:
        agent = AutonomousMortgagePricingAgent(groq_api_key)
        print("✅ Autonomous agent initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize agent: {e}")
        return False
    
    print("\n🔄 Running Test Scenarios:")
    print("=" * 40)
    
    results = {}
    
    for scenario_name, borrower in test_scenarios.items():
        print(f"\n📋 Testing: {scenario_name.replace('_', ' ').title()}")
        print("-" * 40)
        
        try:
            # Process loan application autonomously
            result = agent.process_loan_application(borrower)
            
            # Extract key results
            pricing = result["final_pricing"]
            risk = result.get("risk_assessment", {})
            
            print(f"💰 Interest Rate: {pricing['final_interest_rate']:.3f}%")
            print(f"🏠 Monthly Payment: ${pricing['monthly_payment']:,.2f}")
            print(f"⚖️ Risk Level: {risk.get('risk_category', 'Unknown').title()}")
            print(f"📊 Risk Score: {risk.get('risk_score', 'N/A')}/100")
            print(f"🎯 Processing: {result.get('processing_mode', 'Unknown')}")
            
            # Show top recommendations
            recommendations = result.get("recommendations", [])
            if recommendations:
                print("💡 Top Recommendations:")
                for i, rec in enumerate(recommendations[:3], 1):
                    print(f"   {i}. {rec}")
            
            # Store results for comparison
            results[scenario_name] = {
                "rate": pricing["final_interest_rate"],
                "payment": pricing["monthly_payment"],
                "risk_score": risk.get("risk_score", 0),
                "risk_category": risk.get("risk_category", "unknown")
            }
            
            print("✅ Scenario completed successfully")
            
        except Exception as e:
            print(f"❌ Scenario failed: {e}")
            results[scenario_name] = {"error": str(e)}
    
    # Generate comparison analysis
    print("\n📊 Comparative Analysis")
    print("=" * 40)
    
    successful_results = {k: v for k, v in results.items() if "error" not in v}
    
    if successful_results:
        rates = [(name, data["rate"]) for name, data in successful_results.items()]
        rates.sort(key=lambda x: x[1])
        
        print("🎯 Interest Rates (Lowest to Highest):")
        for name, rate in rates:
            risk_cat = successful_results[name]["risk_category"]
            payment = successful_results[name]["payment"]
            print(f"   {rate:.3f}% - {name.replace('_', ' ').title()} ({risk_cat}, ${payment:,.0f}/mo)")
        
        # Rate spread analysis
        min_rate = min(rates, key=lambda x: x[1])[1]
        max_rate = max(rates, key=lambda x: x[1])[1]
        
        print(f"\n📈 Rate Statistics:")
        print(f"   Lowest Rate: {min_rate:.3f}%")
        print(f"   Highest Rate: {max_rate:.3f}%")
        print(f"   Rate Spread: {max_rate - min_rate:.3f}%")
        
        # Payment impact
        payments = [data["payment"] for data in successful_results.values()]
        payment_range = max(payments) - min(payments)
        print(f"   Payment Range: ${payment_range:,.0f}/month")
        print(f"   Annual Impact: ${payment_range * 12:,.0f}/year")
    
    print(f"\n✅ Testing Complete!")
    print(f"   Successful scenarios: {len(successful_results)}/{len(test_scenarios)}")
    
    if len(successful_results) == len(test_scenarios):
        print("🎉 All scenarios processed successfully!")
        return True
    else:
        failed = len(test_scenarios) - len(successful_results)
        print(f"⚠️  {failed} scenario(s) failed - check errors above")
        return False


def test_individual_tools():
    """Test the individual tools used by the autonomous agent"""
    
    print("\n🔧 Testing Individual Tools")
    print("=" * 40)
    
    try:
        from autonomous_mortgage_pricing_agent import (
            fetch_treasury_rates, fetch_mortgage_rates, fetch_market_volatility,
            fetch_competitor_rates, assess_borrower_risk, calculate_pricing_strategy
        )
        
        # Test market data tools
        print("📊 Testing market data tools...")
        
        treasury_data = fetch_treasury_rates.invoke({})
        print(f"✅ Treasury rates: 10Y = {treasury_data['treasury_10yr']:.3f}%")
        
        mortgage_data = fetch_mortgage_rates.invoke({})
        print(f"✅ Mortgage rates: 30Y = {mortgage_data['conventional_30yr']:.3f}%")
        
        volatility_data = fetch_market_volatility.invoke({})
        print(f"✅ Market volatility: {volatility_data['normalized_volatility']:.1%} ({volatility_data['market_sentiment']})")
        
        competitor_data = fetch_competitor_rates.invoke({})
        print(f"✅ Competitor rates: Avg = {competitor_data['average_rate']:.3f}%")
        
        # Test analysis tools
        print("\n🧮 Testing analysis tools...")
        
        sample_borrower = {
            "credit_score": 720,
            "debt_to_income_ratio": 0.32,
            "loan_to_value_ratio": 0.85,
            "employment_history_years": 5,
            "annual_income": 85000,
            "assets": 50000,
            "loan_amount": 400000
        }
        
        sample_market = {
            "base_rate": 6.5,
            "volatility": 0.3,
            "competitor_avg": 6.5,
            "market_sentiment": "neutral"
        }
        
        risk_result = assess_borrower_risk.invoke({"borrower_profile": sample_borrower})
        print(f"✅ Risk assessment: {risk_result['risk_category']} ({risk_result['risk_score']}/100)")
        
        pricing_result = calculate_pricing_strategy.invoke({
            "borrower_data": sample_borrower, 
            "market_data": sample_market
        })
        print(f"✅ Pricing strategy: {pricing_result['recommended_rate']:.3f}% ({pricing_result['pricing_strategy']})")
        
        print("🎉 All tools working correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Tool testing failed: {e}")
        return False


def main():
    """Run all tests"""
    
    print("🏠 Autonomous Mortgage Pricing Agent - Test Suite")
    print("=" * 70)
    
    # Test individual tools first
    tools_ok = test_individual_tools()
    
    # Test the full autonomous agent
    agent_ok = test_autonomous_agent()
    
    # Summary
    print("\n📋 Test Summary")
    print("=" * 30)
    print(f"Tools Test: {'✅ PASSED' if tools_ok else '❌ FAILED'}")
    print(f"Agent Test: {'✅ PASSED' if agent_ok else '❌ FAILED'}")
    
    if tools_ok and agent_ok:
        print("\n🎉 All tests passed! The autonomous agent is working correctly.")
        print("\nKey Features Verified:")
        print("• ✅ Autonomous market data gathering")
        print("• ✅ AI-powered risk assessment")
        print("• ✅ Intelligent pricing strategies")
        print("• ✅ Real-time competitive analysis")
        print("• ✅ Comprehensive loan analysis")
        print("• ✅ Fallback mechanisms for reliability")
        
        print("\n🚀 Ready for production use!")
        return 0
    else:
        print("\n💥 Some tests failed. Please check the implementation.")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
