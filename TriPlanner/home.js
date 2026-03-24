function generateID() {
  return Math.random().toString(36).substring(2,8);
}

function createPlan(){
  const id = generateID();

  localStorage.setItem("plan_"+id, JSON.stringify({
    todos: [],
    expenses: [],
    notes: "",
    markers: []
  }));

  window.location.href = "planner.html?id=" + id;
}

function joinPlan(){
  const id = prompt("Podaj kod planu:");
  if(!id) return;

  if(localStorage.getItem("plan_"+id)){
    window.location.href = "planner.html?id=" + id;
  } else {
    alert("Nie znaleziono planu!");
  }
}