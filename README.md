# Insurance Copilot

**Commercial P&amp;C–style demo** for SMB-focused workflows: structured business inputs, **XGBoost** risk scoring with **SHAP** explainability, **policy PDF** text extraction with **TF‑IDF RAG** and gap detection, an **insurance-only** chat assistant (**Risko**) via **Ollama**, and a **compare quotes** flow (partner API or local demo tiles).

> Educational / demonstration software — not licensed insurance advice or bindable rates.

---

## Screenshots

### Home — underwriting dashboard

Business profile inputs, enriched location context (FEMA NFHL, OSM, weather archive, crime proxy), and risk outputs with SHAP-style feature attribution.

![Home — inputs, enrichment, risk & SHAP](docs/screenshots/home-underwriting-dashboard.png)

### Home — key risks, gaps, premium band & recommendations

Industry and location-driven risks, **coverage gaps** vs extracted policy text, heuristic **premium band**, and prioritized actions.

![Key risks, coverage gaps, premium estimate, recommendations](docs/screenshots/home-risks-recommendations.png)

### Risko — insurance-only assistant

Local **Ollama** + **Qwen 2.5** by default; Markdown answers with lists and tables. No cloud API key required for the default setup.

![Risko chat — Ollama / Qwen 2.5](docs/screenshots/risko-assistant.png)

### Compare quotes

Multi-step wizard; without `INSURANCE_QUOTES_API_URL`, **demonstration** carrier tiles with illustrative premiums.

![Compare quotes — demo carrier tiles](docs/screenshots/compare-quotes.png)

---

## Stack

| Layer | Technology |
|--------|------------|
| **API** | [FastAPI](https://fastapi.tiangolo.com/) (Python) |
| **ML** | XGBoost, SHAP, scikit-learn |
| **Policy text** | pypdf, TF‑IDF RAG + rule-based extraction |
| **UI** | React, Vite, Tailwind CSS |
| **Chat LLM** | Ollama (default) or OpenAI-compatible API |

---

## Quick start

**Backend** (from `backend/`):

```bash
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend** (from `frontend/`):

```bash
npm install
npm run dev
```

Open the app at `http://127.0.0.1:5173` (Vite proxies `/api` to port **8000**).

**Risko (optional):** install [Ollama](https://ollama.com), run `ollama pull qwen2.5`, keep Ollama running.

---

## Environment (high level)

| Variable | Purpose |
|----------|---------|
| `INSURANCE_QUOTES_API_URL` | Partner quote HTTPS endpoint (optional; demo tiles if unset) |
| `CORS_ORIGINS` | Extra allowed browser origins (comma-separated) |
| `OLLAMA_MODEL` | Default `qwen2.5` |
| `RISKO_LLM_BACKEND` | `ollama` (default) or `openai` + `OPENAI_API_KEY` |

See the in-app **About** page for the full list.

---

## Repository

[github.com/hemanthsai126/Insurance-Copilot](https://github.com/hemanthsai126/Insurance-Copilot)

---

## Disclaimer

This project is for **education and demos**. Model outputs, premium bands, and demo quotes are **not** binding insurance products. Use licensed professionals for coverage, claims, and compliance decisions in your jurisdiction.
