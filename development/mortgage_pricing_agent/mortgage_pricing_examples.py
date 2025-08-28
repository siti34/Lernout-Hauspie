"""
Mortgage Pricing Agent Examples and Test Cases
==============================================

This module demonstrates various scenarios for the mortgage pricing agent,
showing how different borrower profiles and market conditions affect pricing.
"""

from mortgage_pricing_agent import (
    MortgagePricingAgent, BorrowerProfile, MarketConditions, PricingState
)
import json
from datetime import datetime


class MortgagePricingExamples:
    """Collection of example scenarios for mortgage pricing"""
    
    def __init__(self):
        self.agent = MortgagePricingAgent()
    
    def create_market_scenarios(self):
        """Create different market condition scenarios"""
        return {
            "stable_market": MarketConditions(
                base_rate=6.5,
                spread=0.4,
                volatility=0.2,
                treasury_10yr=4.1,
                mortgage_backed_securities_spread=0.25,
                market_sentiment="neutral",
                liquidity_premium=0.05
            ),
            
            "volatile_market": MarketConditions(
                base_rate=7.0,
                spread=0.8,
                volatility=0.7,
                treasury_10yr=4.8,
                mortgage_backed_securities_spread=0.5,
                market_sentiment="bearish",
                liquidity_premium=0.2
            ),
            
            "favorable_market": MarketConditions(
                base_rate=5.8,
                spread=0.3,
                volatility=0.15,
                treasury_10yr=3.5,
                mortgage_backed_securities_spread=0.2,
                market_sentiment="bullish",
                liquidity_premium=0.05
            ),
            
            "competitive_market": MarketConditions(
                base_rate=6.2,
                spread=0.35,
                volatility=0.3,
                treasury_10yr=3.9,
                mortgage_backed_securities_spread=0.3,
                market_sentiment="neutral",
                liquidity_premium=0.1
            )
        }
    
    def create_borrower_scenarios(self):
        """Create different borrower profile scenarios"""
        return {
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
            
            "good_borrower": BorrowerProfile(
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
            
            "fair_borrower": BorrowerProfile(
                credit_score=680,
                debt_to_income_ratio=0.38,
                loan_to_value_ratio=0.90,
                employment_history_years=3,
                annual_income=65000,
                assets=25000,
                loan_amount=320000,
                property_value=355000,
                loan_term_years=30,
                loan_purpose="purchase",
                property_type="single_family",
                occupancy="primary",
                down_payment=35000
            ),
            
            "high_risk_borrower": BorrowerProfile(
                credit_score=620,
                debt_to_income_ratio=0.45,
                loan_to_value_ratio=0.95,
                employment_history_years=1,
                annual_income=55000,
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
            ),
            
            "investment_property": BorrowerProfile(
                credit_score=740,
                debt_to_income_ratio=0.35,
                loan_to_value_ratio=0.75,
                employment_history_years=7,
                annual_income=95000,
                assets=80000,
                loan_amount=300000,
                property_value=400000,
                loan_term_years=30,
                loan_purpose="purchase",
                property_type="single_family",
                occupancy="investment",
                down_payment=100000
            ),
            
            "refinance_borrower": BorrowerProfile(
                credit_score=700,
                debt_to_income_ratio=0.28,
                loan_to_value_ratio=0.70,
                employment_history_years=6,
                annual_income=90000,
                assets=60000,
                loan_amount=350000,
                property_value=500000,
                loan_term_years=30,
                loan_purpose="refinance",
                property_type="single_family",
                occupancy="primary",
                down_payment=0  # No down payment for refinance
            ),
            
            "first_time_buyer": BorrowerProfile(
                credit_score=710,
                debt_to_income_ratio=0.35,
                loan_to_value_ratio=0.97,
                employment_history_years=2,
                annual_income=70000,
                assets=20000,
                loan_amount=291000,
                property_value=300000,
                loan_term_years=30,
                loan_purpose="purchase",
                property_type="single_family",
                occupancy="primary",
                down_payment=9000
            ),
            
            "15_year_borrower": BorrowerProfile(
                credit_score=750,
                debt_to_income_ratio=0.30,
                loan_to_value_ratio=0.80,
                employment_history_years=8,
                annual_income=110000,
                assets=75000,
                loan_amount=400000,
                property_value=500000,
                loan_term_years=15,
                loan_purpose="purchase",
                property_type="single_family",
                occupancy="primary",
                down_payment=100000
            )
        }
    
    def run_scenario_analysis(self):
        """Run comprehensive scenario analysis"""
        market_scenarios = self.create_market_scenarios()
        borrower_scenarios = self.create_borrower_scenarios()
        
        results = {}
        
        print("Mortgage Pricing Scenario Analysis")
        print("=" * 80)
        print()
        
        # Test key scenarios
        key_scenarios = [
            ("excellent_borrower", "stable_market"),
            ("good_borrower", "stable_market"),
            ("fair_borrower", "volatile_market"),
            ("high_risk_borrower", "volatile_market"),
            ("jumbo_borrower", "favorable_market"),
            ("investment_property", "competitive_market"),
            ("first_time_buyer", "stable_market"),
            ("15_year_borrower", "favorable_market")
        ]
        
        for borrower_type, market_type in key_scenarios:
            borrower = borrower_scenarios[borrower_type]
            market = market_scenarios[market_type]
            
            print(f"Scenario: {borrower_type.replace('_', ' ').title()} in {market_type.replace('_', ' ').title()}")
            print("-" * 60)
            
            try:
                result = self.agent.price_loan(borrower, market)
                
                pricing = result['pricing']
                risk = result['risk_assessment']
                
                print(f"📊 Loan Amount: ${borrower.loan_amount:,}")
                print(f"💰 Interest Rate: {pricing['final_interest_rate']:.3f}%")
                print(f"📈 APR: {pricing['apr']:.3f}%")
                print(f"🏠 Monthly Payment: ${pricing['monthly_payment']:,.2f}")
                print(f"📉 Risk Level: {risk['risk_level'].title()}")
                print(f"🎯 Risk Score: {risk['risk_score']:.1f}/100")
                
                if pricing.get('rate_adjustments'):
                    print("⚙️ Rate Adjustments:")
                    for adjustment in pricing['rate_adjustments']:
                        print(f"   • {adjustment}")
                
                if result['recommendations']:
                    print("💡 Recommendations:")
                    for rec in result['recommendations']:
                        print(f"   • {rec}")
                
                if result['warnings']:
                    print("⚠️ Warnings:")
                    for warning in result['warnings']:
                        print(f"   • {warning}")
                
                # Store results for comparison
                scenario_key = f"{borrower_type}_{market_type}"
                results[scenario_key] = {
                    "borrower_type": borrower_type,
                    "market_type": market_type,
                    "interest_rate": pricing['final_interest_rate'],
                    "monthly_payment": pricing['monthly_payment'],
                    "risk_level": risk['risk_level'],
                    "risk_score": risk['risk_score']
                }
                
            except Exception as e:
                print(f"❌ Error processing scenario: {e}")
            
            print()
        
        # Generate comparison analysis
        self._generate_comparison_analysis(results)
        
        return results
    
    def _generate_comparison_analysis(self, results):
        """Generate comparison analysis across scenarios"""
        print("Comparative Analysis")
        print("=" * 50)
        
        # Sort by interest rate
        sorted_results = sorted(results.items(), key=lambda x: x[1]['interest_rate'])
        
        print("📊 Interest Rates (Lowest to Highest):")
        for scenario, data in sorted_results:
            borrower_type = data['borrower_type'].replace('_', ' ').title()
            market_type = data['market_type'].replace('_', ' ').title()
            rate = data['interest_rate']
            print(f"   {rate:.3f}% - {borrower_type} ({market_type})")
        
        print()
        
        # Risk level distribution
        risk_levels = {}
        for scenario, data in results.items():
            risk_level = data['risk_level']
            risk_levels[risk_level] = risk_levels.get(risk_level, 0) + 1
        
        print("🎯 Risk Level Distribution:")
        for risk_level, count in risk_levels.items():
            print(f"   {risk_level.title()}: {count} scenarios")
        
        print()
        
        # Rate spread analysis
        rates = [data['interest_rate'] for data in results.values()]
        min_rate = min(rates)
        max_rate = max(rates)
        avg_rate = sum(rates) / len(rates)
        
        print("📈 Rate Statistics:")
        print(f"   Lowest Rate: {min_rate:.3f}%")
        print(f"   Highest Rate: {max_rate:.3f}%")
        print(f"   Average Rate: {avg_rate:.3f}%")
        print(f"   Rate Spread: {max_rate - min_rate:.3f}%")
        
    def demonstrate_market_sensitivity(self):
        """Demonstrate how market conditions affect the same borrower"""
        print("\nMarket Sensitivity Analysis")
        print("=" * 50)
        
        # Use good borrower profile across different markets
        borrower_scenarios = self.create_borrower_scenarios()
        market_scenarios = self.create_market_scenarios()
        
        borrower = borrower_scenarios["good_borrower"]
        
        print(f"Borrower Profile: Credit Score {borrower.credit_score}, "
              f"DTI {borrower.debt_to_income_ratio:.1%}, "
              f"LTV {borrower.loan_to_value_ratio:.1%}")
        print()
        
        market_results = []
        
        for market_name, market_conditions in market_scenarios.items():
            result = self.agent.price_loan(borrower, market_conditions)
            pricing = result['pricing']
            
            market_results.append({
                "market": market_name,
                "rate": pricing['final_interest_rate'],
                "payment": pricing['monthly_payment'],
                "sentiment": market_conditions.market_sentiment,
                "volatility": market_conditions.volatility
            })
            
            print(f"🌍 {market_name.replace('_', ' ').title()}:")
            print(f"   Rate: {pricing['final_interest_rate']:.3f}%")
            print(f"   Payment: ${pricing['monthly_payment']:,.2f}")
            print(f"   Sentiment: {market_conditions.market_sentiment.title()}")
            print(f"   Volatility: {market_conditions.volatility:.1%}")
            print()
        
        # Calculate impact
        rates = [r['rate'] for r in market_results]
        payments = [r['payment'] for r in market_results]
        
        rate_impact = max(rates) - min(rates)
        payment_impact = max(payments) - min(payments)
        
        print(f"📊 Market Impact on Same Borrower:")
        print(f"   Rate Range: {rate_impact:.3f}% ({min(rates):.3f}% - {max(rates):.3f}%)")
        print(f"   Payment Range: ${payment_impact:,.2f} (${min(payments):,.2f} - ${max(payments):,.2f})")
        print(f"   Annual Payment Impact: ${payment_impact * 12:,.2f}")
    
    def export_results_to_json(self, results, filename="mortgage_pricing_results.json"):
        """Export results to JSON file for further analysis"""
        export_data = {
            "timestamp": datetime.now().isoformat(),
            "scenarios": results,
            "summary": {
                "total_scenarios": len(results),
                "rate_range": {
                    "min": min(r['interest_rate'] for r in results.values()),
                    "max": max(r['interest_rate'] for r in results.values()),
                    "avg": sum(r['interest_rate'] for r in results.values()) / len(results)
                }
            }
        }
        
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2, default=str)
        
        print(f"Results exported to {filename}")


def main():
    """Run comprehensive mortgage pricing examples"""
    examples = MortgagePricingExamples()
    
    print("🏠 Mortgage Pricing Agent - Comprehensive Examples")
    print("=" * 80)
    print()
    
    # Run scenario analysis
    results = examples.run_scenario_analysis()
    
    # Demonstrate market sensitivity
    examples.demonstrate_market_sensitivity()
    
    # Export results
    examples.export_results_to_json(results)
    
    print("\n✅ Analysis Complete!")
    print("\nKey Insights:")
    print("• Market conditions significantly impact pricing (volatility adds premium)")
    print("• Credit score and LTV are primary risk factors")
    print("• Investment properties carry higher rates than primary residences")
    print("• 15-year loans typically receive better rates than 30-year")
    print("• Jumbo loans may have different pricing dynamics")


if __name__ == "__main__":
    main()
