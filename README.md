# Ghost Text AI

An AI-powered inline text autocomplete editor that provides intelligent, context-aware writing suggestions in real time, similar to ghost-text suggestions in modern AI writing assistants.

Ghost Text AI is built using React, TypeScript, TipTap, Python FastAPI, and Google Gemini.

## Features

- AI-powered inline text completion
- Real-time ghost-text suggestions
- Context-aware sentence completion
- Press Tab to accept suggestions
- Press Escape to dismiss suggestions
- Rich-text editor powered by TipTap
- REST API-based backend
- Secure API key configuration
- Modular frontend and backend architecture

## Use Cases

- Academic and research writing
- Technical documentation
- Professional email writing
- Content creation
- Business report writing
- General writing assistance

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, TypeScript |
| Editor | TipTap, ProseMirror |
| Build Tool | Vite |
| Backend | Python, FastAPI |
| AI Model | Google Gemini |
| API Server | Uvicorn |
| Version Control | Git and GitHub |

## System Architecture

```text
React + TypeScript Editor
          |
          v
TipTap Ghost Text Extension
          |
          v
FastAPI REST API
          |
          v
Google Gemini API
          |
          v
AI-Generated Text Suggestion
```

## Project Structure

```text
ghost-ai/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── gemini_service.py
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── extensions/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3.11 or later
- Node.js 22.12+ or a compatible newer version
- npm
- Git
- Google Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/kkshahi18/ghost-ai.git
cd ghost-ai
```

### 2. Configure the backend

The following commands are for Windows PowerShell.

```powershell
cd backend
python -m venv .venv
```

Install Python dependencies:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 3. Configure the Gemini API

Obtain your own Gemini API key from Google AI Studio:

https://aistudio.google.com/apikey

Create the environment configuration file:

```powershell
Copy-Item .env.example .env
```

Open the `.env` file and configure:

```dotenv
GEMINI_API_KEY=YOUR_API_KEY
GEMINI_MODEL=gemini-3.5-flash
```

Use a Gemini model supported by your API account. Model availability and quotas may change.

Never commit your actual API key to GitHub.

### 4. Start the backend server

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Backend URL:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/health

### 5. Configure the frontend

Open a separate terminal from the project root:

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open the application in your browser:

http://localhost:5173

## How to Use

1. Start the backend and frontend servers.
2. Open Ghost Text AI in your browser.
3. Begin typing a sentence.
4. Wait for the AI-generated ghost-text suggestion.
5. Press Tab to accept the suggestion.
6. Press Escape to dismiss it.

### Example

User input:

> Artificial intelligence helps project managers

Possible AI suggestion:

> identify potential risks and improve project delivery.

The suggestion is displayed as gray inline text before acceptance.

## API Reference

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

### Generate Autocomplete

```http
POST /api/autocomplete
```

Request body:

```json
{
  "text": "Artificial intelligence helps project managers"
}
```

Example response:

```json
{
  "suggestion": " identify risks and improve project outcomes."
}
```

## Troubleshooting

| Issue | Possible Solution |
|---|---|
| API key error | Verify the Gemini API key in backend/.env |
| HTTP 429 | Wait for the quota reset or review your API plan |
| HTTP 404 | Select a supported Gemini model |
| HTTP 503 | Inspect the FastAPI terminal for the underlying error |
| Frontend connection error | Confirm the backend is running on port 8000 |
| npm execution policy error | Use npm.cmd instead of npm on Windows |

## Cost and API Limitations

The application source code can be downloaded without payment. However, Google Gemini API usage is subject to Google's pricing, rate limits, and free-tier quotas.

Each user must configure their own API key.

## Security and Privacy

- API keys are stored in backend environment variables.
- The `.env` file must not be committed to GitHub.
- AI autocomplete sends text to Google Gemini for processing.
- Avoid entering confidential or sensitive information without reviewing the provider's data-handling policies.
- The current application is intended for local development and demonstration.

## Future Development Roadmap

- [ ] Local LLM integration using Ollama
- [ ] Support for Qwen and Llama models
- [ ] Multiple AI provider selection
- [ ] Grammar and spelling correction
- [ ] Academic writing mode
- [ ] Professional writing mode
- [ ] Multilingual autocomplete
- [ ] AI-powered text rewriting
- [ ] Request caching and quota optimization
- [ ] Dark mode
- [ ] Docker deployment
- [ ] Automated testing and CI/CD

## Contributing

Suggestions, bug reports, and contributions are welcome.

To propose improvements, fork the repository, create a feature branch, and submit a pull request.

## License

A software license has not yet been specified. Contact the repository owner for permission regarding reuse and redistribution.

## Author

**Krishna Kirti Shahi**

GitHub: https://github.com/kkshahi18

---

Ghost Text AI — Intelligent writing, one suggestion at a time.