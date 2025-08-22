import React, { useState } from "react";

interface ApplicationData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  socialSecurityNumber: string;

  // Marital Details
  marriageStatus: string;
  spouseName: string;
  yearsOfMarriage: string;
  childrenNames: string;
}

interface MortgageApplicationFormProps {
  onBack: () => void;
  onSubmit: (data: ApplicationData) => void;
}

export default function MortgageApplicationForm({
  onBack,
  onSubmit,
}: MortgageApplicationFormProps) {
  // Pre-populate with data from JSON
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: "Theresa",
    lastName: "Stewart",
    email: "theresa.stewart@hotmail.com",
    phoneNumber: "2845883572",
    socialSecurityNumber: "",
    marriageStatus: "Married",
    spouseName: "",
    yearsOfMarriage: "",
    childrenNames: "2 dependents",
  });

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onSubmit(formData);
  };

  const handleBackToChat = () => {
    onBack();
  };

  // Calculate progress based on filled fields
  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter(
    (value) => value.trim() !== "",
  ).length;
  const progressPercentage = (filledFields / totalFields) * 100;

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
        <button
          onClick={onBack}
          className="flex h-10 w-10 items-center justify-center"
        >
          <svg
            width="18"
            height="16"
            viewBox="0 0 18 16"
            fill="none"
            className="h-6 w-6"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z"
              fill="#1C140D"
            />
          </svg>
        </button>
        <h1 className="flex-1 pr-10 text-center text-base font-bold leading-6 text-mortgage-dark">
          Mortgage Application
        </h1>
      </div>

      {/* Chatbot Message */}
      <div className="px-4 py-4">
        <div className="mb-1">
          <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
        </div>
        <div className="rounded-xl bg-mortgage-cream p-3">
          <p className="text-base leading-6 text-mortgage-dark">
            Here's your application form with your information pre-filled:
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 space-y-6">
        {/* Personal Details Section */}
        <div className="">
          <h2 className="text-lg font-bold text-mortgage-dark mb-4">
            Personal details
          </h2>

          <div className="space-y-3">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>

            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>

            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>

            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>

            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Social Security Number"
                value={formData.socialSecurityNumber}
                onChange={(e) =>
                  handleInputChange("socialSecurityNumber", e.target.value)
                }
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Marital Details Section */}
        <div className="">
          <h2 className="text-lg font-bold text-mortgage-dark mb-4">
            Marital details
          </h2>

          <div className="space-y-3">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Marriage Status"
                value={formData.marriageStatus}
                onChange={(e) =>
                  handleInputChange("marriageStatus", e.target.value)
                }
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>

            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Name of the Spouse"
                value={formData.spouseName}
                onChange={(e) =>
                  handleInputChange("spouseName", e.target.value)
                }
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>

            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Years of Marriage"
                value={formData.yearsOfMarriage}
                onChange={(e) =>
                  handleInputChange("yearsOfMarriage", e.target.value)
                }
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>

            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Names of the Children (if any)"
                value={formData.childrenNames}
                onChange={(e) =>
                  handleInputChange("childrenNames", e.target.value)
                }
                className="w-full bg-transparent text-base leading-6 text-mortgage-dark placeholder:text-mortgage-brown focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Application Progress */}
        <div className="">
          <div className="mb-2">
            <span className="text-base text-mortgage-dark">
              Application Progress
            </span>
          </div>
          <div className="relative">
            <progress
              value={progressPercentage}
              max={100}
              className="w-full h-2 rounded-sm overflow-hidden [&::-webkit-progress-bar]:bg-border-light [&::-webkit-progress-bar]:rounded-sm [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-orange-600 [&::-webkit-progress-value]:to-orange-500 [&::-webkit-progress-value]:rounded-sm [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-300 [&::-moz-progress-bar]:bg-gradient-to-r [&::-moz-progress-bar]:from-orange-600 [&::-moz-progress-bar]:to-orange-500 [&::-moz-progress-bar]:rounded-sm appearance-none"
            />
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {filledFields} of {totalFields} fields completed (
            {Math.round(progressPercentage)}%)
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex gap-2">
          <button
            onClick={handleBackToChat}
            className="px-4 h-10 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Chat
          </button>

          <button
            onClick={handleNext}
            className="flex-1 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}