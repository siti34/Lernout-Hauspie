import React from 'react';

interface StartPageProps {
  onStart: () => void;
}

export default function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="flex h-full w-full flex-col bg-white items-center justify-center px-6">
      {/* Logo Container */}
      <div className="flex flex-col items-center mb-8">
        {/* Logo Circle */}
        <div className="w-32 h-32 bg-orange-500 rounded-full flex items-center justify-center mb-6">
          {/* You can replace this with an img tag when you upload your logo */}
          <div className="text-white text-5xl font-bold">L&H
            {/* <img 
              src="/OP.png" 
              alt="OP Logo" 
              className="w-32 h-32 object-contain"
            /> */}
          </div>
        </div>

        {/* App Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Mortgage Application
        </h1>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-200 shadow-lg"
      >
        START
      </button>

      {/* Optional subtitle or description */}
      <p className="text-gray-600 text-center mt-6 text-sm max-w-sm">
        Calculate your mortgage options and start your application process
      </p>
    </div>
  );
}