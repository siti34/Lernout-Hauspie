// frontend/client/components/MortgageChat.tsx

import React, { useState, useEffect, useRef } from 'react';
import { chatAPI, getOrCreateSessionId, APIError } from '../api/client';

interface MortgageChatProps {
  mortgageResults?: any;
  selectedBank?: string;
  onFillApplication: () => void;
  onBack?: () => void;
}

interface DisplayChatMessage {
  id: string;
  sender: 'support' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatState {
  sessionId: string;
  displayMessages: DisplayChatMessage[];
}

export default function MortgageChat({ mortgageResults, selectedBank, onFillApplication, onBack }: MortgageChatProps) {
  const [chatStarted, setChatStarted] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatState, setChatState] = useState<ChatState>({
    sessionId: getOrCreateSessionId(),
    displayMessages: []
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatState.displayMessages]);

  // Initialize with a welcome message when chat starts
  useEffect(() => {
    if (chatStarted && chatState.displayMessages.length === 0) {
      const welcomeMessage: DisplayChatMessage = {
        id: '1',
        sender: 'support',
        content: "Hello Theresa! I'm your Bank Mortgage Assistant. I can help you understand your financing options, answer questions about mortgage loans, and guide you through the application process. How can I assist you today?",
        timestamp: new Date()
      };
      setChatState(prev => ({
        ...prev,
        displayMessages: [welcomeMessage]
      }));
    }
  }, [chatStarted, chatState.displayMessages.length]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || isLoading) return;

    const userMessage: DisplayChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageInput.trim(),
      timestamp: new Date()
    };

    // Add user message immediately
    setChatState(prev => ({
      ...prev,
      displayMessages: [...prev.displayMessages, userMessage]
    }));

    const currentInput = messageInput.trim();
    setMessageInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatAPI.sendMessage(currentInput, chatState.sessionId);
      
      const assistantMessage: DisplayChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        content: response,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        displayMessages: [...prev.displayMessages, assistantMessage]
      }));

    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof APIError ? err.message : 'An error occurred');
      
      const errorMessage: DisplayChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'support',
        content: `I apologize, but I encountered an error. Please try again or contact our support team.`,
        timestamp: new Date()
      };
      
      setChatState(prev => ({
        ...prev,
        displayMessages: [...prev.displayMessages, errorMessage]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    setMessageInput(reply);
    // Auto-send the quick reply
    setTimeout(() => {
      if (reply.trim()) {
        const userMessage: DisplayChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          content: reply,
          timestamp: new Date()
        };

        setChatState(prev => ({
          ...prev,
          displayMessages: [...prev.displayMessages, userMessage]
        }));

        // Send to API
        setIsLoading(true);
        chatAPI.sendMessage(reply, chatState.sessionId)
          .then(response => {
            const assistantMessage: DisplayChatMessage = {
              id: (Date.now() + 1).toString(),
              sender: 'support',
              content: response,
              timestamp: new Date()
            };

            setChatState(prev => ({
              ...prev,
              displayMessages: [...prev.displayMessages, assistantMessage]
            }));
          })
          .catch(err => {
            console.error('Quick reply error:', err);
            const errorMessage: DisplayChatMessage = {
              id: (Date.now() + 1).toString(),
              sender: 'support',
              content: `I apologize, but I encountered an error. Please try again.`,
              timestamp: new Date()
            };
            
            setChatState(prev => ({
              ...prev,
              displayMessages: [...prev.displayMessages, errorMessage]
            }));
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    }, 100);
  };

  // Show application choice screen if chat hasn't started
  if (!chatStarted) {
    return (
      <div className="flex h-full w-full flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between bg-white px-4 py-4 border-b border-gray-100">
          <button 
            onClick={onBack}
            className="flex h-12 w-12 items-center justify-center"
          >
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="h-6 w-6">
              <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1C140D"/>
            </svg>
          </button>
          <h1 className="flex-1 pr-12 text-center text-lg font-bold leading-6 text-mortgage-dark">
            Mortgage Chat
          </h1>
        </div>

        {/* Mortgage Summary (if available) */}
        {mortgageResults && (
          <div className="border-b border-gray-100 px-4 py-4">
            <h2 className="mb-4 text-lg font-bold text-mortgage-dark">
              Your Calculation Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-mortgage-brown">Loan Amount:</span>
                <span className="text-sm text-mortgage-dark font-medium">
                  €{mortgageResults.loanAmount?.toLocaleString() || '225,000'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-mortgage-brown">Interest Rate:</span>
                <span className="text-sm text-mortgage-dark font-medium">
                  {mortgageResults.interestRate || '4.2'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-mortgage-brown">Monthly Payment:</span>
                <span className="text-sm text-mortgage-dark font-medium">
                  €{mortgageResults.monthlyPayment?.toLocaleString() || '1,245'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 px-4 py-4">
          <div className="mb-6">
            <div className="mb-2">
              <span className="text-sm text-mortgage-brown">Choose Your Next Step</span>
            </div>
            <div className="rounded-xl bg-mortgage-cream p-4">
              <p className="text-base leading-6 text-mortgage-dark">
                How would you like to proceed with your mortgage application?
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={onFillApplication}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-4"
            >
              <span className="text-sm font-bold leading-[21px] text-white">
                📋 Fill in Application Form
              </span>
            </button>
            
            <button
              onClick={() => setChatStarted(true)}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-mortgage-cream px-4 border-2 border-primary"
            >
              <span className="text-sm font-bold leading-[21px] text-primary">
                💬 Chat with Mortgage Assistant
              </span>
            </button>
          </div>

          <div className="mt-4 px-2">
            <p className="text-xs text-gray-500 text-center">
              The Mortgage Assistant can help you understand your financing options, 
              answer questions about mortgage loans, and guide you through the process.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show chat interface
  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
        <button 
          onClick={() => setChatStarted(false)}
          className="flex h-10 w-10 items-center justify-center"
        >
          <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="h-6 w-6">
            <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1C140D"/>
          </svg>
        </button>
        <h1 className="flex-1 pr-10 text-center text-base font-bold leading-6 text-mortgage-dark">
          Mortgage Assistant Chat
        </h1>
      </div>

      {/* Scrollable content: summary + chat */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6" ref={chatContainerRef}>
        {/* Chat Messages */}
        <div className="space-y-4">
          {chatState.displayMessages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[280px] ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
                <div className="mb-1">
                  <span className={`text-sm ${message.sender === 'user' ? 'text-right' : 'text-left'} text-mortgage-brown`}>
                    {message.sender === 'user' ? 'You' : 'Mortgage Assistant'}
                  </span>
                </div>
                <div className={`rounded-xl p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-mortgage-cream text-mortgage-dark'
                }`}>
                  <p className="text-base leading-6 whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[280px] mr-12">
                <div className="mb-1">
                  <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
                </div>
                <div className="rounded-xl p-3 bg-mortgage-cream text-mortgage-dark">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-base">Processing your request...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="flex justify-start">
              <div className="max-w-[280px] mr-12">
                <div className="mb-1">
                  <span className="text-sm text-mortgage-brown">System</span>
                </div>
                <div className="rounded-xl p-3 bg-red-50 border border-red-200">
                  <p className="text-red-800 text-sm">
                    Error: {error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Reply buttons for common questions */}
        {chatState.displayMessages.length === 1 && !isLoading && (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleQuickReply('What are my payment options?')}
                className="rounded-2xl bg-mortgage-cream px-4 py-2 text-sm font-bold text-mortgage-dark border border-gray-200 hover:bg-primary hover:text-white transition-colors"
              >
                Payment Options
              </button>
              <button
                onClick={() => handleQuickReply('What interest rates do you offer?')}
                className="rounded-2xl bg-mortgage-cream px-4 py-2 text-sm font-bold text-mortgage-dark border border-gray-200 hover:bg-primary hover:text-white transition-colors"
              >
                Interest Rates
              </button>
              <button
                onClick={() => handleQuickReply('How does the application process work?')}
                className="rounded-2xl bg-mortgage-cream px-4 py-2 text-sm font-bold text-mortgage-dark border border-gray-200 hover:bg-primary hover:text-white transition-colors"
              >
                Application Process
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1">
            <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
              <input
                type="text"
                placeholder="Send message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="w-full bg-transparent text-base text-mortgage-brown placeholder:text-mortgage-brown focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !messageInput.trim()}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
              </svg>
            )}
          </button>
        </div>

        {/* Action buttons at bottom */}
        <div className="flex gap-2">
          <button
            onClick={onFillApplication}
            className="flex-1 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Continue to Application
          </button>
          <button
            onClick={() => setChatStarted(false)}
            className="px-4 h-10 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}