let tasks = [];

function createTask(title,priority){
    return{
        id:Date.now(),
        title : title,
        priority : priority,
        completed:false,
        createdAt: new Date()
    };
}

function addTask(title,priority){
    const task = createTask(title,priority);
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateStats();
}

//addTask("learn java","high");
//addTask("sql","moderate");

function deleteTask(id){
    tasks = tasks.filter( task => task.id !==id);
    saveTasks();
    renderTasks();
    updateStats();
}

function toggleTask(id){
    tasks = tasks.map( task =>{
        if(task.id === id){
            return{ ...task,completed: !task.completed};
        }
        return task;
    });
    saveTasks();
    renderTasks();
    updateStats();
}

function saveTasks(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (data) {
    tasks = JSON.parse(data);
  }
}
loadTasks();

const taskList = document.querySelector("#taskList");
const taskInput = document.querySelector("#taskInput");
const priorityInput = document.querySelector("#priorityInput");
const addBtn = document.querySelector("#addBtn");

function renderTasks(list = tasks){
    taskList.innerHTML="";

    list.forEach(task =>{
        const div = document.createElement("div");
        div.className="task";

        div.innerHTML=`
         <span style="text-decoration:${task.completed ? "line-through" : "none"}">
         ${task.title} (${task.priority})
         </span>
         <button onclick = "toggleTask(${task.id})">✔ </button>
      <button onclick="deleteTask(${task.id})">❌</button>
        `;

        taskList.appendChild(div);
    });
}

addBtn.addEventListener("click",()=>{
    const title = taskInput.value.trim();
    const priority = priorityInput.value;

    if(!title) return alert("task title required");

    addTask(title,priority);
    taskInput.value="";
});
renderTasks();

const filterAll = document.querySelector("#filterAll");
const filterCompleted = document.querySelector("#filterCompleted");
const filterPending = document.querySelector("#filterPending");
const filterHigh = document.querySelector("#filterHigh");

filterAll.addEventListener("click",()=> renderTasks(tasks));
filterCompleted.addEventListener("click",()=> renderTasks(tasks.filter(t => t.completed)));
filterPending.addEventListener("click", () => renderTasks(tasks.filter(t => !t.completed)));
filterHigh.addEventListener("click", () => renderTasks(tasks.filter(t => t.priority ==="high")));


const totalEl = document.querySelector("#total");
const completedEl = document.querySelector("#completed");
const pendingEl = document.querySelector("#pending");
const completionEl = document.querySelector("#completion");

function updateStats(){
    const total =tasks.length;
    const completed =tasks.reduce((acc,t)=> t.completed ? acc+1 : acc,0);
    const pending = total - completed;
    const completion = total ? Math.round((completed/total)*100):0;

    totalEl.textContent = total;
    completedEl.textContent = completed;
  pendingEl.textContent = pending;
  completionEl.textContent = completion;
}
updateStats();