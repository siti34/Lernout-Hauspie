export interface ChatRequest {
  message: string;
  session_id: string;
}

export interface ChatResponse {
  response: string;
  session_id: string;
}

export class APIError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

const BACKEND_BASE_URL = 'https://lernout-hauspie.onrender.com';

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  const existing = sessionStorage.getItem('mortgage_session_id');
  if (existing) return existing;
  const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('mortgage_session_id', newSessionId);
  return newSessionId;
}

export const chatAPI = {
  async sendMessage(message: string, sessionId?: string): Promise<string> {
    const session = sessionId || getOrCreateSessionId();
    
    const response = await fetch(`${BACKEND_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: session })
    });

    if (!response.ok) {
      throw new APIError(`HTTP ${response.status}`, response.status);
    }

    const data: ChatResponse = await response.json();
    return data.response;
  }
};

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/health`);
    return response.ok;
  } catch { return false; }
}

export async function testBackendConnection() {
  try {
    const result = await chatAPI.sendMessage("Hello test");
    return { success: true, response: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}