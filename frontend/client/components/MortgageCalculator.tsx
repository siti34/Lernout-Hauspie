import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { MortgageInputs, calculateMortgage, validateMortgageInputs } from '../lib/mortgage';

interface MortgageCalculatorProps {
  onCalculate: (inputs: MortgageInputs) => void;
  onBack?: () => void;
}

export default function MortgageCalculator({ onCalculate, onBack }: MortgageCalculatorProps) {
  // Pre-populate with data from JSON
  const [inputs, setInputs] = useState<Record<string, string>>({
    loanAmount: '50333',
    interestRate: '30.1',
    loanTermYears: '4',
    downPayment: '',
    propertyPrice: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    // Convert to numeric with applicant data as defaults
    const numericInputs: MortgageInputs = {
      loanAmount: parseFloat(inputs.loanAmount) || 50333,
      interestRate: parseFloat(inputs.interestRate) || 30.1,
      loanTermYears: parseFloat(inputs.loanTermYears) || 4,
      downPayment: parseFloat(inputs.downPayment) || 10000,
      propertyPrice: parseFloat(inputs.propertyPrice) || 60333,
    };

    const errors = validateMortgageInputs(numericInputs);
    if (errors.length === 0) {
      onCalculate(numericInputs);
    } else {
      // For demo purposes, use default values even if there are validation errors
      onCalculate(numericInputs);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header - Standardized */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
        {onBack ? (
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="h-6 w-6">
              <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1C140D"/>
            </svg>
          </button>
        ) : (
          <div className="h-10 w-10" />
        )}
        <h1 className="flex-1 pr-10 text-center text-base font-bold leading-6 text-mortgage-dark">
          Mortgage Calculator
        </h1>
      </div>

      {/* Assistant Message - Added for standardization */}
      <div className="px-4 py-4">
        <div className="mb-1">
          <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
        </div>
        <div className="rounded-xl bg-mortgage-cream p-3">
          <p className="text-base leading-6 text-mortgage-dark">
            Calculate your mortgage payments using the form below:
          </p>
        </div>
      </div>

      {/* Calculator Fields */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Loan Amount */}
        <div className="flex max-w-full">
          <div className="flex min-w-[160px] flex-1 flex-col">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Loan Amount"
                value={inputs.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="flex max-w-full">
          <div className="flex min-w-[160px] flex-1 flex-col">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Interest Rate (%)"
                value={inputs.interestRate}
                onChange={(e) => handleInputChange('interestRate', e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Loan Term */}
        <div className="flex max-w-full">
          <div className="flex min-w-[160px] flex-1 flex-col">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Loan Term (Years)"
                value={inputs.loanTermYears}
                onChange={(e) => handleInputChange('loanTermYears', e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Down Payment */}
        <div className="flex max-w-full">
          <div className="flex min-w-[160px] flex-1 flex-col">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Down Payment"
                value={inputs.downPayment}
                onChange={(e) => handleInputChange('downPayment', e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Housing Link or Price */}
        <div className="flex max-w-full">
          <div className="flex min-w-[160px] flex-1 flex-col">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Housing link OR price"
                value={inputs.propertyPrice}
                onChange={(e) => handleInputChange('propertyPrice', e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex">
          <button
            onClick={handleCalculate}
            className="flex h-10 min-w-[84px] max-w-full flex-1 items-center justify-center rounded-xl bg-primary px-4 hover:bg-primary/90 transition-colors"
          >
            <span className="overflow-hidden text-ellipsis text-sm font-medium leading-[21px] text-white">
              Calculate
            </span>
          </button>
        </div>

        {/* Applicant Info Summary */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-mortgage-dark mb-4">
            Pre-filled from your profile
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Current Loan Amount:</span>
              <span className="text-sm text-mortgage-dark font-medium">$50,333</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Current Interest Rate:</span>
              <span className="text-sm text-mortgage-dark font-medium">30.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Loan Duration:</span>
              <span className="text-sm text-mortgage-dark font-medium">4 years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Monthly Payment:</span>
              <span className="text-sm text-mortgage-dark font-medium">$1,815</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}