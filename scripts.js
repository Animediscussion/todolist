const addBtn = document.querySelector(".add-btn");
const deleteBtn = document.querySelector(".remove-btn")
const modal = document.querySelector(".modal_cont");
const PrioritySetModal = document.querySelector(".priority-color-cont");
const PriorityColorArray = document.querySelectorAll(".priority-color");
const mainContainer = document.querySelector(".main_cont");
const textArea = document.querySelector(".textarea-cont");
const toolBoxPriorityContainer = document.querySelector(".toolbox-priority-cont");
const pendingContainer = document.querySelector(".pending-cont");
const finishedContainer = document.querySelector(".finished-cont");
let currentColor = "green";
let deleteFlag = false;
const uid = new ShortUniqueId({ length: 5 });
const colors = ["pink", "blue", "purple", "green"];
const allTickets = [];
const container = document.querySelectorAll(".container");

window.addEventListener("load", () => {
 const getAllTickets = JSON.parse(localStorage.getItem("todoTasks"));
 for(let i = 0; i < getAllTickets.length; i++){
  let ticketObj = getAllTickets[i];
  createTicket(
  ticketObj.content,
  ticketObj.color,
  ticketObj.id,
  ticketObj.isPending
  );
 }
});

toolBoxPriorityContainer.addEventListener("click",(e) => {
if(e.target === e.currentTarget){
 return;
}
const currentFilterColor = e.target.classList[1];
const ticketList = document.querySelectorAll(".ticket-cont");
for(let i = 0; i<ticketList.length; i++){
 const ticketColorElem = ticketList[i].querySelector(".ticket-color");
 const ticketColor = ticketColorElem.classList[1];
 if(ticketColor !== currentFilterColor){
  ticketList[i].style.display = "none";
 }else {
  ticketList[i].style.display = "block";
 }
}
});

toolBoxPriorityContainer.addEventListener("dblclick", (e) => {
        if (e.target == e.currentTarget) {
            return;
        }
        const ticketList = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < ticketList.length; i++) {
            ticketList[i].style.display = "block";
        }
    });

addBtn.addEventListener("click", () => {
 modal.style.display = "flex";
});
deleteBtn.addEventListener("click", () =>{
if(!deleteFlag) {
 deleteBtn.style.color = "red";
}else{
 deleteBtn.style.color = "black";
}
deleteFlag = !deleteFlag;

});


function createTicket(content, currentColor, ticketId, isPending = true) {
const len = document.querySelectorAll(".ticket-cont");
const id = ticketId || len.length + 1;
const ticketContainer = document.createElement("div");
ticketContainer.setAttribute("class", "ticket-cont");
ticketContainer.setAttribute("draggable", true);
ticketContainer.innerHTML = `<div class="ticket-color ${currentColor}"></div>
                             <div class="ticket-id">${id}</div>
                             <div class="ticket-area">${content}</div>
                             <div class="lock-unlock">
                             <i class="fa-solid fa-lock"></i>
                             </div>`;
  if(isPending) {
   pendingContainer.appendChild(ticketContainer);
  }else{
   finishedContainer.appendChild(ticketContainer);
  }
  ticketTaskController(ticketContainer, id);
  const ticketObj = {
   id: id,
   content: content,
   color: currentColor,
   isPending: isPending,
  };
  allTickets.push(ticketObj);
  updateLocalStorage();
}
function ticketTaskController(ticketContainer, id){
 const ticketTextArea = ticketContainer.querySelector(".ticket-area");
 ticketContainer.addEventListener("click", (e) =>{
  if(deleteFlag){
   ticketContainer.remove();
    const ticketIdx = allTickets.findIndex((ticket) => ticket.id === id);
               if (ticketIdx !== -1) {
                   allTickets.splice(ticketIdx, 1);
               }
     updateLocalStorage();
  } else if(e.target.classList.contains("fa-lock")){
    ticketTextArea.setAttribute("contenteditable", "true");
    const lockElem = e.target;
    lockElem.classList.remove("fa-lock");
    lockElem.classList.add("fa-lock-open");
  }else if(e.target.classList.contains("fa-lock-open")){

      ticketTextArea.setAttribute("contenteditable", "false");
      const lockElem = e.target;
      lockElem.classList.remove("fa-lock-open");
      lockElem.classList.add("fa-lock");
      const ticketObj = allTickets.find((ticket) => {
             return ticket.id === id;
            });
            ticketObj.content = ticketTextArea.textContent;
  } else if(e.target.classList.contains("ticket-color")) {
    const color = e.target.classList[1];
    const idx = colors.indexOf(color);
    const nextIdx = (idx + 1) % colors.length;
    e.target.classList.remove(color);
    e.target.classList.add(colors[nextIdx]);
    const ticketObj = allTickets.find((ticket) => {
     return ticket.id === id;
    });
    ticketObj.color = colors[nextIdx];
  }
  updateLocalStorage();
 });
}

modal.addEventListener("keydown", (e) => {
 if(e.key != "Enter"){
  return;
 }
 const content = e.target.value;
 createTicket(content, currentColor);
 modal.style.display ="none";
 textArea.value ="";
 currentColor = "green";
 for(let i = 0; i < PriorityColorArray.length; i++){
   PriorityColorArray[i].classList.remove("active");
  }
  PriorityColorArray[2].classList.add("active");
 console.log(content);
});

PrioritySetModal.addEventListener("click", (e) => {
 if(e.target === e.currentTarget){
  return;
 }
 currentColor = e.target.classList[1];
 for(let i = 0; i < PriorityColorArray.length; i++){
  PriorityColorArray[i].classList.remove("active");
 }
 e.target.classList.add("active");
});

function updateLocalStorage() {
 localStorage.setItem("todoTasks", JSON.stringify(allTickets));
}

let draggedElement = null;
container.forEach((container) => {
 container.addEventListener("dragstart", (event) => {
  console.log(event.target);
  if(event.target.classList.contains("ticket-cont")){
   draggedElement = event.target;
  }
 });
 container.addEventListener("dragover", (event) => {
  event.preventDefault();
 });
 container.addEventListener("drop", (event) => {
  if(draggedElement){
   container.appendChild(draggedElement);
   const isPendingContainer = container.classList[0] === "pending-cont" ? true : false;
   const idx = Number(draggedElement.querySelector(".ticket-id").innerText);
    const ticketObj = allTickets.find((ticket) => {
        return ticket.id === idx;
    });
    ticketObj.isPending = isPendingContainer;
  }
  updateLocalStorage();
 });
});