// PLAN ID
const urlParams = new URLSearchParams(window.location.search);
const planID = urlParams.get("id");

if(!planID){
  alert("Brak planu!");
  window.location.href = "index.html";
}

// pokaż kod planu
document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("planCode").innerText = "Kod planu: " + planID;
});

// SCROLL FIX
function preventScrollPropagation(element) {
  element.addEventListener("wheel", (e) => {
    const atTop = element.scrollTop === 0;
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;

    if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
      e.preventDefault();
    }
  }, { passive: false });
}

function getPlan(){
  return JSON.parse(localStorage.getItem("plan_"+planID));
}

function savePlan(plan){
  localStorage.setItem("plan_"+planID, JSON.stringify(plan));
}

window.onload = () => {
  loadTodos();
  loadNotes();
  loadExpenses();
  loadMarkers();

  preventScrollPropagation(document.getElementById("todoList"));
  preventScrollPropagation(document.getElementById("expenseList"));
  preventScrollPropagation(document.getElementById("notes"));
};

// TODO
function addTodo() {
  const val = document.getElementById("todoInput").value;
  if (!val) return;

  let plan = getPlan();
  plan.todos.push({ text: val, done: false });

  savePlan(plan);
  document.getElementById("todoInput").value = "";
  loadTodos();
}

function loadTodos() {
  const ul = document.getElementById("todoList");
  ul.innerHTML = "";

  let plan = getPlan();

  plan.todos.forEach((t, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <input type="checkbox" ${t.done ? "checked":""} onchange="toggleTodo(${i})">
      ${t.text}
      <button onclick="deleteTodo(${i})">❌</button>
    `;
    ul.appendChild(li);
  });
}

function toggleTodo(i){
  let plan = getPlan();
  plan.todos[i].done = !plan.todos[i].done;
  savePlan(plan);
  loadTodos();
}

function deleteTodo(i){
  let plan = getPlan();
  plan.todos.splice(i,1);
  savePlan(plan);
  loadTodos();
}

// NOTES
function loadNotes(){
  let plan = getPlan();
  document.getElementById("notes").value = plan.notes || "";
}

document.addEventListener("DOMContentLoaded", ()=>{
  document.getElementById("notes").addEventListener("input", e=>{
    let plan = getPlan();
    plan.notes = e.target.value;
    savePlan(plan);
  });
});

// BUDGET
function addExpense(){
  const name = document.getElementById("expenseName").value;
  const val = parseFloat(document.getElementById("expenseInput").value);
  if(!name || !val) return;

  let plan = getPlan();
  plan.expenses.push({name, value: val});

  savePlan(plan);

  document.getElementById("expenseName").value="";
  document.getElementById("expenseInput").value="";
  loadExpenses();
}

function loadExpenses(){
  const ul = document.getElementById("expenseList");
  ul.innerHTML = "";

  let plan = getPlan();

  plan.expenses.forEach((e,i)=>{
    const li = document.createElement("li");
    li.innerHTML = `${e.name} - ${e.value} zł <button onclick="deleteExpense(${i})">❌</button>`;
    ul.appendChild(li);
  });

  document.getElementById("total").innerText =
    "Suma: " + plan.expenses.reduce((a,b)=>a+b.value,0) + " zł";
}

function deleteExpense(i){
  let plan = getPlan();
  plan.expenses.splice(i,1);
  savePlan(plan);
  loadExpenses();
}

// MAP
let map = L.map('map').setView([52.23,21.01],5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

map.on('click', e=>{
  const name = prompt("Nazwa miejsca:");
  if(!name) return;

  let plan = getPlan();

  const pos = {lat:e.latlng.lat, lng:e.latlng.lng, name};
  plan.markers.push(pos);

  savePlan(plan);

  L.marker([pos.lat,pos.lng]).addTo(map).bindPopup(name);
});

function loadMarkers(){
  let plan = getPlan();
  plan.markers.forEach(m=>{
    L.marker([m.lat,m.lng]).addTo(map).bindPopup(m.name);
  });
}

// EXTRA
function copyCode(){
  navigator.clipboard.writeText(planID);
  alert("Skopiowano kod!");
}

function leavePlan(){
  window.location.href = "index.html";
}
 <div class="card">
  <h3>📝 Lista rzeczy</h3>
  <ul id="todoList"></ul>
  <div style="display: flex; gap: 5px;">
    <input id="todoInput" placeholder="Nowe zadanie...">
    <button onclick="addTodo()">Dodaj</button>
  </div>
  <button onclick="generateAIList()" style="margin-top: 10px; background-color: #ff6b6b;">✨ Generuj z AI</button>
</div>