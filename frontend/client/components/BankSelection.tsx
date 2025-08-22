import React from 'react';

// Nordic bank configuration with proper branding colors
const banks = [
  { id: 'op', name: 'OP', displayName: 'OP', color: '#FF6B35', textColor: '#FFFFFF' },
  { id: 'aktia', name: 'Aktia', displayName: 'Aktia', color: '#00B04F', textColor: '#FFFFFF' },
  { id: 'danske', name: 'Danske Bank', displayName: 'Danske Bank', color: '#003755', textColor: '#FFFFFF' },
  { id: 'nordea', name: 'Nordea', displayName: 'Nordea', color: '#00319C', textColor: '#FFFFFF' },
  { id: 'omasp', name: 'Oma Säästöpankki', displayName: 'omasp', color: '#4CAF50', textColor: '#FFFFFF' },
  { id: 'pop', name: 'POP Pankki', displayName: 'POP Pankki', color: '#00C851', textColor: '#FFFFFF' },
  { id: 'sp', name: 'S-Pankki', displayName: 'S-Pankki', color: '#4CAF50', textColor: '#FFFFFF' },
  { id: 'handelsbanken', name: 'Handelsbanken', displayName: 'SHB', color: '#0F2027', textColor: '#FFFFFF' },
];

interface BankSelectionProps {
  onCancel: () => void;
  onBankSelect: (bankId: string) => void;
}

export default function BankSelection({ onCancel, onBankSelect }: BankSelectionProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header - Standardized */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
        <button 
          onClick={onCancel}
          className="flex h-10 w-10 items-center justify-center"
        >
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="h-6 w-6">
            <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1C140D"/>
          </svg>
        </button>
        <h1 className="flex-1 pr-10 text-center text-base font-bold leading-6 text-mortgage-dark">
          Bank Selection
        </h1>
      </div>

      {/* Assistant Message - Added for standardization */}
      <div className="px-4 py-4">
        <div className="mb-1">
          <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
        </div>
        <div className="rounded-xl bg-mortgage-cream p-3">
          <p className="text-base leading-6 text-mortgage-dark">
            Select your bank to log in and continue with your mortgage application:
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4">
        {/* Bank Grid */}
        <div className="grid grid-cols-3 gap-3 px-2 mb-8">
          {banks.map((bank) => (
            <button
              key={bank.id}
              onClick={() => onBankSelect(bank.id)}
              className="flex h-24 w-full items-center justify-center rounded-xl border border-gray-300 bg-white p-4 transition-all duration-200 hover:border-primary hover:shadow-sm focus:border-primary focus:outline-none active:scale-95"
            >
              <div
                className="flex h-16 w-full items-center justify-center rounded-lg font-bold text-sm"
                style={{
                  backgroundColor: bank.color,
                  color: bank.textColor
                }}
              >
                {bank.displayName.length > 8 ?
                  bank.displayName.split(' ').map(word => word.charAt(0)).join('').substring(0, 2) :
                  bank.displayName
                }
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Button - Standardized */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={onCancel}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-mortgage-cream px-4 hover:bg-mortgage-cream/80 transition-colors"
        >
          <span className="text-sm font-medium leading-6 text-mortgage-dark">
            Cancel log-in
          </span>
        </button>
      </div>
    </div>
  );
}