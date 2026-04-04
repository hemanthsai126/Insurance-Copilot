import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ABOUT_MD = `# P&C Insurance Copilot

A **demonstration full-stack app** for commercial P&C-style workflows: business risk scoring with explainability, policy-aware gap detection, an insurance-focused chat assistant, and optional quote-comparison (partner API or local demo tiles).

**Stack:** **FastAPI** (Python) backend · **React** + **Vite** + **Tailwind CSS** frontend · Proxied API calls from \`/api/*\` to the backend in dev.

---

## What’s in the app

### Home — risk & coverage analysis

Enter a **business profile** (industry, revenue, employees, property size, location, optional NAICS code, building and operations flags). The backend runs an **XGBoost** risk model with **SHAP** values so you can see **which factors drive the score**. Outputs include:

- Risk index and **claim-probability-style** readout (model output — not a carrier bindable rate)
- **Key risks** and **recommended coverages**
- **Premium band** narrative (illustrative band, not a quote)
- Optional **policy PDF**: text is extracted, run through **RAG-style policy parsing** for insights, and compared to the profile for **coverage gaps**
- **NAICS** resolution against a Census industry dataset when you supply a code
- **Location-aware features** (e.g. flood/crime proxies from bundled data where ZIP is known)

You can analyze with a **sample policy** text instead of uploading a file.

### Compare quotes

Multi-step wizard collects applicant-style fields, then \`POST /api/quotes/compare\` runs:

- **With** \`INSURANCE_QUOTES_API_URL\`: JSON is forwarded to **your** carrier or aggregator HTTPS API (per contract). Responses are normalized to **carrier name + annual premium** and shown as **tiles**.
- **Without** that URL: **demonstration** tiles — fictional carrier names and premiums **derived from your inputs** (not real bindable quotes).

No web scraping of insurer consumer sites.

### Risko — insurance-only chat

**Risko** answers questions scoped to **insurance and risk** (products, concepts, wording, industry mechanics). The backend defaults to **Ollama** on your machine (open-weight models; no cloud key required). Optionally switch to an **OpenAI-compatible** API via env vars.

---

## Backend API (overview)

| Method | Path | Purpose |
|--------|------|---------|
| \`GET\` | \`/api/health\` | Liveness |
| \`GET\` | \`/api/naics/lookup\` | NAICS → 2012 industry title |
| \`POST\` | \`/api/analyze\` | JSON profile + optional policy text → risk, SHAP, gaps, narrative |
| \`POST\` | \`/api/analyze-upload\` | Multipart form + optional policy PDF → same as analyze |
| \`POST\` | \`/api/upload-policy\` | PDF → extracted text only |
| \`POST\` | \`/api/quotes/compare\` | Applicant JSON → partner offers or demo tiles |
| \`POST\` | \`/api/risko/chat\` | Insurance-only chat completions |

CORS allows local dev origins (\`localhost:5173\`, etc.).

---

## Environment variables (backend)

**Quote integration**

- \`INSURANCE_QUOTES_API_URL\` — Partner quote API base URL (HTTPS). If unset, compare returns **demo** offers.
- \`INSURANCE_QUOTES_API_KEY\` — Optional \`Authorization: Bearer\`.
- \`INSURANCE_QUOTES_API_HEADERS\` — Optional extra headers, comma-separated \`Key:Value\` pairs.
- \`INSURANCE_QUOTES_TIMEOUT_CONNECT\` / \`INSURANCE_QUOTES_TIMEOUT_READ\` — Override HTTP timeouts (seconds) for partner calls.
- \`QUOTES_DEBUG_PAYLOAD\` — Set to \`1\` to echo the full submission JSON in compare responses (default is a minimal echo for speed).

**Risko (LLM)**

- \`RISKO_LLM_BACKEND\` — \`ollama\` (default) or \`openai\`.
- \`OLLAMA_BASE_URL\` — Default \`http://127.0.0.1:11434\`.
- \`OLLAMA_MODEL\` — default \`qwen2.5\` (override to any Ollama tag you have pulled, e.g. \`qwen2.5:7b\`).
- \`OPENAI_API_KEY\`, \`OPENAI_MODEL\`, \`OPENAI_CHAT_COMPLETIONS_URL\` — When using OpenAI-compatible backends.

---

## Run from scratch (local dev)

**Prerequisites:** [Python](https://www.python.org/) 3.11+ (3.10+ usually works), [Node.js](https://nodejs.org/) 20+ with npm, and [Ollama](https://ollama.com/) if you use **Risko** with a local model.

1. **Clone / open the project** and open two terminals (backend + frontend).

2. **Backend**
   - \`cd backend\`
   - Create a venv: \`python3 -m venv .venv\` then activate it (macOS/Linux: \`source .venv/bin/activate\`; Windows: \`.venv\\Scripts\\activate\`).
   - \`pip install -r requirements.txt\`
   - Start API: \`uvicorn app.main:app --reload --host 127.0.0.1 --port 8000\`  
     (Run this from \`backend\` so Python can import the \`app\` package.)

3. **Ollama + Qwen 2.5 (for Risko chat)**
   - Install Ollama and start it (menu app or \`ollama serve\` if needed).
   - Pull the default chat model: \`ollama pull qwen2.5\`
   - Optional: \`export OLLAMA_MODEL=qwen2.5:7b\` (or another tag you pulled).

4. **Frontend**
   - \`cd frontend\`
   - \`npm install\`
   - \`npm run dev\` — opens Vite (usually \`http://127.0.0.1:5173\`). It **proxies** \`/api\` to \`http://127.0.0.1:8000\` (see \`vite.config.ts\`).

5. **Smoke test**
   - Open \`/api/health\` in the browser or curl: \`http://127.0.0.1:8000/api/health\` → \`{"status":"ok"}\`.
   - In the app, open **Risko** and send a message; if you see errors about Ollama, confirm Ollama is running and the model is pulled.

---

## Data & models

- Trained **XGBoost** + **SHAP** artifacts live under \`backend/data/\` (e.g. \`risk_xgb.joblib\`) with optional retraining hooks from CSV in the same folder.
- **ZIP-level** or census-style files (e.g. crime proxy) support location features — see \`backend/data/\` and \`app/location_risk.py\`.
- **Notebooks** in \`notebooks/\` (e.g. data prep) are for exploration; they are not required to run the web app.

---

## Disclaimer

This project is for **education and product demos**. Outputs are **not** licensed insurance advice, legal advice, or bindable quotes unless you integrate a **real** carrier API and comply with regulations in your jurisdiction. Always involve licensed professionals for purchasing coverage, claims, and compliance decisions.
`;

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-teal-700">Project readme</p>
      <article className="readme-content prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-h1:mb-8 prose-h1:text-3xl prose-h1:font-semibold prose-h1:tracking-tight prose-h2:mt-10 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-table:text-sm prose-a:text-teal-700 prose-a:no-underline hover:prose-a:underline prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-slate-800 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-th:border prose-th:border-slate-300 prose-td:border prose-td:border-slate-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{ABOUT_MD}</ReactMarkdown>
      </article>
    </div>
  );
}
