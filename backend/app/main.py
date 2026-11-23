
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi import HTTPException
from app.gemini_service import generate_completion

app = FastAPI(title="Ghost Text AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

COMPLETIONS = {
    "python is": " a powerful programming language.",
    "artificial intelligence is": " transforming modern technology.",
    "machine learning": " enables computers to learn from data.",
    "the project manager": " is responsible for successful delivery.",
    "this research paper": " presents a new approach to the problem.",
    "hello": " and welcome to Ghost Text AI!",
}


class CompletionRequest(BaseModel):
    text: str = Field(min_length=1, max_length=10000)


class CompletionResponse(BaseModel):
    suggestion: str


@app.get("/health")
def health():
    return {"status": "ok"}



@app.post(
    "/api/autocomplete",
    response_model=CompletionResponse
)
def autocomplete(request: CompletionRequest):
    try:
        suggestion = generate_completion(request.text)

        return CompletionResponse(
            suggestion=suggestion
        )

    except Exception as exc:
        print(f"Gemini autocomplete error: {type(exc).__name__}: {exc}")

        raise HTTPException(
            status_code=503,
            detail="AI autocomplete is temporarily unavailable"
        ) from exc
