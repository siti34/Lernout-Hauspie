# backend/agents/mortgage_agent.py

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os
port = int(os.environ.get("PORT", 8000))

# Load environment variables
load_dotenv()

app = FastAPI(title="OP Bank Mortgage Assistant")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[        
        "http://localhost:8080",    # Your actual frontend port
        "http://127.0.0.1:8080",
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173" ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Customer context for Theresa
CUSTOMER_CONTEXT = """
Customer: Theresa Stewart
Annual Income: €65,000
Credit Score: 720
Loan Amount: €225,000
Property: Mannerheimintie 12, 00100 Helsinki
Monthly Payment: €1,245
Application ID: OP-2024-0312
Employment: Senior Analyst (3 years)
Down Payment: €25,000
"""

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"

class ChatResponse(BaseModel):
    response: str
    session_id: str

def get_claude_response(user_message: str) -> str:
    try:
        from langchain_anthropic import ChatAnthropic
        from langchain_core.messages import HumanMessage, SystemMessage
        
        api_key = os.getenv("CLAUDE_API_KEY")
        if not api_key:
            return "Claude API key not configured. Please check your .env file."
        
        claude = ChatAnthropic(
            model="claude-3-5-sonnet-20241022",
            api_key=api_key,
            temperature=0.1,
            max_tokens=1000
        )
        
        system_message = f"""You are a helpful mortgage assistant for OP Bank in Finland. 

{CUSTOMER_CONTEXT}

You help with mortgage applications, interest rates, payment calculations, and loan processes. 
Be professional, helpful, and reference the customer's specific situation when relevant.
Always use € for currency and European formatting.
Keep responses conversational and helpful."""

        messages = [
            SystemMessage(content=system_message),
            HumanMessage(content=user_message)
        ]
        
        response = claude.invoke(messages)
        return response.content
        
    except ImportError:
        return "Claude integration not available. Please install langchain-anthropic."
    except Exception as e:
        return f"Error: {str(e)}"

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response = get_claude_response(request.message)
        return ChatResponse(response=response, session_id=request.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "mortgage-assistant"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=port)