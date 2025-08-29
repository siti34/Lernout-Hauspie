"""
Mortgage Pricing Agent using LangGraph
=====================================

This module implements an agentic workflow for mortgage loan pricing that considers:
- Market conditions and volatility
- Borrower risk assessment
- Competitive pricing analysis
- Secondary market expectations
- Historical pricing data and trends
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import json
import math
from enum import Enum
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode


@dataclass
class MarketConditions:
    """Current market conditions affecting mortgage pricing"""
    base_rate: float  # Current base interest rate
    spread: float     # Market spread over base rate
    volatility: float # Market volatility index (0-1)
    treasury_10yr: float  # 10-year treasury rate
    mortgage_backed_securities_spread: float  # MBS spread
    market_sentiment: str  # "bullish", "bearish", "neutral"
    liquidity_premium: float  # Additional premium for liquidity risk


@dataclass
class BorrowerProfile:
    """Comprehensive borrower profile for risk assessment"""
    credit_score: int
    debt_to_income_ratio: float
    loan_to_value_ratio: float
    employment_history_years: int
    annual_income: float
    assets: float
    loan_amount: float
    property_value: float
    loan_term_years: int
    loan_purpose: str  # "purchase", "refinance", "cash_out"
    property_type: str  # "single_family", "condo", "townhouse", "multi_family"
    occupancy: str  # "primary", "secondary", "investment"
    down_payment: float


@dataclass
class PricingState:
    """State object for the pricing workflow"""
    borrower_profile: Optional[BorrowerProfile] = None
    market_conditions: Optional[MarketConditions] = None
    risk_assessment: Optional[Dict[str, Any]] = None
    base_pricing: Optional[Dict[str, float]] = None
    competitive_analysis: Optional[Dict[str, Any]] = None
    final_pricing: Optional[Dict[str, Any]] = None
    pricing_rationale: Optional[str] = None
    recommendations: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class RiskLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"


class MortgagePricingTools:
    """Specialized tools for mortgage pricing calculations"""
    
    @staticmethod
    def assess_credit_risk(borrower: BorrowerProfile) -> Dict[str, Any]:
        """Assess borrower credit risk based on profile"""
        risk_factors = {}
        
        # Credit score risk
        if borrower.credit_score >= 740:
            credit_risk = 0.0
        elif borrower.credit_score >= 680:
            credit_risk = 0.25
        elif borrower.credit_score >= 620:
            credit_risk = 0.75
        else:
            credit_risk = 1.5
        
        risk_factors["credit_score_adjustment"] = credit_risk
        
        # DTI risk
        if borrower.debt_to_income_ratio <= 0.28:
            dti_risk = 0.0
        elif borrower.debt_to_income_ratio <= 0.36:
            dti_risk = 0.125
        elif borrower.debt_to_income_ratio <= 0.43:
            dti_risk = 0.25
        else:
            dti_risk = 0.5
        
        risk_factors["dti_adjustment"] = dti_risk
        
        # LTV risk
        if borrower.loan_to_value_ratio <= 0.80:
            ltv_risk = 0.0
        elif borrower.loan_to_value_ratio <= 0.90:
            ltv_risk = 0.25
        elif borrower.loan_to_value_ratio <= 0.95:
            ltv_risk = 0.5
        else:
            ltv_risk = 1.0
        
        risk_factors["ltv_adjustment"] = ltv_risk
        
        # Employment stability
        if borrower.employment_history_years >= 5:
            employment_risk = 0.0
        elif borrower.employment_history_years >= 2:
            employment_risk = 0.125
        else:
            employment_risk = 0.25
        
        risk_factors["employment_adjustment"] = employment_risk
        
        # Property type and occupancy adjustments
        property_adjustments = {
            "single_family": 0.0,
            "condo": 0.125,
            "townhouse": 0.0625,
            "multi_family": 0.25
        }
        
        occupancy_adjustments = {
            "primary": 0.0,
            "secondary": 0.25,
            "investment": 0.75
        }
        
        risk_factors["property_type_adjustment"] = property_adjustments.get(borrower.property_type, 0.125)
        risk_factors["occupancy_adjustment"] = occupancy_adjustments.get(borrower.occupancy, 0.0)
        
        # Calculate overall risk level
        total_risk_adjustment = sum(risk_factors.values())
        
        if total_risk_adjustment <= 0.5:
            risk_level = RiskLevel.LOW
        elif total_risk_adjustment <= 1.0:
            risk_level = RiskLevel.MEDIUM
        elif total_risk_adjustment <= 2.0:
            risk_level = RiskLevel.HIGH
        else:
            risk_level = RiskLevel.VERY_HIGH
        
        return {
            "risk_factors": risk_factors,
            "total_risk_adjustment": total_risk_adjustment,
            "risk_level": risk_level.value,
            "risk_score": min(100, total_risk_adjustment * 20)  # Scale to 0-100
        }
    
    @staticmethod
    def calculate_base_pricing(borrower: BorrowerProfile, market: MarketConditions, 
                             risk_assessment: Dict[str, Any]) -> Dict[str, float]:
        """Calculate base pricing before competitive adjustments"""
        
        # Start with market base rate
        base_rate = market.base_rate
        
        # Add market spread and volatility premium
        market_premium = market.spread + (market.volatility * 0.5)
        
        # Add MBS spread
        mbs_premium = market.mortgage_backed_securities_spread
        
        # Add liquidity premium
        liquidity_premium = market.liquidity_premium
        
        # Add risk-based pricing adjustments
        risk_premium = risk_assessment["total_risk_adjustment"]
        
        # Loan term adjustment
        if borrower.loan_term_years == 15:
            term_adjustment = -0.25  # 15-year loans typically get better rates
        elif borrower.loan_term_years == 30:
            term_adjustment = 0.0
        else:
            term_adjustment = 0.125  # Non-standard terms get premium
        
        # Loan size adjustments (jumbo vs conforming)
        conforming_limit = 766550  # 2024 conforming loan limit
        if borrower.loan_amount > conforming_limit:
            loan_size_adjustment = 0.25  # Jumbo loan premium
        elif borrower.loan_amount < 100000:
            loan_size_adjustment = 0.125  # Small loan premium
        else:
            loan_size_adjustment = 0.0
        
        # Calculate final rate
        final_rate = (base_rate + market_premium + mbs_premium + 
                     liquidity_premium + risk_premium + term_adjustment + 
                     loan_size_adjustment)
        
        # Calculate APR (includes estimated fees)
        estimated_fees = borrower.loan_amount * 0.01  # 1% in fees
        apr = MortgagePricingTools.calculate_apr(borrower.loan_amount, final_rate, 
                                               borrower.loan_term_years, estimated_fees)
        
        # Calculate monthly payment
        monthly_payment = MortgagePricingTools.calculate_monthly_payment(
            borrower.loan_amount, final_rate, borrower.loan_term_years
        )
        
        return {
            "base_rate": base_rate,
            "market_premium": market_premium,
            "mbs_premium": mbs_premium,
            "liquidity_premium": liquidity_premium,
            "risk_premium": risk_premium,
            "term_adjustment": term_adjustment,
            "loan_size_adjustment": loan_size_adjustment,
            "final_interest_rate": final_rate,
            "apr": apr,
            "monthly_payment": monthly_payment,
            "total_interest": (monthly_payment * borrower.loan_term_years * 12) - borrower.loan_amount
        }
    
    @staticmethod
    def calculate_monthly_payment(loan_amount: float, annual_rate: float, term_years: int) -> float:
        """Calculate monthly mortgage payment"""
        monthly_rate = annual_rate / 100 / 12
        num_payments = term_years * 12
        
        if monthly_rate == 0:
            return loan_amount / num_payments
        
        return loan_amount * (monthly_rate * (1 + monthly_rate)**num_payments) / \
               ((1 + monthly_rate)**num_payments - 1)
    
    @staticmethod
    def calculate_apr(loan_amount: float, annual_rate: float, term_years: int, fees: float) -> float:
        """Calculate APR including fees"""
        # Simplified APR calculation
        total_cost = (MortgagePricingTools.calculate_monthly_payment(loan_amount, annual_rate, term_years) 
                     * term_years * 12) + fees
        
        # Use iterative method to find APR
        apr_guess = annual_rate
        for _ in range(10):  # Simple iteration
            pv_payments = sum([
                (MortgagePricingTools.calculate_monthly_payment(loan_amount, annual_rate, term_years) + fees/12/term_years) / 
                (1 + apr_guess/100/12)**month 
                for month in range(1, term_years * 12 + 1)
            ])
            
            if abs(pv_payments - loan_amount) < 1:
                break
            
            if pv_payments > loan_amount:
                apr_guess += 0.01
            else:
                apr_guess -= 0.01
        
        return max(annual_rate, apr_guess)  # APR should never be less than interest rate
    
    @staticmethod
    def analyze_competitive_position(base_pricing: Dict[str, float], 
                                   market_conditions: MarketConditions) -> Dict[str, Any]:
        """Analyze competitive position and suggest adjustments"""
        
        # Simulate competitor rates (in practice, this would come from market data)
        competitor_rates = {
            "bank_a": base_pricing["final_interest_rate"] - 0.125,
            "bank_b": base_pricing["final_interest_rate"] + 0.0625,
            "credit_union": base_pricing["final_interest_rate"] - 0.0625,
            "online_lender": base_pricing["final_interest_rate"] - 0.1875
        }
        
        our_rate = base_pricing["final_interest_rate"]
        avg_competitor_rate = sum(competitor_rates.values()) / len(competitor_rates)
        
        competitive_position = "competitive" if abs(our_rate - avg_competitor_rate) <= 0.125 else \
                             "above_market" if our_rate > avg_competitor_rate else "below_market"
        
        # Suggest adjustments based on market conditions and competitive position
        suggested_adjustments = []
        
        if competitive_position == "above_market":
            if market_conditions.market_sentiment == "bearish":
                suggested_adjustments.append("Consider reducing rate by 0.0625% to maintain competitiveness")
            else:
                suggested_adjustments.append("Rate is above market but may be justified by current conditions")
        
        elif competitive_position == "below_market":
            suggested_adjustments.append("Rate is below market - consider if margins are adequate")
        
        return {
            "competitor_rates": competitor_rates,
            "our_rate": our_rate,
            "average_competitor_rate": avg_competitor_rate,
            "competitive_position": competitive_position,
            "rate_differential": our_rate - avg_competitor_rate,
            "suggested_adjustments": suggested_adjustments
        }


class MortgagePricingAgent:
    """Main mortgage pricing agent using LangGraph"""
    
    def __init__(self):
        self.tools = MortgagePricingTools()
        self.workflow = self._build_workflow()
    
    def _build_workflow(self) -> StateGraph:
        """Build the LangGraph workflow for mortgage pricing"""
        
        workflow = StateGraph(Dict[str, Any])
        
        # Add nodes
        workflow.add_node("validate_inputs", self._validate_inputs)
        workflow.add_node("assess_risk", self._assess_risk)
        workflow.add_node("calculate_base_pricing", self._calculate_base_pricing)
        workflow.add_node("competitive_analysis", self._competitive_analysis)
        workflow.add_node("final_pricing_decision", self._final_pricing_decision)
        workflow.add_node("generate_recommendations", self._generate_recommendations)
        
        # Add edges
        workflow.add_edge("validate_inputs", "assess_risk")
        workflow.add_edge("assess_risk", "calculate_base_pricing")
        workflow.add_edge("calculate_base_pricing", "competitive_analysis")
        workflow.add_edge("competitive_analysis", "final_pricing_decision")
        workflow.add_edge("final_pricing_decision", "generate_recommendations")
        workflow.add_edge("generate_recommendations", END)
        
        # Set entry point
        workflow.set_entry_point("validate_inputs")
        
        return workflow.compile()
    
    def _validate_inputs(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Validate borrower profile and market conditions"""
        warnings = state.get("warnings", [])
        
        if not state.get("borrower_profile"):
            raise ValueError("Borrower profile is required")
        
        if not state.get("market_conditions"):
            raise ValueError("Market conditions are required")
        
        borrower = state["borrower_profile"]
        
        # Validate borrower data
        if borrower.credit_score < 300 or borrower.credit_score > 850:
            warnings.append("Credit score outside normal range")
        
        if borrower.debt_to_income_ratio > 0.5:
            warnings.append("High debt-to-income ratio may affect loan approval")
        
        if borrower.loan_to_value_ratio > 0.97:
            warnings.append("High LTV ratio - consider mortgage insurance requirements")
        
        if borrower.loan_amount <= 0:
            raise ValueError("Loan amount must be positive")
        
        state["warnings"] = warnings
        return state
    
    def _assess_risk(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Assess borrower risk using specialized tools"""
        risk_assessment = self.tools.assess_credit_risk(state["borrower_profile"])
        state["risk_assessment"] = risk_assessment
        
        warnings = state.get("warnings", [])
        
        # Add risk-based warnings
        if risk_assessment["risk_level"] == "very_high":
            warnings.append("Very high risk borrower - consider additional review")
        elif risk_assessment["risk_level"] == "high":
            warnings.append("High risk borrower - enhanced documentation may be required")
        
        state["warnings"] = warnings
        return state
    
    def _calculate_base_pricing(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate base pricing before competitive adjustments"""
        base_pricing = self.tools.calculate_base_pricing(
            state["borrower_profile"], 
            state["market_conditions"], 
            state["risk_assessment"]
        )
        state["base_pricing"] = base_pricing
        return state
    
    def _competitive_analysis(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Perform competitive analysis"""
        competitive_analysis = self.tools.analyze_competitive_position(
            state["base_pricing"], 
            state["market_conditions"]
        )
        state["competitive_analysis"] = competitive_analysis
        return state
    
    def _final_pricing_decision(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Make final pricing decision considering all factors"""
        base_rate = state["base_pricing"]["final_interest_rate"]
        competitive_position = state["competitive_analysis"]["competitive_position"]
        market_sentiment = state["market_conditions"].market_sentiment
        volatility = state["market_conditions"].volatility
        
        # Adjust rate based on strategic considerations
        final_rate = base_rate
        adjustments = []
        
        # Market sentiment adjustments
        if market_sentiment == "bearish" and competitive_position == "above_market":
            final_rate -= 0.0625
            adjustments.append("Reduced rate by 6.25bps due to bearish market sentiment")
        elif market_sentiment == "bullish" and volatility < 0.3:
            # In stable, bullish markets, we can be less aggressive on pricing
            pass
        
        # Competitive adjustments
        if competitive_position == "above_market":
            rate_diff = state["competitive_analysis"]["rate_differential"]
            if rate_diff > 0.25:
                final_rate -= 0.125
                adjustments.append("Reduced rate by 12.5bps to improve competitive position")
        
        # High volatility premium
        if volatility > 0.7:
            final_rate += 0.0625
            adjustments.append("Added 6.25bps volatility premium due to market uncertainty")
        
        # Recalculate payment and APR with final rate
        monthly_payment = self.tools.calculate_monthly_payment(
            state["borrower_profile"].loan_amount, 
            final_rate, 
            state["borrower_profile"].loan_term_years
        )
        
        estimated_fees = state["borrower_profile"].loan_amount * 0.01
        apr = self.tools.calculate_apr(
            state["borrower_profile"].loan_amount, 
            final_rate, 
            state["borrower_profile"].loan_term_years, 
            estimated_fees
        )
        
        state["final_pricing"] = {
            "final_interest_rate": final_rate,
            "initial_rate": base_rate,
            "rate_adjustments": adjustments,
            "monthly_payment": monthly_payment,
            "apr": apr,
            "total_interest": (monthly_payment * state["borrower_profile"].loan_term_years * 12) - state["borrower_profile"].loan_amount,
            "estimated_closing_costs": estimated_fees
        }
        
        return state
    
    def _generate_recommendations(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate final recommendations and rationale"""
        recommendations = state.get("recommendations", [])
        
        # Risk-based recommendations
        if state["risk_assessment"]["risk_level"] in ["high", "very_high"]:
            recommendations.append("Consider requiring additional documentation or reserves")
        
        # LTV recommendations
        if state["borrower_profile"].loan_to_value_ratio > 0.80:
            recommendations.append("Mortgage insurance required")
        
        # Market-based recommendations
        if state["market_conditions"].volatility > 0.6:
            recommendations.append("Consider rate lock options due to market volatility")
        
        # Competitive recommendations
        if state["competitive_analysis"]["competitive_position"] == "above_market":
            recommendations.append("Monitor competitor rates closely - may need adjustment")
        
        # Generate pricing rationale
        rationale = f"""
        Pricing Decision Rationale:
        
        Base Market Rate: {state["base_pricing"]['base_rate']:.3f}%
        Risk Premium: {state["base_pricing"]['risk_premium']:.3f}%
        Market Adjustments: {state["base_pricing"]['market_premium']:.3f}%
        Final Rate: {state["final_pricing"]['final_interest_rate']:.3f}%
        
        Risk Assessment: {state["risk_assessment"]['risk_level'].title()} risk borrower
        Competitive Position: {state["competitive_analysis"]['competitive_position'].replace('_', ' ').title()}
        Market Conditions: {state["market_conditions"].market_sentiment.title()} sentiment with {state["market_conditions"].volatility:.1%} volatility
        
        This pricing reflects current market conditions, borrower risk profile, and competitive landscape.
        Rate adjustments: {'; '.join(state["final_pricing"].get('rate_adjustments', ['None']))}
        """
        
        state["recommendations"] = recommendations
        state["pricing_rationale"] = rationale.strip()
        
        return state
    
    def price_loan(self, borrower_profile: BorrowerProfile, 
                   market_conditions: MarketConditions) -> Dict[str, Any]:
        """Main entry point for loan pricing"""
        
        initial_state = {
            "borrower_profile": borrower_profile,
            "market_conditions": market_conditions,
            "risk_assessment": None,
            "base_pricing": None,
            "competitive_analysis": None,
            "final_pricing": None,
            "pricing_rationale": None,
            "recommendations": [],
            "warnings": []
        }
        
        # Run the workflow
        final_state = self.workflow.invoke(initial_state)
        
        return {
            "pricing": final_state["final_pricing"],
            "risk_assessment": final_state["risk_assessment"],
            "competitive_analysis": final_state["competitive_analysis"],
            "recommendations": final_state["recommendations"],
            "warnings": final_state["warnings"],
            "rationale": final_state["pricing_rationale"]
        }


# Example usage and test case
if __name__ == "__main__":
    # Create sample market conditions
    market_conditions = MarketConditions(
        base_rate=6.5,
        spread=0.5,
        volatility=0.4,
        treasury_10yr=4.2,
        mortgage_backed_securities_spread=0.3,
        market_sentiment="neutral",
        liquidity_premium=0.1
    )
    
    # Create sample borrower profile
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
    
    # Initialize and run the pricing agent
    agent = MortgagePricingAgent()
    result = agent.price_loan(borrower_profile, market_conditions)
    
    print("Mortgage Pricing Results:")
    print("=" * 50)
    print(f"Final Interest Rate: {result['pricing']['final_interest_rate']:.3f}%")
    print(f"APR: {result['pricing']['apr']:.3f}%")
    print(f"Monthly Payment: ${result['pricing']['monthly_payment']:,.2f}")
    print(f"Total Interest: ${result['pricing']['total_interest']:,.2f}")
    print("\nRisk Assessment:")
    print(f"Risk Level: {result['risk_assessment']['risk_level'].title()}")
    print(f"Risk Score: {result['risk_assessment']['risk_score']:.1f}/100")
    print("\nRecommendations:")
    for rec in result['recommendations']:
        print(f"- {rec}")
    
    if result['warnings']:
        print("\nWarnings:")
        for warning in result['warnings']:
            print(f"⚠️ {warning}")
    
    print("\nPricing Rationale:")
    print(result['rationale'])
