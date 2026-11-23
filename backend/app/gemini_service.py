
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

client = genai.Client(api_key=API_KEY) if API_KEY else None


def generate_completion(text: str) -> str:
    if client is None:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    prompt = (
        "You are an inline writing autocomplete engine.\n"
        "Continue the user's unfinished text naturally.\n"
        "Return only the missing continuation, not the original text.\n"
        "Use at most 12 words.\n"
        "Do not include explanations, quotation marks, or markdown.\n"
        "Preserve the user's language and writing style.\n\n"
        f"Text to continue:\n{text}"
    )

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.3,
            max_output_tokens=80,
        ),
    )

    suggestion = (response.text or "").replace("\n", " ").strip()

    if not suggestion:
        return ""

    # Add spacing when the input ends with a word.
    if text and not text[-1].isspace():
        if suggestion[0].isalnum():
            suggestion = " " + suggestion

    return suggestion
