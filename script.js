// 1. POBIERANIE ID PLANU Z ADRESU URL
const urlParams = new URLSearchParams(window.location.search);
const planID = urlParams.get("id");

if (!planID) {
  alert("Brak ID planu! Wrócisz do strony głównej.");
  window.location.href = "index.html";
}

document.getElementById("planCode").innerText = "Kod planu: " + planID;

// --- FUNKCJE POMOCNICZE KOMUNIKACJI Z SERWEREM ---

// Pobieranie aktualnych danych z bazy
async function getPlan() {
  try {
    const res = await fetch(`http://127.0.0.1:3000/plans/${planID}`);
    if (!res.ok) throw new Error("Nie znaleziono planu");
    return await res.json();
  } catch (err) {
    console.error("Błąd pobierania:", err);
  }
}

// Wysyłanie zaktualizowanych danych do bazy (ZAPISYWANIE)
async function updatePlan(updatedData) {
  try {
    const res = await fetch(`http://127.0.0.1:3000/plans/${planID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) console.error("Błąd zapisu na serwerze");
  } catch (err) {
    console.error("Błąd sieci:", err);
  }
}

// --- INICJALIZACJA STRONY ---
window.onload = async () => {
  const plan = await getPlan();
  if (plan) {
    renderTodos(plan.todos || []);
    renderExpenses(plan.expenses || []);
    document.getElementById("notes").value = plan.notes || "";
    // Jeśli używasz mapy:
    if (typeof loadMarkers === "function") loadMarkers(plan.markers || []);
  }
};

// --- SEKCJA TO-DO ---
async function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input.value) return;

  const plan = await getPlan();
  const newTodo = { text: input.value, done: false };
  
  // Dodajemy do lokalnej kopii i wysyłamy całość do bazy
  const updatedTodos = [...plan.todos, newTodo];
  
  await updatePlan({ todos: updatedTodos });
  
  input.value = "";
  renderTodos(updatedTodos);
}

function renderTodos(todos) {
  const ul = document.getElementById("todoList");
  ul.innerHTML = todos.map((t, i) => `
    <li>
      <input type="checkbox" ${t.done ? "checked" : ""} onchange="toggleTodo(${i})">
      <span style="${t.done ? 'text-decoration: line-through' : ''}">${t.text}</span>
      <button onclick="deleteTodo(${i})">❌</button>
    </li>
  `).join('');
}

async function toggleTodo(i) {
  const plan = await getPlan();
  plan.todos[i].done = !plan.todos[i].done;
  await updatePlan({ todos: plan.todos });
  renderTodos(plan.todos);
}

async function deleteTodo(i) {
  const plan = await getPlan();
  plan.todos.splice(i, 1);
  await updatePlan({ todos: plan.todos });
  renderTodos(plan.todos);
}

// --- SEKCJA WYDATKÓW ---
async function addExpense() {
  const name = document.getElementById("expenseName").value;
  const val = parseFloat(document.getElementById("expenseInput").value);
  
  if (!name || isNaN(val)) return;

  const plan = await getPlan();
  const newExpense = { name, value: val };
  
  const updatedExpenses = [...plan.expenses, newExpense];
  
  await updatePlan({ expenses: updatedExpenses });
  
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseInput").value = "";
  renderExpenses(updatedExpenses);
}

function renderExpenses(expenses) {
  const ul = document.getElementById("expenseList");
  ul.innerHTML = expenses.map((e, i) => `
    <li>
      ${e.name}: <b>${e.value} zł</b>
      <button onclick="deleteExpense(${i})">❌</button>
    </li>
  `).join('');
  
  const total = expenses.reduce((sum, item) => sum + item.value, 0);
  document.getElementById("total").innerText = `Suma: ${total.toFixed(2)} zł`;
}

async function deleteExpense(i) {
  const plan = await getPlan();
  plan.expenses.splice(i, 1);
  await updatePlan({ expenses: plan.expenses });
  renderExpenses(plan.expenses);
}

// --- AUTOSAVE NOTATEK ---
document.getElementById("notes").addEventListener("blur", async (e) => {
  await updatePlan({ notes: e.target.value });
});

// --- AI GENERATOR ---
async function generateAI() {
  const promptInput = document.getElementById("aiInput");
  const btn = document.querySelector(".ai-box button");
  
  if (!promptInput.value) return;
  
  btn.innerText = "⏳ Generowanie...";
  btn.disabled = true;

  try {
    const res = await fetch("http://127.0.0.1:3000/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptInput.value })
    });
    
    const aiData = await res.json();
    const plan = await getPlan();

    // Łączymy stare dane z nowymi od AI
    const newTodos = [...plan.todos, ...aiData.todos.map(t => ({ text: t, done: false }))];
    const newNotes = plan.notes + "\n\nSugestie AI:\n" + aiData.notes;

    await updatePlan({ todos: newTodos, notes: newNotes });

    renderTodos(newTodos);
    document.getElementById("notes").value = newNotes;
    promptInput.value = "";
    
  } catch (err) {
    alert("Błąd AI");
    console.error(err);
  } finally {
    btn.innerText = "✨ Generuj";
    btn.disabled = false;
  }
}

// --- FUNKCJE POMOCNICZE ---
function copyCode() {
  navigator.clipboard.writeText(planID);
  alert("Skopiowano kod: " + planID);
}

function leavePlan() {
  window.location.href = "index.html";
}