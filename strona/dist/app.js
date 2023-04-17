var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const input = document.querySelector(".todo-input");
const priorityList = document.querySelector("#priority-list");
const addBtn = document.querySelector(".btn-add");
const errorInfo = document.querySelector(".error-info");
const ulList = document.querySelector("ul");
const popup = document.querySelector(".popup");
const popupInfo = document.querySelector(".popup-info");
const popupInput = document.querySelector(".popup-input");
const popupAddBtn = document.querySelector(".accept");
const popupCloseBtn = document.querySelector(".cancel");
const popupPriority = document.querySelector("#popup-priority-list");
let newLi;
let todoToEdit;
let previousPriority;
class TodoList {
    get getLastId() {
        if (this.lastId) {
            return this.lastId;
        }
        else {
            throw new Error("No lastId founded");
        }
    }
    constructor(baseUrl, lastId = 0) {
        this.baseUrl = baseUrl;
        this.lastId = lastId;
        this.baseUrl = baseUrl;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.baseUrl}`, {
                method: "GET",
            });
            const data = yield response.json();
            this.lastId = data.length > 0 ? data[data.length - 1].id : 0;
            return data;
        });
    }
    addTask(title, priority) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = {
                title: title,
                isDone: false,
                priority: priority,
            };
            const response = yield fetch(`${this.baseUrl}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(info),
            });
            const data = yield response.json();
            this.lastId = data.id;
            return data;
        });
    }
    removeTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let newId = id;
            const response = yield fetch(`${this.baseUrl}/${parseInt(newId)}`, {
                method: "DELETE",
            });
            const data = yield response.json();
            return data;
        });
    }
    changeToDone(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseRes = yield fetch(`${this.baseUrl}/${id}`);
            const baseData = yield baseRes.json();
            if (baseData.isDone === true) {
                baseData.isDone = false;
            }
            else {
                baseData.isDone = true;
            }
            const response = yield fetch(`${this.baseUrl}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify(baseData),
            });
            const data = yield response.json();
            return data;
        });
    }
    editTitle(id, newTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseRes = yield fetch(`${this.baseUrl}/${id}`);
            const baseData = yield baseRes.json();
            baseData.title = newTitle;
            const response = yield fetch(`${this.baseUrl}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify(baseData),
            });
            const data = yield response.json();
            return data;
        });
    }
    editPriority(id, newPriority) {
        return __awaiter(this, void 0, void 0, function* () {
            const baseRes = yield fetch(`${this.baseUrl}/${id}`);
            const baseData = yield baseRes.json();
            baseData.priority = newPriority;
            const response = yield fetch(`${this.baseUrl}/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "PUT",
                body: JSON.stringify(baseData),
            });
            const data = yield response.json();
            return data;
        });
    }
}
const todo = new TodoList("http://localhost:3000/todolist");
const createTools = (title, id, priority) => {
    newLi = document.createElement("li");
    newLi.textContent = title;
    newLi.setAttribute("id", id);
    switch (priority) {
        case "low":
            newLi.style.color = "";
            break;
        case "medium":
            newLi.classList.add("mid-important");
            break;
        case "high":
            newLi.classList.add("important");
            break;
    }
    const toolsTemplate = document.querySelector("#tools-template");
    const importedNode = document.importNode(toolsTemplate.content, true);
    const element = importedNode.firstElementChild;
    newLi.insertAdjacentElement("beforeend", element);
    ulList.appendChild(newLi);
};
function renderTasks() {
    return __awaiter(this, void 0, void 0, function* () {
        const allTasks = yield todo.getAll();
        const highTasks = allTasks.filter((task) => task.priority === "high");
        const mediumTasks = allTasks.filter((task) => task.priority === "medium");
        const lowTasks = allTasks.filter((task) => task.priority === "low");
        const sortedTasks = [
            ...highTasks,
            ...mediumTasks,
            ...lowTasks,
        ];
        for (let i = 0; i < allTasks.length; i++) {
            const taskToRender = sortedTasks[i];
            console.log(typeof taskToRender.id);
            createTools(taskToRender.title, taskToRender.id, taskToRender.priority);
            if (taskToRender.isDone) {
                newLi.classList.add("completed");
            }
        }
        if (ulList.innerText === "") {
            errorInfo.textContent = "Brak zadań na liście.";
        }
        else {
            errorInfo.textContent = "";
        }
    });
}
const addingTask = () => {
    if (input.value !== "" &&
        input.value.length > 3 &&
        input.value.length < 100) {
        todo.addTask(input.value, priorityList.options[priorityList.selectedIndex].text);
        createTools(input.value, (todo.getLastId + 1).toString(), priorityList.options[priorityList.selectedIndex].text);
        priorityList.selectedIndex = 0;
        input.value = "";
        errorInfo.textContent = "";
    }
    else {
        errorInfo.textContent = "Musisz wpisać treść zadania o prawidłowej długości";
    }
};
const enterKeyCheck = (e) => {
    if (e.key === "Enter") {
        addingTask();
    }
};
const checkTaskIcon = (e) => {
    if (e.target.matches(".complete")) {
        completeTask(e);
    }
    else if (e.target.matches(".edit")) {
        editTask(e);
    }
    else if (e.target.matches(".delete")) {
        removingTask(e);
    }
};
const removingTask = (e) => {
    let idToDelete = e.target
        .closest("li")
        .getAttribute("id");
    if (typeof idToDelete === "string") {
        idToDelete = parseInt(idToDelete);
        console.log(idToDelete);
        todo.removeTask(idToDelete);
        ulList.removeChild(e.target.closest("li"));
    }
    let liNumber = ulList.getElementsByTagName("li");
    if (liNumber.length === 0) {
        errorInfo.textContent = "Brak zadań na liście.";
    }
    else {
        errorInfo.textContent = "";
    }
};
const completeTask = (e) => {
    let idToDelete = e.target.closest("li").getAttribute("id");
    idToDelete = parseInt(idToDelete);
    todo.changeToDone(idToDelete);
    e.target.closest("li").classList.toggle("completed");
};
const editTask = (e) => {
    popup.style.display = "flex";
    todoToEdit = e.target.closest("li");
    popupInput.value = todoToEdit.innerText;
    if (todoToEdit.classList.contains("important")) {
        popupPriority.selectedIndex = 2;
    }
    else if (todoToEdit.classList.contains("mid-important")) {
        popupPriority.selectedIndex = 1;
    }
    else {
        popupPriority.selectedIndex = 0;
    }
    previousPriority = popupPriority.selectedIndex;
};
const editTitle = () => {
    let idToChange = parseInt(todoToEdit.getAttribute("id"));
    if (typeof idToChange === "number") {
        if (popupInput.value.length > 3 && popupInput.value.length < 100) {
            todo.editTitle(idToChange, popupInput.value);
            todoToEdit.firstChild.textContent = popupInput.value;
            popupInfo.textContent = "";
            popup.style.display = "none";
        }
        else {
            popupInfo.textContent =
                "Musisz wpisać treść zadania o prawidłowej długości";
        }
        if (previousPriority !== popupPriority.selectedIndex &&
            popupInput.value.length > 3 &&
            popupInput.value.length < 100) {
            todo.editPriority(idToChange, popupPriority.options[popupPriority.selectedIndex].text);
            switch (popupPriority.options[popupPriority.selectedIndex].text) {
                case "low":
                    todoToEdit.classList.remove("mid-important");
                    todoToEdit.classList.remove("important");
                    todoToEdit.style.color = "";
                    break;
                case "medium":
                    todoToEdit.classList.remove("important");
                    todoToEdit.classList.add("mid-important");
                    break;
                case "high":
                    todoToEdit.classList.remove("mid-important");
                    todoToEdit.classList.add("important");
                    break;
            }
            popupInfo.textContent = "";
            popup.style.display = "none";
        }
    }
};
const enterKeyCheckEdit = (e) => {
    if (e.key === "Enter") {
        editTitle();
    }
};
const closePopup = () => {
    popupInfo.innerText = "";
    popup.style.display = "none";
};
document.addEventListener("DOMContentLoaded", renderTasks);
addBtn.addEventListener("click", addingTask);
input.addEventListener("keyup", enterKeyCheck);
priorityList.addEventListener("keydown", enterKeyCheck);
ulList.addEventListener("click", checkTaskIcon);
popupAddBtn.addEventListener("click", editTitle);
popupCloseBtn.addEventListener("click", closePopup);
popupInput.addEventListener("keyup", enterKeyCheckEdit);
popupPriority.addEventListener("keydown", enterKeyCheckEdit);
export {};
//# sourceMappingURL=app.js.map