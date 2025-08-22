import React, { useState } from 'react';

interface UploadDocumentsProps {
  onBack: () => void;
  onSubmit: () => void;
}

interface DocumentStatus {
  id: string;
  name: string;
  status: 'uploaded' | 'pending';
}

export default function UploadDocuments({ onBack, onSubmit }: UploadDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentStatus[]>([
    {
      id: 'government-id',
      name: 'Government-issued ID',
      status: 'uploaded'
    },
    {
      id: 'proof-income',
      name: 'Proof of Income',
      status: 'uploaded'
    },
    {
      id: 'bank-statements',
      name: 'Bank Statements',
      status: 'pending'
    }
  ]);

  const handleFileUpload = () => {
    // Simulate file upload
    console.log('File upload triggered');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Handle file drop
    console.log('Files dropped');
  };

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
          Upload Documents
        </h1>
      </div>

      {/* Assistant Message */}
      <div className="px-4 py-4">
        <div className="mb-1">
          <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
        </div>
        <div className="rounded-xl bg-mortgage-cream p-3">
          <p className="text-base leading-6 text-mortgage-dark">
            Please upload the following documents to complete your mortgage application for Theresa Stewart.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Upload Area */}
        <div className="">
          <div
            className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-mortgage-cream bg-white px-6 py-14"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-mortgage-dark leading-6 mb-2">
                Drag and drop files here
              </h3>
              <p className="text-sm text-mortgage-brown leading-[21px]">
                Or
              </p>
            </div>
            <button
              onClick={handleFileUpload}
              className="flex h-10 items-center justify-center rounded-xl bg-mortgage-cream px-4 hover:bg-mortgage-cream/80 transition-colors"
            >
              <span className="text-sm font-medium leading-[21px] text-mortgage-dark">
                Browse Files
              </span>
            </button>
          </div>
        </div>

        {/* Required Documents */}
        <div className="">
          <h2 className="text-lg font-bold text-mortgage-dark leading-6 mb-4">
            Required Documents
          </h2>
        </div>

        {/* Document List */}
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex h-16 items-center justify-between px-4 py-2 bg-white rounded-xl border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mortgage-cream">
                  {doc.id === 'government-id' && (
                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" className="h-5 w-5">
                      <path fillRule="evenodd" clipRule="evenodd" d="M16.75 7.5C16.75 7.91421 16.4142 8.25 16 8.25H12.25C11.8358 8.25 11.5 7.91421 11.5 7.5C11.5 7.08579 11.8358 6.75 12.25 6.75H16C16.4142 6.75 16.75 7.08579 16.75 7.5ZM16 9.75H12.25C11.8358 9.75 11.5 10.0858 11.5 10.5C11.5 10.9142 11.8358 11.25 12.25 11.25H16C16.4142 11.25 16.75 10.9142 16.75 10.5C16.75 10.0858 16.4142 9.75 16 9.75ZM19.75 2.25V15.75C19.75 16.5784 19.0784 17.25 18.25 17.25H1.75C0.921573 17.25 0.25 16.5784 0.25 15.75V2.25C0.25 1.42157 0.921573 0.75 1.75 0.75H18.25C19.0784 0.75 19.75 1.42157 19.75 2.25ZM18.25 15.75V2.25H1.75V15.75H18.25ZM10.7256 12.5625C10.8292 12.9638 10.5878 13.373 10.1866 13.4766C9.78529 13.5801 9.37605 13.3388 9.2725 12.9375C9.02594 11.9756 8.04813 11.25 6.99906 11.25C5.95 11.25 4.97312 11.9756 4.72563 12.9375C4.62207 13.3388 4.21283 13.5801 3.81156 13.4766C3.41029 13.373 3.16895 12.9638 3.2725 12.5625C3.51588 11.6566 4.09118 10.8755 4.88406 10.3744C4.02237 9.51779 3.76242 8.22604 4.22572 7.10283C4.68901 5.97961 5.78405 5.24675 6.99906 5.24675C8.21407 5.24675 9.30911 5.97961 9.77241 7.10283C10.2357 8.22604 9.97576 9.51779 9.11406 10.3744C9.90781 10.8748 10.4836 11.6562 10.7266 12.5625H10.7256ZM7 9.75C7.82843 9.75 8.5 9.07843 8.5 8.25C8.5 7.42157 7.82843 6.75 7 6.75C6.17157 6.75 5.5 7.42157 5.5 8.25C5.5 9.07843 6.17157 9.75 7 9.75Z" fill="#1C140D"/>
                    </svg>
                  )}
                  {doc.id === 'proof-income' && (
                    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" className="h-5 w-5">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.25 10.25H7.75V4.25H8.5C10.1569 4.25 11.5 5.59315 11.5 7.25C11.5 7.66421 11.8358 8 12.25 8C12.6642 8 13 7.66421 13 7.25C12.9974 4.76579 10.9842 2.75258 8.5 2.75H7.75V1.25C7.75 0.835786 7.41421 0.5 7 0.5C6.58579 0.5 6.25 0.835786 6.25 1.25V2.75H5.5C3.01472 2.75 1 4.76472 1 7.25C1 9.73528 3.01472 11.75 5.5 11.75H6.25V17.75H4.75C3.09315 17.75 1.75 16.4069 1.75 14.75C1.75 14.3358 1.41421 14 1 14C0.585786 14 0.25 14.3358 0.25 14.75C0.252584 17.2342 2.26579 19.2474 4.75 19.25H6.25V20.75C6.25 21.1642 6.58579 21.5 7 21.5C7.41421 21.5 7.75 21.1642 7.75 20.75V19.25H9.25C11.7353 19.25 13.75 17.2353 13.75 14.75C13.75 12.2647 11.7353 10.25 9.25 10.25ZM5.5 10.25C3.84315 10.25 2.5 8.90685 2.5 7.25C2.5 5.59315 3.84315 4.25 5.5 4.25H6.25V10.25H5.5ZM9.25 17.75H7.75V11.75H9.25C10.9069 11.75 12.25 13.0931 12.25 14.75C12.25 16.4069 10.9069 17.75 9.25 17.75Z" fill="#1C140D"/>
                    </svg>
                  )}
                  {doc.id === 'bank-statements' && (
                    <svg width="24" height="19" viewBox="0 0 24 19" fill="none" className="h-5 w-5">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2.25 7.75H4.5V13.75H3C2.58579 13.75 2.25 14.0858 2.25 14.5C2.25 14.9142 2.58579 15.25 3 15.25H21C21.4142 15.25 21.75 14.9142 21.75 14.5C21.75 14.0858 21.4142 13.75 21 13.75H19.5V7.75H21.75C22.0853 7.74966 22.3796 7.52681 22.4709 7.20417C22.5622 6.88154 22.4282 6.53751 22.1428 6.36156L12.3928 0.361562C12.1519 0.213434 11.8481 0.213434 11.6072 0.361562L1.85719 6.36156C1.57176 6.53751 1.4378 6.88154 1.52908 7.20417C1.62036 7.52681 1.9147 7.74966 2.25 7.75ZM6 7.75H9V13.75H6V7.75ZM13.5 7.75V13.75H10.5V7.75H13.5ZM18 13.75H15V7.75H18V13.75ZM12 1.88031L19.1006 6.25H4.89937L12 1.88031ZM23.25 17.5C23.25 17.9142 22.9142 18.25 22.5 18.25H1.5C1.08579 18.25 0.75 17.9142 0.75 17.5C0.75 17.0858 1.08579 16.75 1.5 16.75H22.5C22.9142 16.75 23.25 17.0858 23.25 17.5Z" fill="#1C140D"/>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-base text-mortgage-dark leading-6">
                    {doc.name}
                  </span>
                  <span className={`text-sm leading-[21px] ${
                    doc.status === 'uploaded' ? 'text-green-600' : 'text-mortgage-brown'
                  }`}>
                    {doc.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="flex h-6 w-6 items-center justify-center">
                {doc.status === 'uploaded' ? (
                  <svg width="19" height="14" viewBox="0 0 19 14" fill="none" className="h-5 w-5">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.5306 1.28062L6.53063 13.2806C6.38995 13.4215 6.19906 13.5006 6 13.5006C5.80094 13.5006 5.61005 13.4215 5.46937 13.2806L0.219375 8.03063C-0.0736811 7.73757 -0.0736811 7.26243 0.219375 6.96937C0.512431 6.67632 0.987569 6.67632 1.28062 6.96937L6 11.6897L17.4694 0.219375C17.7624 -0.0736809 18.2376 -0.0736809 18.5306 0.219375C18.8237 0.512431 18.8237 0.987569 18.5306 1.28062Z" fill="#059669"/>
                  </svg>
                ) : (
                  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" className="h-5 w-5">
                    <path fillRule="evenodd" clipRule="evenodd" d="M21.5 11.75V17.75C21.5 18.5784 20.8284 19.25 20 19.25H2C1.17157 19.25 0.5 18.5784 0.5 17.75V11.75C0.5 10.9216 1.17157 10.25 2 10.25H6.5C6.91421 10.25 7.25 10.5858 7.25 11C7.25 11.4142 6.91421 11.75 6.5 11.75H2V17.75H20V11.75H15.5C15.0858 11.75 14.75 11.4142 14.75 11C14.75 10.5858 15.0858 10.25 15.5 10.25H20C20.8284 10.25 21.5 10.9216 21.5 11.75ZM7.03063 6.28062L10.25 3.06031V11C10.25 11.4142 10.5858 11.75 11 11.75C11.4142 11.75 11.75 11.4142 11.75 11V3.06031L14.9694 6.28062C15.2624 6.57368 15.7376 6.57368 16.0306 6.28062C16.3237 5.98757 16.3237 5.51243 16.0306 5.21938L11.5306 0.719375C11.3899 0.578542 11.1991 0.49941 11 0.49941C10.8009 0.49941 10.6101 0.578542 10.4694 0.719375L5.96938 5.21938C5.67632 5.51243 5.67632 5.98757 5.96938 6.28062C6.26243 6.57368 6.73757 6.57368 7.03063 6.28062ZM17.75 14.75C17.75 14.1287 17.2463 13.625 16.625 13.625C16.0037 13.625 15.5 14.1287 15.5 14.75C15.5 15.3713 16.0037 15.875 16.625 15.875C17.2463 15.875 17.75 15.3713 17.75 14.75Z" fill="#9C704A"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Applicant Info */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-lg font-bold text-mortgage-dark mb-4">
            Application for
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Applicant:</span>
              <span className="text-sm text-mortgage-dark font-medium">Theresa Stewart</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Email:</span>
              <span className="text-sm text-mortgage-dark font-medium">theresa.stewart@hotmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Phone:</span>
              <span className="text-sm text-mortgage-dark font-medium">(284) 588-3572</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-mortgage-brown">Annual Income:</span>
              <span className="text-sm text-mortgage-dark font-medium">$73,305</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 h-10 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={onSubmit}
            className="flex-1 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}