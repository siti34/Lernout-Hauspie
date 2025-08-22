// import React, { useState, useEffect, useRef } from 'react';
// import { MortgageResults } from '../lib/mortgage';
// import { useMutation } from '@tanstack/react-query';
// import { 
//   chatAPI, 
//   ChatMessage as LangflowChatMessage, 
//   ChatRequest, 
//   ChatResponse, 
//   getOrCreateSessionId, 
//   APIError 
// } from '../api/client';

// interface MortgageChatProps {
//   mortgageResults?: MortgageResults | null;
//   selectedBank?: string;
//   onFillApplication: () => void;
//   onBack?: () => void;
// }

// interface DisplayChatMessage {
//   id: string;
//   sender: 'support' | 'user';
//   content: string;
//   timestamp: Date;
// }

// interface ChatState {
//   messages: LangflowChatMessage[];
//   sessionId: string;
//   displayMessages: DisplayChatMessage[];
// }

// export default function MortgageChat({ mortgageResults, selectedBank, onFillApplication, onBack }: MortgageChatProps) {
//   const [chatStarted, setChatStarted] = useState(false);
//   const [messageInput, setMessageInput] = useState('');
//   const [chatState, setChatState] = useState<ChatState>({
//     messages: [],
//     sessionId: getOrCreateSessionId(),
//     displayMessages: []
//   });
//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const retryRequestRef = useRef<ChatRequest | null>(null);

//   // Auto scroll to bottom when new messages are added
//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chatState.displayMessages]);

//   // Initialize with a welcome message when chat starts
//   useEffect(() => {
//     if (chatStarted && chatState.displayMessages.length === 0) {
//       const welcomeMessage: DisplayChatMessage = {
//         id: '1',
//         sender: 'support',
//         content: "Hello! I'm your Mortgage Assistant. I can help you understand your financing options, answer questions about mortgage loans, and guide you through the process. How can I assist you today?",
//         timestamp: new Date()
//       };
//       setChatState(prev => ({
//         ...prev,
//         displayMessages: [welcomeMessage]
//       }));
//     }
//   }, [chatStarted, chatState.displayMessages.length]);

//   // Langflow API integration
//   const sendMessageMutation = useMutation({
//     mutationFn: async (request: ChatRequest): Promise<ChatResponse> => {
//       // Store request for potential retry
//       retryRequestRef.current = request;
//       return chatAPI.sendMessage(request);
//     },
//     onSuccess: (response: ChatResponse) => {
//       // Add assistant response to display messages
//       const assistantMessage: DisplayChatMessage = {
//         id: Date.now().toString(),
//         sender: 'support',
//         content: response.output_text,
//         timestamp: new Date()
//       };

//       setChatState(prev => ({
//         ...prev,
//         messages: [...prev.messages, {
//           role: 'assistant' as const,
//           content: response.output_text
//         }],
//         displayMessages: [...prev.displayMessages, assistantMessage]
//       }));

//       // Clear retry request on success
//       retryRequestRef.current = null;
//     },
//     onError: (error: APIError) => {
//       console.error('Chat error:', error);
      
//       // Add error message to chat if it's not a network/timeout error
//       if (error.status !== 0 && error.code !== 'TIMEOUT') {
//         const errorMessage: DisplayChatMessage = {
//           id: Date.now().toString(),
//           sender: 'support',
//           content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
//           timestamp: new Date()
//         };
        
//         setChatState(prev => ({
//           ...prev,
//           displayMessages: [...prev.displayMessages, errorMessage]
//         }));
//       }
//     }
//   });

//   const handleSendMessage = async () => {
//     if (!messageInput.trim() || sendMessageMutation.isPending) return;

//     const userMessage: DisplayChatMessage = {
//       id: Date.now().toString(),
//       sender: 'user',
//       content: messageInput.trim(),
//       timestamp: new Date()
//     };

//     // Add user message to langflow format and display
//     const langflowUserMessage: LangflowChatMessage = {
//       role: 'user',
//       content: messageInput.trim()
//     };

//     const newMessages = [...chatState.messages, langflowUserMessage];
//     const newDisplayMessages = [...chatState.displayMessages, userMessage];

//     // Update state immediately
//     setChatState(prev => ({
//       ...prev,
//       messages: newMessages,
//       displayMessages: newDisplayMessages
//     }));

//     setMessageInput('');

//     // Send to langflow API
//     const request: ChatRequest = {
//       session_id: chatState.sessionId,
//       messages: newMessages
//     };

//     sendMessageMutation.mutate(request);
//   };

//   const handleQuickReply = (reply: string) => {
//     setMessageInput(reply);
//     // Auto-send the quick reply
//     setTimeout(() => {
//       if (reply.trim()) {
//         const userMessage: DisplayChatMessage = {
//           id: Date.now().toString(),
//           sender: 'user',
//           content: reply,
//           timestamp: new Date()
//         };

//         const langflowUserMessage: LangflowChatMessage = {
//           role: 'user',
//           content: reply
//         };

//         const newMessages = [...chatState.messages, langflowUserMessage];
//         const newDisplayMessages = [...chatState.displayMessages, userMessage];

//         setChatState(prev => ({
//           ...prev,
//           messages: newMessages,
//           displayMessages: newDisplayMessages
//         }));

//         const request: ChatRequest = {
//           session_id: chatState.sessionId,
//           messages: newMessages
//         };

//         sendMessageMutation.mutate(request);
//       }
//     }, 100);
//   };

//   const handleRetry = () => {
//     if (retryRequestRef.current && !sendMessageMutation.isPending) {
//       sendMessageMutation.mutate(retryRequestRef.current);
//     }
//   };

//   const isLoading = sendMessageMutation.isPending;
//   const hasError = sendMessageMutation.isError;
//   const canRetry = hasError && retryRequestRef.current;

//   // Show application choice screen if chat hasn't started
//   if (!chatStarted) {
//     return (
//       <div className="flex h-full w-full flex-col bg-white">
//         {/* Header */}
//         <div className="flex items-center justify-between bg-white px-4 py-4 border-b border-gray-100">
//           <button 
//             onClick={onBack}
//             className="flex h-12 w-12 items-center justify-center"
//           >
//             <svg width="18" height="16" viewBox="0 0 18 16" fill="none" className="h-6 w-6">
//               <path fillRule="evenodd" clipRule="evenodd" d="M18 8C18 8.41421 17.6642 8.75 17.25 8.75H2.56031L8.03063 14.2194C8.32368 14.5124 8.32368 14.9876 8.03063 15.2806C7.73757 15.5737 7.26243 15.5737 6.96937 15.2806L0.219375 8.53063C0.0785422 8.38995 -0.000590086 8.19906 -0.000590086 8C-0.000590086 7.80094 0.0785422 7.61005 0.219375 7.46937L6.96937 0.719375C7.26243 0.426319 7.73757 0.426319 8.03063 0.719375C8.32368 1.01243 8.32368 1.48757 8.03063 1.78062L2.56031 7.25H17.25C17.6642 7.25 18 7.58579 18 8Z" fill="#1C140D"/>
//             </svg>
//           </button>
//           <h1 className="flex-1 pr-12 text-center text-lg font-bold leading-6 text-mortgage-dark">
//             Mortgage Chat
//           </h1>
//         </div>

//         {/* Mortgage Summary (if available) */}
//         {mortgageResults && (
//           <div className="border-b border-gray-100 px-4 py-4">
//             <h2 className="mb-4 text-lg font-bold text-mortgage-dark">
//               Your Calculation Summary
//             </h2>
//             <div className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-sm text-mortgage-brown">Loan Amount:</span>
//                 <span className="text-sm text-mortgage-dark font-medium">
//                   ${mortgageResults.loanAmount.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-mortgage-brown">Interest Rate:</span>
//                 <span className="text-sm text-mortgage-dark font-medium">
//                   {mortgageResults.interestRate}%
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-sm text-mortgage-brown">Monthly Payment:</span>
//                 <span className="text-sm text-mortgage-dark font-medium">
//                   ${mortgageResults.monthlyPayment.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Content */}
//         <div className="flex-1 px-4 py-4">
//           <div className="mb-6">
//             <div className="mb-2">
//               <span className="text-sm text-mortgage-brown">Choose Your Next Step</span>
//             </div>
//             <div className="rounded-xl bg-mortgage-cream p-4">
//               <p className="text-base leading-6 text-mortgage-dark">
//                 How would you like to proceed with your mortgage application?
//               </p>
//             </div>
//           </div>

//           <div className="space-y-3">
//             <button
//               onClick={onFillApplication}
//               className="flex h-12 w-full items-center justify-center rounded-2xl bg-primary px-4"
//             >
//               <span className="text-sm font-bold leading-[21px] text-white">
//                 📋 Fill in Application Form
//               </span>
//             </button>
            
//             <button
//               onClick={() => setChatStarted(true)}
//               className="flex h-12 w-full items-center justify-center rounded-2xl bg-mortgage-cream px-4 border-2 border-primary"
//             >
//               <span className="text-sm font-bold leading-[21px] text-primary">
//                 💬 Chat with Mortgage Assistant
//               </span>
//             </button>
//           </div>

//           <div className="mt-4 px-2">
//             <p className="text-xs text-gray-500 text-center">
//               The Mortgage Assistant can help you understand your financing options, 
//               answer questions about mortgage loans, and guide you through the process.
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Show chat interface with mortgage summary
// // ...existing code...
//   // Show chat interface with mortgage summary
//   return (
//     <div className="flex h-full w-full flex-col bg-white">
//       {/* Header */}
//       <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100">
//         <button 
//           onClick={() => setChatStarted(false)}
//           className="flex h-10 w-10 items-center justify-center"
//         >
//           {/* ...svg... */}
//         </button>
//         <h1 className="flex-1 pr-10 text-center text-base font-bold leading-6 text-mortgage-dark">
//           {'Mortgage Assistant Chat'}
//         </h1>
//       </div>

//       {/* Scrollable content: summary + chat */}
//       <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6" ref={chatContainerRef}>
//         {/* Mortgage Calculation Summary */}
//         {mortgageResults && (
//           <div className="border-b border-gray-100 pb-6">
//             <h2 className="mb-6 text-lg font-bold text-mortgage-dark">
//               Mortgage Calculation Summary
//             </h2>
//             <div className="space-y-6">
//               <div className="flex gap-6">
//                 <div className="flex-1 border-t border-gray-200 pt-5">
//                   <div className="text-sm text-mortgage-brown mb-1">Principal Amount</div>
//                   <div className="text-sm text-mortgage-dark font-medium">
//                     ${mortgageResults.loanAmount ? mortgageResults.loanAmount.toLocaleString() : '250,000'}
//                   </div>
//                 </div>
//                 <div className="flex-1 border-t border-gray-200 pt-5">
//                   <div className="text-sm text-mortgage-brown mb-1">Monthly Payment</div>
//                   <div className="text-sm text-mortgage-dark font-medium">
//                     ${mortgageResults.monthlyPayment.toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//               <div className="border-t border-gray-200 pt-5">
//                 <div className="text-sm text-mortgage-brown mb-1">Total Payment</div>
//                 <div className="text-sm text-mortgage-dark font-medium">
//                   ${mortgageResults.totalPayment ? mortgageResults.totalPayment.toLocaleString() : '540,000'}
//                 </div>
//               </div>
//             </div>
//             <div className="mt-6 text-base text-mortgage-dark">
//               Chat with our mortgage assistant to discuss your options.
//             </div>
//           </div>
//         )}

//         {/* Chat Messages */}
//         <div className="space-y-4">
//           {chatState.displayMessages.map((message) => (
//             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-[280px] ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
//                 <div className="mb-1">
//                   <span className={`text-sm ${message.sender === 'user' ? 'text-right' : 'text-left'} text-mortgage-brown`}>
//                     {message.sender === 'user' ? 'You' : 'Mortgage Assistant'}
//                   </span>
//                 </div>
//                 <div className={`rounded-xl p-3 ${
//                   message.sender === 'user' 
//                     ? 'bg-primary text-white' 
//                     : 'bg-mortgage-cream text-mortgage-dark'
//                 }`}>
//                   <p className="text-base leading-6 whitespace-pre-wrap break-words">{message.content}</p>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* Loading indicator */}
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className="max-w-[280px] mr-12">
//                 <div className="mb-1">
//                   <span className="text-sm text-mortgage-brown">Mortgage Assistant</span>
//                 </div>
//                 <div className="rounded-xl p-3 bg-mortgage-cream text-mortgage-dark">
//                   <div className="flex items-center space-x-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
//                     <span className="text-base">Processing your request...</span>
//                   </div>
//                   <div className="text-xs text-mortgage-brown mt-1">
//                     This may take up to 2 minutes for complex queries
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Error state with retry option */}
//           {hasError && (
//             <div className="flex justify-start">
//               <div className="max-w-[280px] mr-12">
//                 <div className="mb-1">
//                   <span className="text-sm text-mortgage-brown">System</span>
//                 </div>
//                 <div className="rounded-xl p-3 bg-red-50 border border-red-200">
//                   <p className="text-red-800 text-sm mb-2">
//                     {sendMessageMutation.error instanceof APIError 
//                       ? `${sendMessageMutation.error.message}`
//                       : 'An unexpected error occurred'
//                     }
//                   </p>
//                   {canRetry && (
//                     <button
//                       onClick={handleRetry}
//                       className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
//                     >
//                       Retry
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Quick Reply buttons for common questions */}
//         {chatState.displayMessages.length === 1 && !isLoading && (
//           <div className="mt-4 space-y-2">
//             <div className="flex flex-wrap gap-2 justify-center">
//               <button
//                 onClick={() => handleQuickReply('What are my payment options?')}
//                 className="rounded-2xl bg-mortgage-cream px-4 py-2 text-sm font-bold text-mortgage-dark border border-gray-200 hover:bg-primary hover:text-white transition-colors"
//               >
//                 Payment Options
//               </button>
//               <button
//                 onClick={() => handleQuickReply('What interest rates do you offer?')}
//                 className="rounded-2xl bg-mortgage-cream px-4 py-2 text-sm font-bold text-mortgage-dark border border-gray-200 hover:bg-primary hover:text-white transition-colors"
//               >
//                 Interest Rates
//               </button>
//               <button
//                 onClick={() => handleQuickReply('How does the application process work?')}
//                 className="rounded-2xl bg-mortgage-cream px-4 py-2 text-sm font-bold text-mortgage-dark border border-gray-200 hover:bg-primary hover:text-white transition-colors"
//               >
//                 Application Process
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Message Input */}
//       <div className="border-t border-gray-100 p-4">
//         <div className="flex items-center space-x-2 mb-4">
//           <div className="flex-1">
//             <div className="flex h-12 items-center rounded-xl bg-mortgage-cream px-4">
//               <input
//                 type="text"
//                 placeholder="Send message..."
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
//                 disabled={isLoading}
//                 className="w-full bg-transparent text-base text-mortgage-brown placeholder:text-mortgage-brown focus:outline-none disabled:opacity-50"
//               />
//             </div>
//           </div>
//           <button
//             onClick={handleSendMessage}
//             disabled={isLoading || !messageInput.trim()}
//             className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//             ) : (
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <line x1="22" y1="2" x2="11" y2="13"></line>
//                 <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
//               </svg>
//             )}
//           </button>
//         </div>

//         {/* Input hints and session info */}
//         {/* <div className="mb-4 flex justify-between items-center text-xs text-gray-500">
//           <span>Press Enter to send</span>
//           <div className="flex items-center gap-2">
//             <span>Session: {chatState.sessionId.slice(-8)}</span>
//             {chatState.displayMessages.length > 0 && (
//               <span>{chatState.displayMessages.length} messages</span>
//             )}
//             {isLoading && (
//               <span className="text-primary font-medium">⏳ Agent processing...</span>
//             )}
//           </div>
//         </div> */}

//         {/* Action buttons at bottom */}
//         <div className="flex gap-2">
//           <button
//             onClick={onFillApplication}
//             className="flex-1 h-10 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
//           >
//             Continue to Application
//           </button>
//           <button
//             onClick={() => setChatStarted(false)}
//             className="px-4 h-10 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
//           >
//             Back
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { MortgageResults } from '../lib/mortgage';
import { useMutation } from '@tanstack/react-query';
import { 
  chatAPI, 
  ChatMessage as LangflowChatMessage, 
  ChatRequest, 
  ChatResponse, 
  getOrCreateSessionId, 
  APIError 
} from '../api/client';

interface MortgageChatProps {
  mortgageResults?: MortgageResults | null;
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
  messages: LangflowChatMessage[];
  sessionId: string;
  displayMessages: DisplayChatMessage[];
}

export default function MortgageChat({ mortgageResults, selectedBank, onFillApplication, onBack }: MortgageChatProps) {
  const [chatStarted, setChatStarted] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    sessionId: getOrCreateSessionId(),
    displayMessages: []
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const retryRequestRef = useRef<ChatRequest | null>(null);

  // Demo mode - set to true for presentation, false for live API
  const DEMO_MODE = true;

  // Demo responses for the three quick reply buttons
  const demoResponses = {
    'What are my payment options?': `Great question, Theresa! Based on your loan amount of $50,333, here are your payment options:

**Monthly Payment Plans:**
• Standard 4-year term: $1,815/month
• Extended 6-year term: $1,250/month (higher total interest)
• Bi-weekly payments: $907 every 2 weeks (pay off faster)

**Payment Methods:**
• Automatic bank transfer (0.25% rate discount)
• Online banking
• Mobile app payments
• In-branch payments

**Special Options:**
• Grace period for first 3 months
• Seasonal payment adjustments for seasonal income
• Early payment without penalties

Would you like me to calculate different term options for you?`,

    'What interest rates do you offer?': `Excellent question! Let me explain OP Bank's current mortgage rates for your profile:

**Your Current Rate: 30.1%**
This rate is based on your current credit score of 589 and financial profile.

**Rate Improvement Opportunities:**
• With credit score 650+: Could reduce to 25-28%
• With 20% down payment: Additional 0.5% discount
• Automatic payments: 0.25% discount
• OP Bank customer benefits: 0.1% discount

**Rate Types Available:**
• Fixed rate: Locked for entire loan term
• Variable rate: Currently 2-3% lower but can fluctuate
• Hybrid: Fixed for first 3 years, then variable

**Special Offers:**
• First-time homebuyer program: Up to 1% rate reduction
• Green mortgage: 0.2% discount for energy-efficient homes

Your rate can be improved! Would you like me to show you specific steps to qualify for better rates?`,

    'How does the application process work?': `I'm happy to walk you through OP Bank's streamlined application process, Theresa!

**Step 1: Pre-Application (Completed ✓)**
• Initial calculation and bank selection
• Basic information gathering

**Step 2: Full Application (Next)**
• Complete application form with personal details
• Income and employment verification
• Property information

**Step 3: Document Submission**
• Government-issued ID ✓ (Already uploaded)
• Proof of income ✓ (Already uploaded) 
• Bank statements (Pending upload)
• Property documents (when selected)

**Step 4: Review Process (3-5 business days)**
• Credit check and verification
• Property appraisal (if applicable)
• Underwriting review

**Step 5: Approval & Closing**
• Loan approval notification
• Final terms and conditions
• Closing appointment scheduling

**Current Status:** You're ready for Step 2! 
Your pre-qualification looks strong with your $73,305 annual income and existing relationship with OP Bank.

**Timeline:** Most applications are approved within 5-7 business days. As an existing customer, your process may be even faster!

Ready to continue with the full application form?`
  };

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
        content: "Hello Theresa! I'm your Mortgage Assistant. I can help you understand your financing options, answer questions about mortgage loans, and guide you through the application process. How can I assist you today?",
        timestamp: new Date()
      };
      setChatState(prev => ({
        ...prev,
        displayMessages: [welcomeMessage]
      }));
    }
  }, [chatStarted, chatState.displayMessages.length]);

  // COMMENTED OUT FOR DEMO - Original Langflow API integration
  /*
  const sendMessageMutation = useMutation({
    mutationFn: async (request: ChatRequest): Promise<ChatResponse> => {
      retryRequestRef.current = request;
      return chatAPI.sendMessage(request);
    },
    onSuccess: (response: ChatResponse) => {
      const assistantMessage: DisplayChatMessage = {
        id: Date.now().toString(),
        sender: 'support',
        content: response.output_text,
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, {
          role: 'assistant' as const,
          content: response.output_text
        }],
        displayMessages: [...prev.displayMessages, assistantMessage]
      }));

      retryRequestRef.current = null;
    },
    onError: (error: APIError) => {
      console.error('Chat error:', error);
      
      if (error.status !== 0 && error.code !== 'TIMEOUT') {
        const errorMessage: DisplayChatMessage = {
          id: Date.now().toString(),
          sender: 'support',
          content: `I apologize, but I encountered an error: ${error.message}. Please try again.`,
          timestamp: new Date()
        };
        
        setChatState(prev => ({
          ...prev,
          displayMessages: [...prev.displayMessages, errorMessage]
        }));
      }
    }
  });
  */

  // DEMO VERSION - Mock mutation for presentation
  const sendMessageMutation = {
    isPending: false,
    isError: false,
    error: null,
    mutate: (request: any) => {
      // This is just for demo, no actual API call
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

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

    // DEMO MODE: Show typing indicator then respond
    if (DEMO_MODE) {
      // Show typing indicator
      const typingMessage: DisplayChatMessage = {
        id: 'typing',
        sender: 'support',
        content: 'typing...',
        timestamp: new Date()
      };

      setChatState(prev => ({
        ...prev,
        displayMessages: [...prev.displayMessages, typingMessage]
      }));

      // Simulate API delay
      setTimeout(() => {
        // Remove typing indicator and add response
        setChatState(prev => {
          const messagesWithoutTyping = prev.displayMessages.filter(msg => msg.id !== 'typing');
          
          let responseContent = "Thank you for your question! I'm here to help you with your mortgage application. For more detailed information about your specific situation, I'd be happy to connect you with one of our mortgage specialists, or you can continue with your application form.";
          
          // Check if it's a general greeting or question
          const lowerInput = currentInput.toLowerCase();
          if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('help')) {
            responseContent = "Hello! I'm happy to help you with your mortgage application. I can see you're pre-qualified for a $50,333 loan. What specific information would you like to know about your mortgage options?";
          } else if (lowerInput.includes('rate') || lowerInput.includes('interest')) {
            responseContent = demoResponses['What interest rates do you offer?'];
          } else if (lowerInput.includes('payment')) {
            responseContent = demoResponses['What are my payment options?'];
          } else if (lowerInput.includes('process') || lowerInput.includes('application')) {
            responseContent = demoResponses['How does the application process work?'];
          }

          const assistantMessage: DisplayChatMessage = {
            id: Date.now().toString(),
            sender: 'support',
            content: responseContent,
            timestamp: new Date()
          };

          return {
            ...prev,
            displayMessages: [...messagesWithoutTyping, assistantMessage]
          };
        });
      }, 1500); // 1.5 second delay for demo realism
    }

    // COMMENTED OUT FOR DEMO - Original API call
    /*
    const langflowUserMessage: LangflowChatMessage = {
      role: 'user',
      content: currentInput
    };

    const newMessages = [...chatState.messages, langflowUserMessage];

    const request: ChatRequest = {
      session_id: chatState.sessionId,
      messages: newMessages
    };

    sendMessageMutation.mutate(request);
    */
  };

  const handleQuickReply = (reply: string) => {
    setMessageInput(reply);
    // Auto-send the quick reply with demo response
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

        // DEMO MODE: Show typing then specific response
        if (DEMO_MODE) {
          // Show typing indicator
          const typingMessage: DisplayChatMessage = {
            id: 'typing',
            sender: 'support',
            content: 'typing...',
            timestamp: new Date()
          };

          setChatState(prev => ({
            ...prev,
            displayMessages: [...prev.displayMessages, typingMessage]
          }));

          // Show response after delay
          setTimeout(() => {
            setChatState(prev => {
              const messagesWithoutTyping = prev.displayMessages.filter(msg => msg.id !== 'typing');
              
              const responseContent = demoResponses[reply as keyof typeof demoResponses] || 
                "Thank you for your question! I'm here to help you with your mortgage needs.";

              const assistantMessage: DisplayChatMessage = {
                id: Date.now().toString(),
                sender: 'support',
                content: responseContent,
                timestamp: new Date()
              };

              return {
                ...prev,
                displayMessages: [...messagesWithoutTyping, assistantMessage]
              };
            });
          }, 2000); // 2 second delay for longer responses
        }

        // COMMENTED OUT FOR DEMO - Original API logic
        /*
        const langflowUserMessage: LangflowChatMessage = {
          role: 'user',
          content: reply
        };

        const newMessages = [...chatState.messages, langflowUserMessage];

        setChatState(prev => ({
          ...prev,
          messages: newMessages,
          displayMessages: newDisplayMessages
        }));

        const request: ChatRequest = {
          session_id: chatState.sessionId,
          messages: newMessages
        };

        sendMessageMutation.mutate(request);
        */
      }
    }, 100);
  };

  const handleRetry = () => {
    // DEMO MODE: No retry functionality needed
    if (DEMO_MODE) return;
    
    // COMMENTED OUT FOR DEMO
    /*
    if (retryRequestRef.current && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(retryRequestRef.current);
    }
    */
  };

  const isLoading = sendMessageMutation.isPending;
  const hasError = sendMessageMutation.isError;
  const canRetry = hasError && retryRequestRef.current;

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
                  ${mortgageResults.loanAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-mortgage-brown">Interest Rate:</span>
                <span className="text-sm text-mortgage-dark font-medium">
                  {mortgageResults.interestRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-mortgage-brown">Monthly Payment:</span>
                <span className="text-sm text-mortgage-dark font-medium">
                  ${mortgageResults.monthlyPayment.toLocaleString()}
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

  // Show chat interface with mortgage summary
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
        {/* Mortgage Calculation Summary */}
        {mortgageResults && (
          <div className="border-b border-gray-100 pb-6">
            <h2 className="mb-6 text-lg font-bold text-mortgage-dark">
              Mortgage Calculation Summary
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                <div className="flex-1 border-t border-gray-200 pt-5">
                  <div className="text-sm text-mortgage-brown mb-1">Principal Amount</div>
                  <div className="text-sm text-mortgage-dark font-medium">
                    ${mortgageResults.loanAmount ? mortgageResults.loanAmount.toLocaleString() : '50,333'}
                  </div>
                </div>
                <div className="flex-1 border-t border-gray-200 pt-5">
                  <div className="text-sm text-mortgage-brown mb-1">Monthly Payment</div>
                  <div className="text-sm text-mortgage-dark font-medium">
                    ${mortgageResults.monthlyPayment.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-5">
                <div className="text-sm text-mortgage-brown mb-1">Total Payment</div>
                <div className="text-sm text-mortgage-dark font-medium">
                  ${mortgageResults.totalPayment ? mortgageResults.totalPayment.toLocaleString() : '87,120'}
                </div>
              </div>
            </div>
            <div className="mt-6 text-base text-mortgage-dark">
              Chat with our mortgage assistant to discuss your options.
            </div>
          </div>
        )}

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
                  {message.content === 'typing...' ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-base">Typing...</span>
                    </div>
                  ) : (
                    <p className="text-base leading-6 whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator - COMMENTED OUT FOR DEMO */}
          {/*
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
                  <div className="text-xs text-mortgage-brown mt-1">
                    This may take up to 2 minutes for complex queries
                  </div>
                </div>
              </div>
            </div>
          )}
          */}

          {/* Error state - COMMENTED OUT FOR DEMO */}
          {/*
          {hasError && (
            <div className="flex justify-start">
              <div className="max-w-[280px] mr-12">
                <div className="mb-1">
                  <span className="text-sm text-mortgage-brown">System</span>
                </div>
                <div className="rounded-xl p-3 bg-red-50 border border-red-200">
                  <p className="text-red-800 text-sm mb-2">
                    {sendMessageMutation.error instanceof APIError 
                      ? `${sendMessageMutation.error.message}`
                      : 'An unexpected error occurred'
                    }
                  </p>
                  {canRetry && (
                    <button
                      onClick={handleRetry}
                      className="text-xs px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          */}
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