from fastapi import FastAPI

app = FastAPI(title="Trip Service")

@app.get("/ping")
async def pong():
    return {"ping": "pong", "service": "trip-service", "status": "online"}

@app.get("/trips")
async def get_all_trips():
    # Tu w 4. tygodniu dodasz bazę danych
    return {"trips": []}