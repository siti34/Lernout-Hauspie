"""
Simple test script to verify the mortgage pricing agent works correctly
"""

import sys
import traceback
from mortgage_pricing_agent import MortgagePricingAgent, BorrowerProfile, MarketConditions


def test_basic_functionality():
    """Test basic functionality of the mortgage pricing agent"""
    print("🧪 Testing Mortgage Pricing Agent...")
    
    try:
        # Create market conditions
        market_conditions = MarketConditions(
            base_rate=6.5,
            spread=0.5,
            volatility=0.4,
            treasury_10yr=4.2,
            mortgage_backed_securities_spread=0.3,
            market_sentiment="neutral",
            liquidity_premium=0.1
        )
        print("✅ Market conditions created successfully")
        
        # Create borrower profile
        borrower_profile = BorrowerProfile(
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
        )
        print("✅ Borrower profile created successfully")
        
        # Initialize agent
        agent = MortgagePricingAgent()
        print("✅ Mortgage pricing agent initialized successfully")
        
        # Run pricing
        result = agent.price_loan(borrower_profile, market_conditions)
        print("✅ Pricing calculation completed successfully")
        
        # Verify results
        assert 'pricing' in result, "Missing pricing in result"
        assert 'risk_assessment' in result, "Missing risk assessment in result"
        assert 'final_interest_rate' in result['pricing'], "Missing final interest rate"
        assert 'monthly_payment' in result['pricing'], "Missing monthly payment"
        
        print("✅ All assertions passed")
        
        # Display results
        print("\n📊 Test Results:")
        print(f"   Interest Rate: {result['pricing']['final_interest_rate']:.3f}%")
        print(f"   Monthly Payment: ${result['pricing']['monthly_payment']:,.2f}")
        print(f"   Risk Level: {result['risk_assessment']['risk_level']}")
        print(f"   Risk Score: {result['risk_assessment']['risk_score']:.1f}/100")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        print(f"   Traceback: {traceback.format_exc()}")
        return False


def test_edge_cases():
    """Test edge cases and error handling"""
    print("\n🧪 Testing Edge Cases...")
    
    agent = MortgagePricingAgent()
    
    # Test high-risk borrower
    try:
        high_risk_market = MarketConditions(
            base_rate=7.0,
            spread=0.8,
            volatility=0.8,
            treasury_10yr=4.8,
            mortgage_backed_securities_spread=0.5,
            market_sentiment="bearish",
            liquidity_premium=0.2
        )
        
        high_risk_borrower = BorrowerProfile(
            credit_score=580,
            debt_to_income_ratio=0.48,
            loan_to_value_ratio=0.97,
            employment_history_years=1,
            annual_income=45000,
            assets=5000,
            loan_amount=250000,
            property_value=257000,
            loan_term_years=30,
            loan_purpose="purchase",
            property_type="single_family",
            occupancy="primary",
            down_payment=7000
        )
        
        result = agent.price_loan(high_risk_borrower, high_risk_market)
        print("✅ High-risk borrower pricing completed")
        print(f"   High-risk rate: {result['pricing']['final_interest_rate']:.3f}%")
        
    except Exception as e:
        print(f"❌ High-risk test failed: {e}")
        return False
    
    # Test jumbo loan
    try:
        jumbo_borrower = BorrowerProfile(
            credit_score=760,
            debt_to_income_ratio=0.30,
            loan_to_value_ratio=0.80,
            employment_history_years=10,
            annual_income=200000,
            assets=200000,
            loan_amount=800000,  # Jumbo loan
            property_value=1000000,
            loan_term_years=30,
            loan_purpose="purchase",
            property_type="single_family",
            occupancy="primary",
            down_payment=200000
        )
        
        stable_market = MarketConditions(
            base_rate=6.2,
            spread=0.4,
            volatility=0.2,
            treasury_10yr=4.0,
            mortgage_backed_securities_spread=0.25,
            market_sentiment="neutral",
            liquidity_premium=0.05
        )
        
        result = agent.price_loan(jumbo_borrower, stable_market)
        print("✅ Jumbo loan pricing completed")
        print(f"   Jumbo rate: {result['pricing']['final_interest_rate']:.3f}%")
        
    except Exception as e:
        print(f"❌ Jumbo loan test failed: {e}")
        return False
    
    return True


def main():
    """Run all tests"""
    print("🏠 Mortgage Pricing Agent - Test Suite")
    print("=" * 50)
    
    # Run basic functionality test
    basic_test_passed = test_basic_functionality()
    
    # Run edge case tests
    edge_case_test_passed = test_edge_cases()
    
    # Summary
    print("\n📋 Test Summary:")
    print(f"   Basic Functionality: {'✅ PASSED' if basic_test_passed else '❌ FAILED'}")
    print(f"   Edge Cases: {'✅ PASSED' if edge_case_test_passed else '❌ FAILED'}")
    
    if basic_test_passed and edge_case_test_passed:
        print("\n🎉 All tests passed! The mortgage pricing agent is working correctly.")
        return 0
    else:
        print("\n💥 Some tests failed. Please check the implementation.")
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
