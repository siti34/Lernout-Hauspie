import React from 'react';

interface ApplicationStatusProps {
  onBack: () => void;
  onEditApplication: () => void;
}

export default function ApplicationStatus({ onBack, onEditApplication }: ApplicationStatusProps) {
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
        <h1 className="flex-1 pr-10 text-center text-base font-bold leading-6 text-mortgage-dark">
          Application Status
        </h1>
      </div>

      {/* Assistant Message */}
      <div className="px-4 py-4">
        <div className="mb-1">
          <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
        </div>
        <div className="rounded-xl bg-mortgage-cream p-3">
          <p className="text-base leading-6 text-mortgage-dark">
            Here's the current status of your mortgage application:
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Status Card */}
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-mortgage-dark">Application Submitted</h2>
              <p className="text-sm text-green-600">Under Review</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Application ID:</span>
              <span className="text-sm text-mortgage-dark font-medium">#1713-2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Submitted:</span>
              <span className="text-sm text-mortgage-dark font-medium">December 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Expected Decision:</span>
              <span className="text-sm text-mortgage-dark font-medium">December 20, 2024</span>
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="">
          <h3 className="text-lg font-bold text-mortgage-dark mb-4">
            Application Details
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
              <span className="text-sm text-mortgage-brown">Loan Term:</span>
              <span className="text-sm text-mortgage-dark font-medium">4 years</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="">
          <h3 className="text-lg font-bold text-mortgage-dark mb-4">
            Application Progress
          </h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold mr-3">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-sm text-mortgage-dark font-medium">Application Submitted</p>
                <p className="text-xs text-green-600">Completed on Dec 15, 2024</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold mr-3">
                2
              </div>
              <div className="flex-1">
                <p className="text-sm text-mortgage-dark font-medium">Document Review</p>
                <p className="text-xs text-primary">In Progress</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-600 text-xs font-bold mr-3">
                3
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Credit Check</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300 text-gray-600 text-xs font-bold mr-3">
                4
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">Final Decision</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-mortgage-dark mb-4">
            Need Help?
          </h3>
          <p className="text-sm text-mortgage-brown mb-4">
            If you have any questions about your application, please contact our support team.
          </p>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm text-mortgage-brown mr-2">Phone:</span>
              <span className="text-sm text-mortgage-dark">+358 (0) 100 0500</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-mortgage-brown mr-2">Email:</span>
              <span className="text-sm text-mortgage-dark">support@op.fi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={onEditApplication}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-mortgage-cream px-4 hover:bg-mortgage-cream/80 transition-colors"
        >
          <span className="text-sm font-medium leading-6 text-mortgage-dark">
            Edit Application Details
          </span>
        </button>
      </div>
    </div>
  );
}