import React from 'react';
import { type MortgageResults, formatCurrency } from '../lib/mortgage';

interface MortgageResultsProps {
  results: MortgageResults;
  onBack: () => void;
  onRecalculate: () => void;
  onStartApplication: () => void;
}

export default function MortgageResults({ 
  results, 
  onBack, 
  onRecalculate, 
  onStartApplication 
}: MortgageResultsProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header - Standardized */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
        <button onClick={onBack} className="flex h-10 w-10 items-center justify-center">
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="h-6 w-6">
            <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1C140D"/>
          </svg>
        </button>
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
            Here are your calculated mortgage results:
          </p>
        </div>
      </div>

      {/* Content - Standardized */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Results Title */}
        <div className="">
          <h2 className="text-lg font-bold text-mortgage-dark">
            Results
          </h2>
        </div>

        {/* Monthly Payment */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-mortgage-brown">
            Monthly Payment
          </span>
          <span className="text-lg font-bold text-mortgage-dark">
            {formatCurrency(results.monthlyPayment)}
          </span>
        </div>

        {/* Total Interest */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-mortgage-brown">
            Total Interest
          </span>
          <span className="text-lg font-bold text-mortgage-dark">
            {formatCurrency(results.totalInterest)}
          </span>
        </div>

        {/* Total Payment */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm text-mortgage-brown">
            Total Payment
          </span>
          <span className="text-lg font-bold text-mortgage-dark">
            {formatCurrency(results.totalPayment)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-6">
          {/* Re-calculate Button */}
          <button
            onClick={onRecalculate}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-mortgage-cream px-4 hover:bg-mortgage-cream/80 transition-colors"
          >
            <span className="text-sm font-medium leading-6 text-mortgage-dark">
              Re-calculate
            </span>
          </button>

          {/* Start Application Button */}
          <button
            onClick={onStartApplication}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary px-4 hover:bg-primary/90 transition-colors"
          >
            <span className="text-sm font-medium leading-6 text-white">
              Start Application
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}