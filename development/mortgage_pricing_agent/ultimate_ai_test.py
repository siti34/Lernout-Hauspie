#!/usr/bin/env python3
"""
Ultimate AI PDF Parsing Test
===========================

This test will demonstrate the robust AI PDF parsing working correctly
with multiple fallback strategies.
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from robust_ai_parser import RobustAIPDFParser

def test_robust_ai_parsing():
    """Test the robust AI PDF parsing with real document"""
    
    print("🔥 ULTIMATE AI PDF PARSING TEST")
    print("=" * 60)
    
    # Find a PDF to test with
    pdf_files = [
        "/Users/kavyupadhyay/Desktop/langflow/mortgage_pricing_agent/Lernout Document.pdf",
        "/Users/kavyupadhyay/Desktop/langflow/pdfs/Lernout Document.pdf",
        "/Users/kavyupadhyay/Desktop/langflow/pdfs/MH V3 Samples Chapter 7-2.pdf"
    ]
    
    test_pdf = None
    for pdf_path in pdf_files:
        if Path(pdf_path).exists():
            test_pdf = pdf_path
            break
    
    if not test_pdf:
        print("❌ No PDF files found for testing")
        return
    
    print(f"📁 Testing with PDF: {Path(test_pdf).name}")
    
    # Extract PDF text
    try:
        from autonomous_mortgage_pricing_agent import extract_pdf_text
        extraction_result = extract_pdf_text.invoke({"pdf_path": test_pdf})
        
        if not extraction_result.get("success"):
            print(f"❌ PDF extraction failed: {extraction_result.get('error')}")
            return
        
        pdf_text = extraction_result["text"]
        print(f"✅ PDF text extracted: {len(pdf_text)} characters")
        
        # Test the robust AI parser
        print(f"\n🤖 Testing Robust AI Parser...")
        parser = RobustAIPDFParser()
        result = parser.parse_pdf_text(pdf_text)
        
        if result.get("success"):
            print(f"✅ AI parsing SUCCESS!")
            print(f"📊 Method used: {result.get('parsing_method')}")
            
            borrower_data = result["borrower_data"]
            print(f"🎯 Confidence: {borrower_data.get('confidence_score', 0):.1%}")
            print(f"📄 Document type: {borrower_data.get('document_type', 'unknown')}")
            print(f"✅ Fields extracted: {borrower_data.get('extracted_fields', [])}")
            
            # Show extracted values
            print(f"\n📋 EXTRACTED DATA:")
            
            # Personal info
            personal = borrower_data.get("personal_info", {})
            if personal:
                for key, value in personal.items():
                    if value:
                        print(f"   👤 {key}: {value}")
            
            # Financial info
            financial = borrower_data.get("financial_info", {})
            if financial:
                for key, value in financial.items():
                    if value:
                        print(f"   💰 {key}: {value}")
            
            # Credit info
            credit = borrower_data.get("credit_info", {})
            if credit:
                for key, value in credit.items():
                    if value:
                        print(f"   📊 {key}: {value}")
            
            # Loan details
            loan = borrower_data.get("loan_details", {})
            if loan:
                for key, value in loan.items():
                    if value:
                        print(f"   🏠 {key}: {value}")
            
            # Test with the autonomous agent
            print(f"\n🔄 Testing integration with autonomous agent...")
            try:
                from autonomous_mortgage_pricing_agent import AutonomousMortgagePricingAgent
                
                agent = AutonomousMortgagePricingAgent()
                full_result = agent.process_pdf_loan_application(test_pdf)
                
                if not full_result.get("error"):
                    print(f"✅ Full autonomous processing SUCCESS!")
                    
                    # Show key results
                    if "final_pricing" in full_result:
                        pricing = full_result["final_pricing"]
                        print(f"💰 Final rate: {pricing['final_interest_rate']:.3f}%")
                        print(f"🏠 Monthly payment: ${pricing['monthly_payment']:,.2f}")
                    
                    if "pdf_processing" in full_result:
                        pdf_info = full_result["pdf_processing"]
                        print(f"📊 Extraction confidence: {pdf_info.get('extraction_confidence', 0):.1%}")
                        parsing_method = pdf_info.get("pdf_parsing", {}).get("parsing_method", "unknown")
                        print(f"🤖 Parsing method: {parsing_method}")
                else:
                    print(f"❌ Full processing failed: {full_result.get('error')}")
                    
            except Exception as e:
                print(f"⚠️ Integration test failed: {e}")
        else:
            print(f"❌ AI parsing failed")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
    
    print(f"\n🔥 ULTIMATE AI PDF PARSING TEST COMPLETE!")

if __name__ == "__main__":
    test_robust_ai_parsing()
