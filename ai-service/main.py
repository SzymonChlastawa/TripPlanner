from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
import os
import json

app = FastAPI(title="AI Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ❗ NIE inicjalizujemy klienta tutaj
client = None


class TripInfo(BaseModel):
    destination: str
    days: int


@app.post("/generate-todos")
async def generate_todos(info: TripInfo):
    # ✅ klient tworzony dopiero tutaj (CI się nie wywali)
    client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = f"Jadę do: {info.destination} na {info.days} dni. Wygeneruj listę max 5 najważniejszych rzeczy do spakowania/zrobienia przed wyjazdem. Zwróć TYLKO czysty format JSON jako listę stringów."

    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    try:
        items = json.loads(response.choices[0].message.content)
    except Exception:
        items = ["Nie udało się wygenerować listy. Spróbuj ponownie."]

    return {"items": items}


# ✅ endpointy do testów

@app.get("/ping")
def ping():
    return {"ping": "pong"}


@app.get("/trips")
def get_trips():
    return {"trips": []}