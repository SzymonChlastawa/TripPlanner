from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
import os
import json

app = FastAPI(title="AI Service")

# Pozwalamy frontendowi na strzały do tego API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # W produkcji podmienisz na domenę frontendu
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicjalizacja klienta (automatycznie pobierze OPENAI_API_KEY z env)
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Model danych, który przyjdzie z frontendu
class TripInfo(BaseModel):
    destination: str
    days: int

@app.post("/generate-todos")
async def generate_todos(info: TripInfo):
    prompt = f"Jadę do: {info.destination} na {info.days} dni. Wygeneruj listę max 5 najważniejszych rzeczy do spakowania/zrobienia przed wyjazdem. Zwróć TYLKO czysty format JSON jako listę stringów, bez wstępu. Przykład: [\"Paszport\", \"Krem z filtrem\"]."

    response = await client.chat.completions.create(
        model="gpt-3.5-turbo", # Jeśli masz klucz OpenAI. Dla Groq np. "llama3-8b-8192"
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )
    
    # Przetworzenie tekstowej odpowiedzi na prawdziwy JSON (listę)
    try:
        items = json.loads(response.choices[0].message.content)
    except Exception:
        items = ["Nie udało się wygenerować listy. Spróbuj ponownie."]

    return {"items": items}
    @app.get("/ping")
def ping():
    return {"ping": "pong"}

@app.get("/trips")
def get_trips():
    return {"trips": []}