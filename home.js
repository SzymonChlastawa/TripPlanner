function generateID() {
  return Math.random().toString(36).substring(2, 8);
}

async function createPlan() {
  const id = generateID();

  const initialPlan = {
    id: id,
    todos: [],
    expenses: [],
    notes: "Plan mojej podróży...",
    markers: []
  };

  console.log("Próba wysłania danych do serwera...");

  try {
    // Używamy 127.0.0.1, aby pasowało do Live Servera
    const res = await fetch("http://127.0.0.1:3000/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initialPlan)
    });

    if (res.ok) {
      console.log("Plan utworzony pomyślnie!");
      window.location.href = "planner.html?id=" + id;
    } else {
      const errText = await res.text();
      console.error("Serwer zwrócił błąd:", errText);
      alert("Błąd serwera. Sprawdź konsolę.");
    }
  } catch (err) {
    console.error("Błąd fetch:", err);
    alert("Błąd: Serwer nie odpowiada. Sprawdź czy w terminalu widnieje 'Backend działa'!");
  }
}

async function joinPlan() {
  const id = prompt("Podaj kod planu:");
  if (!id) return;

  try {
    const res = await fetch(`http://127.0.0.1:3000/plans/${id}`);
    if (res.ok) {
      window.location.href = "planner.html?id=" + id;
    } else {
      alert("Kod planu jest nieprawidłowy.");
    }
  } catch (err) {
    alert("Błąd połączenia z serwerem.");
  }
}