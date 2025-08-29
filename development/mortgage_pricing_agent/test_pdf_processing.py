#!/usr/bin/env python3
"""
Simple test for PDF processing capabilities
"""

import os
import sys
from pathlib import Path

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_pdf_processing():
    """Test PDF processing functionality"""
    
    print("🧪 Testing PDF Processing Capabilities")
    print("=" * 50)
    
    try:
        # Test imports
        print("1. Testing imports...")
        from autonomous_mortgage_pricing_agent import (
            AutonomousMortgagePricingAgent, 
            extract_pdf_text,
            parse_pdf_to_borrower_profile,
            create_borrower_profile_from_pdf_data,
            PDF_AVAILABLE
        )
        print(f"   ✅ All imports successful")
        print(f"   📄 PDF libraries available: {PDF_AVAILABLE}")
        
        # Test agent initialization
        print("\n2. Testing agent initialization...")
        agent = AutonomousMortgagePricingAgent()
        print(f"   ✅ Agent initialized")
        print(f"   🔧 PDF tools available: {len([t for t in agent.tools.keys() if 'pdf' in t])}")
        
        # Check for available PDFs
        print("\n3. Checking for available PDFs...")
        pdf_files = [
            "/Users/kavyupadhyay/Desktop/langflow/mortgage_pricing_agent/Lernout Document.pdf",
            "/Users/kavyupadhyay/Desktop/langflow/pdfs/Lernout Document.pdf",
            "/Users/kavyupadhyay/Desktop/langflow/pdfs/MH V3 Samples Chapter 7-2.pdf"
        ]
        
        available_pdfs = []
        for pdf_path in pdf_files:
            if Path(pdf_path).exists():
                available_pdfs.append(pdf_path)
                print(f"   ✅ Found: {Path(pdf_path).name}")
        
        if not available_pdfs:
            print("   ⚠️ No PDF files found for testing")
            return
        
        # Test PDF text extraction
        print(f"\n4. Testing PDF text extraction...")
        test_pdf = available_pdfs[0]
        extraction_result = extract_pdf_text.invoke({"pdf_path": test_pdf})
        
        if extraction_result.get("success"):
            print(f"   ✅ Text extraction successful")
            print(f"   📊 Text length: {extraction_result.get('text_length', 0)} characters")
            print(f"   🔧 Methods used: {extraction_result.get('extraction_methods', [])}")
            
            # Test AI parsing (if available)
            print(f"\n5. Testing AI parsing...")
            if agent.llm:
                parsing_result = parse_pdf_to_borrower_profile.invoke({
                    "pdf_text": extraction_result["text"][:2000],  # First 2000 chars for testing
                    "llm_instance": agent.llm
                })
                
                if parsing_result.get("success"):
                    print(f"   ✅ AI parsing successful")
                    print(f"   🤖 Method: {parsing_result.get('parsing_method', 'unknown')}")
                    
                    # Test profile creation
                    print(f"\n6. Testing profile creation...")
                    profile_result = create_borrower_profile_from_pdf_data.invoke({
                        "pdf_data": parsing_result
                    })
                    
                    if profile_result.get("success"):
                        print(f"   ✅ Profile creation successful")
                        profile_data = profile_result.get("profile_data", {})
                        print(f"   💰 Loan amount: ${profile_data.get('loan_amount', 0):,}")
                        print(f"   📊 Credit score: {profile_data.get('credit_score', 'Not found')}")
                    else:
                        print(f"   ❌ Profile creation failed: {profile_result.get('error', 'Unknown error')}")
                else:
                    print(f"   ❌ AI parsing failed: {parsing_result.get('error', 'Unknown error')}")
            else:
                print(f"   ⚠️ No LLM available for AI parsing")
        else:
            print(f"   ❌ Text extraction failed: {extraction_result.get('error', 'Unknown error')}")
        
        print(f"\n✅ PDF Processing Test Complete!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_pdf_processing()
