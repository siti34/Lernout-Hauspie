# Lernout-Hauspie — Mortgage Mortgage Assistant

AI-assisted mortgage support application consisting of:

- A FastAPI backend with two modes: a simple chat agent (Claude) and a LangFlow-integrated chat + loan CRUD API.
- A React + Vite frontend with Tailwind/shadcn UI components.
- Optional Supabase/PostgreSQL storage for loan applications.

## Repository structure

```text
.
├── backend/
│   ├── main.py                       # Entrypoint that re-exports the simple agent app
│   ├── requirements.txt              # Python deps (FastAPI, uvicorn, langchain-anthropic, dotenv)
│   ├── load_to_supabase.py           # Helper to bulk-load CSV data to Supabase (configure env first)
│   ├── agents/
│   │   └── mortgage_agent.py         # Simple FastAPI app exposing /chat (Claude) + /health
│   └── app/
│       ├── main.py                   # Full FastAPI app: LangFlow chat + SQLAlchemy loan CRUD
│       ├── clients/
│       │   └── langflow_client.py    # Async HTTP client for LangFlow flows
│       └── schemas/
│           └── chat.py               # Pydantic models for chat contracts
├── frontend/
│   ├── client/                       # React app (Vite)
│   │   ├── App.tsx
│   │   ├── api/client.ts             # Frontend HTTP client for chat + health
│   │   ├── components/               # UI and feature components
│   │   └── global.css
│   ├── public/
│   ├── shared/api.ts                 # Shared types
│   ├── package.json                  # Scripts and dependencies
│   └── vite.config*.ts
├── frontend-clerk-side/         # Clerk Interface
│   ├── client/
│   │   ├── App.tsx
│   │   ├── global.css
│   │   ├── components/
│   │   │   ├── layout/           # AppLayout, TopBar, etc.
│   │   │   └── ui/               # shadcn/ui components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility functions
│   │   └── pages/                # Page components (Dashboard, Profile, etc.)
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts

├── langflow-application/             # Saved LangFlow flows
└── README.md
```

## Backend

There are two FastAPI apps in this repo. Choose the one that matches your integration needs.

1. Simple Mortgage Agent (Claude)

- File: `backend/agents/mortgage_agent.py`
- Purpose: Minimal chat gateway to Anthropic Claude using LangChain.
- Endpoints:
  - POST `/chat` → body: `{ message: string, session_id: string }` → `{ response: string, session_id: string }`
  - GET `/health` → `{ status: "healthy", service: "mortgage-assistant" }`
- Env vars:
  - `CLAUDE_API_KEY` (required)
  - `PORT` (optional, default 8000)
- CORS: Allows localhost 3000/5173 and `lh-mortgage.netlify.app`.

2. LangFlow-integrated API + Loan CRUD

- File: `backend/app/main.py`
- Purpose: Full chat relay to a LangFlow flow + SQLAlchemy LoanApplication CRUD and utility endpoints.
- Endpoints:
  - GET `/health`
  - POST `/agent` → Chat proxy to LangFlow
    - Request: `{ session_id: string, messages: [{ role: "user"|"assistant"|"system", content: string }] }`
    - Response: `{ output_text: string, meta?: {...} }`
  - GET `/loans` → List loan applications
  - POST `/loans` → Create loan application (body matches `LoanApplicationCreate` in `app/main.py`)
  - PUT `/loans/{loan_id}` → Update
  - DELETE `/loans/{loan_id}` → Delete
  - GET `/loans/search` → Filtered search via query params
  - POST `/calculate-rate` → Quick rate estimate
- Env vars:
  - `DATABASE_URL` (e.g., Postgres/Supabase DSN)
  - `LANGFLOW_URL`, `LANGFLOW_API_KEY`, `LANGFLOW_FLOW_ID`
  - `PORT` (optional), `ENVIRONMENT` (optional; `development` enables uvicorn reload)
- CORS: Allows localhost 3000/5173 and builder.io subdomains.

SQLAlchemy model:

- Table: `LoanApplication` with many mortgage-relevant fields (income, credit score, balances, DTI, etc.). See `app/main.py` for full schema.

LangFlow client:

- `app/clients/langflow_client.py` asynchronously posts to `POST {LANGFLOW_URL}/api/v1/run/{flow_id}` and extracts text from nested `outputs` structures.

Data load helper:

- `backend/load_to_supabase.py` uploads a CSV to a Postgres table via SQLAlchemy. Do not hardcode secrets; replace inline DSN with an environment variable before use.

Install and run (backend):

- Python 3.10+ recommended.
- `pip install -r backend/requirements.txt`
- Run simple agent: `python backend/agents/mortgage_agent.py`
- Run LangFlow API: `python backend/app/main.py`

Deployed docs:

- Render/Swagger (if deployed with docs): https://lernout-hauspie.onrender.com/docs

## Frontend (Customer Side)

Tech stack

- React 18, Vite, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, React Router.

Key files

- `client/App.tsx`: App shell and routing.
- `client/api/client.ts`: Minimal fetch client for backend `chat` and `health`.
  - `BACKEND_BASE_URL` currently points to `https://lernout-hauspie.onrender.com`.
  - `chatAPI.sendMessage(message, sessionId?)` posts to `/chat` of the simple agent.
- `client/components/*`: Feature UIs like `Chat.tsx`, `MortgageApplicationForm.tsx`, `BankSelection.tsx`, etc.
- `client/components/ui/*`: Reusable shadcn/ui components.

Components overview (selected)

- `components/Chat.tsx` — Full-feature chat widget using TanStack Query; supports retries and history.
- `components/MortgageChat.tsx` — Mobile-styled chat flow with quick replies and application CTAs.
- `components/MortgageCalculator.tsx` — UI for monthly payment and LTV calculations (uses `lib/mortgage.ts`).
- `components/MortgageApplicationForm.tsx` — Collects applicant details.
- `components/BankSelection.tsx`, `UploadDocuments.tsx`, `ApplicationSummary.tsx`, `ApplicationStatus.tsx`, `ApplicationSuccess.tsx` — Steps in the loan application journey.
- `components/DebugLangflow.tsx` — Utility for debugging LangFlow.
- `components/BottomNavigation.tsx`, `StartPage.tsx`, `EditDetails.tsx`, `MortgageResults.tsx`, `OldMortgageChat.tsx` — Navigation and legacy or auxiliary views.

Hooks and libs

- `hooks/use-mobile.tsx` — Responsive/mobile helpers.
- `hooks/use-toast.ts` — Toast utilities (shadcn).
- `lib/mortgage.ts` — Mortgage calculations: `calculateMortgage`, `validateMortgageInputs`, `formatCurrency` with typed inputs/results.
- `lib/utils.ts` — Frontend utility helpers and specs (`utils.spec.ts`).

Server (optional)

- `server/index.ts` — Express server used for SSR/edge or Netlify functions, exposes `/api/ping` and `/api/demo`.
- `server/routes/demo.ts` — Returns a sample `DemoResponse`.
- Configure with `npm run build` + `npm start` (uses `dist/server/node-build.mjs`).

Scripts (from `frontend/package.json`)

- `npm run dev` — start Vite dev server
- `npm run build` — build SPA and server bundle
- `npm start` — run built server entry (Node)
- `npm test` — run unit tests with Vitest
- `npm run typecheck` — TypeScript checks

Notes on chat contracts

- The repo exposes two backend chat contracts:
  1. Simple `/chat` (string in, string out) from `agents/mortgage_agent.py`.
  2. LangFlow `/agent` (multi-message) from `app/main.py`.
- Ensure the frontend client matches the selected backend. If you switch to `/agent`, update `client/api/client.ts` and related types to send `{ session_id, messages[] }` and handle `{ output_text }` in responses.

## Frontend (Clerk Side)

The `frontend-clerk-side` directory contains an alternative React + Vite frontend with Clerk authentication and additional layout components.

**Key files:**
- `client/App.tsx`: Main app shell and routing.
- `client/components/layout/AppLayout.tsx`, `TopBar.tsx`: Layout and navigation.
- `client/components/ui/*`: Reusable shadcn/ui components.
- `client/pages/*`: Page components such as `Dashboard`, `CustomerProfile`, `Documents`, etc.
- `client/hooks/*`: Custom React hooks.
- `client/lib/*`: Utility functions and specs.
- `global.css`: Global styles.

**Setup:**
1. `cd frontend-clerk-side`
2. `npm install`
3. `npm run dev` (Vite dev server)

**Note:**  
This frontend is designed for use with Clerk authentication and may have different routing, layout, and UI patterns compared to the main frontend.

---


## Environment variables

Create a `.env` file in the project root or export vars in your shell. Do not commit secrets.

Backend (simple agent)

- `CLAUDE_API_KEY`
- `PORT` (optional)

Backend (LangFlow + DB)

- `LANGFLOW_URL`
- `LANGFLOW_API_KEY`
- `LANGFLOW_FLOW_ID`
- `DATABASE_URL`
- `PORT` (optional), `ENVIRONMENT` (optional)

Frontend

- Typically none required; `BACKEND_BASE_URL` is currently hardcoded in `client/api/client.ts`. Change it if you deploy the backend elsewhere.

## Local development (macOS)

Backend

1. Python env and deps: `pip install -r backend/requirements.txt`
2. Choose a backend:
   - Simple agent: `python backend/agents/mortgage_agent.py`
   - LangFlow API: `python backend/app/main.py`

Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev` (Vite dev server)

CORS

- Both backends allow localhost 3000/5173 by default. Adjust allowed origins if your ports differ.

## API quick reference

Simple chat (Claude)

- POST `/chat`
  - Request: `{ "message": string, "session_id": string }`
  - Response: `{ "response": string, "session_id": string }`

LangFlow chat

- POST `/agent`
  - Request: `{ "session_id": string, "messages": [{ "role": "user"|"assistant"|"system", "content": string }] }`
  - Response: `{ "output_text": string, "meta"?: object }`

Loans

- GET `/loans`, POST `/loans`, PUT `/loans/{id}`, DELETE `/loans/{id}`
- GET `/loans/search` with optional query params: `age`, `loanamount`, `creditscore`, `employmentstatus`, `loanapproved`.

## Deployment

- Backend: Render (or any FastAPI-compatible hosting). Ensure env vars are set.
- Database: Supabase (Postgres). Avoid storing credentials in code. Prefer `DATABASE_URL` env var.
- Frontend: Netlify (repo includes `netlify.toml`). Point API calls to your backend URL.

## Contributing

1. Create a feature branch: `git checkout -b feature/your-topic`
2. Commit changes: `git commit -m "feat: your change"`
3. Push: `git push origin feature/your-topic`
4. Open a Pull Request

Please keep `.env` files and secrets out of the repository.
