
export async function getSuggestion(
  text: string,
  signal?: AbortSignal
): Promise<string> {
  const response = await fetch(
    "http://127.0.0.1:8000/api/autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
      signal,
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: { suggestion: string } = await response.json();

  return data.suggestion;
}
