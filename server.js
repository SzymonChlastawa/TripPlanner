import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";

const app = express();

// Konfiguracja CORS
app.use(cors());
app.use(express.json());

// --- POŁĄCZENIE Z BAZĄ DANYCH ---
mongoose.connect("mongodb://127.0.0.1:27017/triplanner")
  .then(() => console.log("✅ Połączono z MongoDB"))
  .catch(err => console.error("❌ Błąd połączenia z MongoDB:", err));

// Definicja modelu Planu
const planSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  todos: [{ text: String, done: Boolean }],
  expenses: [{ name: String, value: Number }],
  notes: { type: String, default: "" },
  markers: [{ lat: Number, lng: Number, name: String }]
});

const Plan = mongoose.model("Plan", planSchema);

// --- KONFIGURACJA AI ---
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDZRQiO_aYM7qe4tVozQeO3k0jMRKcUAIY" 
});

// --- API ENDPOINTS ---

// Tworzenie nowego planu
app.post("/plans", async (req, res) => {
  try {
    const newPlan = new Plan(req.body);
    await newPlan.save();
    console.log(`🆕 Utworzono plan: ${req.body.id}`);
    res.status(201).json(newPlan);
  } catch (err) {
    console.error("Błąd zapisu:", err);
    res.status(500).json({ error: "Błąd bazy danych" });
  }
});

// Pobieranie planu
app.get("/plans/:id", async (req, res) => {
  try {
    const plan = await Plan.findOne({ id: req.params.id });
    if (plan) res.json(plan);
    else res.status(404).json({ error: "Plan nie istnieje" });
  } catch (err) {
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// Aktualizacja planu - TUTAJ ZOSTAŁA WPROWADZONA POPRAWKA OSTRZEŻENIA
app.put("/plans/:id", async (req, res) => {
  try {
    const updated = await Plan.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { returnDocument: 'after' } // Zmienione z new: true na returnDocument: 'after'
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Błąd aktualizacji" });
  }
});

// Obsługa AI
app.post("/ai", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(`
      Zwróć odpowiedź WYŁĄCZNIE jako JSON: 
      {"todos": ["zadanie"], "notes": "opis"}
      Prompt: ${prompt}
    `);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    res.json(JSON.parse(jsonMatch ? jsonMatch[0] : text));
  } catch (err) {
    res.status(500).json({ error: "Błąd AI" });
  }
});

app.listen(3000, "127.0.0.1", () => {
  console.log("🚀 Backend działa na http://127.0.0.1:3000");
});