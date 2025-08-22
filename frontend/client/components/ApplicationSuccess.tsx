import React from 'react';

interface ApplicationSuccessProps {
  onBack: () => void;
  onCheckStatus: () => void;
}

export default function ApplicationSuccess({ onBack, onCheckStatus }: ApplicationSuccessProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
        <button 
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center"
        >
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="h-6 w-6">
            <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1C140D"/>
          </svg>
        </button>
        <div className="flex-1 pr-10"></div>
      </div>

      {/* Success Message */}
      <div className="px-4 py-4">
        <div className="mb-1">
          <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
        </div>
        <div className="rounded-xl bg-mortgage-cream p-3">
          <p className="text-base leading-6 text-mortgage-dark">
            🎉 Great news, Theresa! Your application has been successfully submitted.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start bg-white px-4">
        {/* Success Icon */}
        <div className="mb-6 mt-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
        </div>

        {/* Title Section */}
        <div className="py-4 text-center">
          <h1 className="text-2xl font-bold leading-8 text-mortgage-dark mb-4">
            Application Submitted Successfully
          </h1>
        </div>

        {/* Description Section */}
        <div className="py-3 text-center mb-6">
          <p className="text-base leading-6 text-mortgage-dark">
            Your mortgage application has been successfully submitted. Our team will review your application within 3-5 business days. You will receive an email notification with further instructions.
          </p>
        </div>

        {/* Application Details */}
        <div className="w-full border-t border-gray-100 pt-6 mb-8">
          <h3 className="text-lg font-bold text-mortgage-dark mb-4">
            Application Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Applicant:</span>
              <span className="text-sm text-mortgage-dark font-medium">Theresa Stewart</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Loan Amount:</span>
              <span className="text-sm text-mortgage-dark font-medium">$50,333</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Interest Rate:</span>
              <span className="text-sm text-mortgage-dark font-medium">30.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Monthly Payment:</span>
              <span className="text-sm text-mortgage-dark font-medium">$1,815</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Application ID:</span>
              <span className="text-sm text-mortgage-dark font-medium">#1713-2024</span>
            </div>
          </div>
        </div>

        {/* Check Status Button */}
        <div className="w-full">
          <button
            onClick={onCheckStatus}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 hover:bg-primary/90 transition-colors"
          >
            <span className="text-sm font-medium leading-6 text-white">
              Check Application Status
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}