import { taskInterface } from "./interfaces/single-task"
// import { TodoList } from "./components/fetch-class"

const input = document.querySelector(".todo-input")! as HTMLInputElement
const priorityList = document.querySelector(
	"#priority-list"
)! as HTMLSelectElement
const addBtn = document.querySelector(".btn-add")! as HTMLButtonElement
const errorInfo = document.querySelector(".error-info")! as HTMLElement
const ulList = document.querySelector("ul")! as HTMLUListElement
const popup = document.querySelector(".popup")! as HTMLDivElement
const popupInfo = document.querySelector(".popup-info")! as HTMLElement
const popupInput = document.querySelector(".popup-input")! as HTMLInputElement
const popupAddBtn = document.querySelector(".accept")! as HTMLButtonElement
const popupCloseBtn = document.querySelector(".cancel")! as HTMLButtonElement
const popupPriority = document.querySelector(
	"#popup-priority-list"
)! as HTMLSelectElement

let newLi: HTMLLIElement
let todoToEdit: HTMLLIElement
let previousPriority: number

class TodoList {
	get getLastId() {
		if (this.lastId) {
			return this.lastId
		} else {
			throw new Error("No lastId founded")
		}
	}

	constructor(private baseUrl: string, private lastId = 0) {
		this.baseUrl = baseUrl
	}

	async getAll() {
		const response = await fetch(`${this.baseUrl}`, {
			method: "GET",
		})
		const data = await response.json()
		this.lastId = data.length > 0 ? data[data.length - 1].id : 0
		return data
	}

	async addTask(title: string, priority: string) {
		const info = {
			title: title,
			isDone: false,
			priority: priority,
		}

		const response = await fetch(`${this.baseUrl}`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "POST",
			body: JSON.stringify(info),
		})
		const data = await response.json()
		this.lastId = data.id
		return data
	}

	async removeTask(id: number) {
		let newId: any = id
		const response = await fetch(`${this.baseUrl}/${parseInt(newId)}`, {
			method: "DELETE",
		})
		const data = await response.json()
		return data
	}

	async changeToDone(id: number) {
		const baseRes = await fetch(`${this.baseUrl}/${id}`)
		const baseData = await baseRes.json()
		if (baseData.isDone === true) {
			baseData.isDone = false
		} else {
			baseData.isDone = true
		}

		const response = await fetch(`${this.baseUrl}/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify(baseData),
		})
		const data = await response.json()

		return data
	}

	async editTitle(id: number, newTitle: string) {
		const baseRes = await fetch(`${this.baseUrl}/${id}`)
		const baseData = await baseRes.json()

		baseData.title = newTitle

		const response = await fetch(`${this.baseUrl}/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify(baseData),
		})

		const data = await response.json()
		return data
	}

	async editPriority(id: number, newPriority: string) {
		const baseRes = await fetch(`${this.baseUrl}/${id}`)
		const baseData = await baseRes.json()

		baseData.priority = newPriority

		const response = await fetch(`${this.baseUrl}/${id}`, {
			headers: {
				"Content-Type": "application/json",
			},
			method: "PUT",
			body: JSON.stringify(baseData),
		})

		const data = await response.json()
		return data
	}
}

const todo = new TodoList("http://localhost:3000/todolist")

const createTools = (title: string, id: string, priority: string) => {
	newLi = document.createElement("li")
	newLi.textContent = title
	newLi.setAttribute("id", id)
	switch (priority) {
		case "low":
			newLi.style.color = ""
			break
		case "medium":
			newLi.classList.add("mid-important")
			break
		case "high":
			newLi.classList.add("important")
			break
	}
	const toolsTemplate = document.querySelector(
		"#tools-template"
	)! as HTMLTemplateElement
	const importedNode = document.importNode(toolsTemplate.content, true)
	const element = importedNode.firstElementChild as HTMLDivElement
	newLi.insertAdjacentElement("beforeend", element)
	ulList.appendChild(newLi)
}

async function renderTasks() {
	const allTasks = await todo.getAll()
	const highTasks: taskInterface[] = allTasks.filter(
		(task: taskInterface) => task.priority === "high"
	)
	const mediumTasks: taskInterface[] = allTasks.filter(
		(task: taskInterface) => task.priority === "medium"
	)
	const lowTasks: taskInterface[] = allTasks.filter(
		(task: taskInterface) => task.priority === "low"
	)
	const sortedTasks: taskInterface[] = [
		...highTasks,
		...mediumTasks,
		...lowTasks,
	]

	for (let i = 0; i < allTasks.length; i++) {
		const taskToRender = sortedTasks[i]
		console.log(typeof taskToRender.id)

		createTools(taskToRender.title, taskToRender.id, taskToRender.priority)

		if (taskToRender.isDone) {
			newLi.classList.add("completed")
		}
	}
	if (ulList.innerText === "") {
		errorInfo.textContent = "Brak zadań na liście."
	} else {
		errorInfo.textContent = ""
	}
}

const addingTask = () => {
	if (
		input.value !== "" &&
		input.value.length > 3 &&
		input.value.length < 100
	) {
		todo.addTask(
			input.value,
			priorityList.options[priorityList.selectedIndex].text
		)

		createTools(
			input.value,
			(todo.getLastId + 1).toString(),
			priorityList.options[priorityList.selectedIndex].text
		)

		priorityList.selectedIndex = 0
		input.value = ""
		errorInfo.textContent = ""
	} else {
		errorInfo.textContent = "Musisz wpisać treść zadania o prawidłowej długości"
	}
}

const enterKeyCheck = (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		addingTask()
	}
}

const checkTaskIcon = (e: MouseEvent) => {
	if ((e.target as Element).matches(".complete")) {
		completeTask(e)
	} else if ((e.target as Element).matches(".edit")) {
		editTask(e)
	} else if ((e.target as Element).matches(".delete")) {
		removingTask(e)
	}
}

const removingTask = (e: MouseEvent) => {
	let idToDelete: string | null | number = (e.target as Element)
		.closest("li")!
		.getAttribute("id")
	if (typeof idToDelete === "string") {
		idToDelete = parseInt(idToDelete)
		console.log(idToDelete)
		todo.removeTask(idToDelete)
		ulList.removeChild((e.target as Element).closest("li")!)
	}
	let liNumber = ulList.getElementsByTagName("li")
	if (liNumber.length === 0) {
		errorInfo.textContent = "Brak zadań na liście."
	} else {
		errorInfo.textContent = ""
	}
}

const completeTask = (e: any) => {
	let idToDelete = e.target.closest("li").getAttribute("id")
	idToDelete = parseInt(idToDelete)
	todo.changeToDone(idToDelete)
	e.target.closest("li").classList.toggle("completed")
}

const editTask = (e: Event) => {
	popup.style.display = "flex"
	todoToEdit = (e.target as Element).closest("li")!
	popupInput.value = todoToEdit.innerText
	if (todoToEdit.classList.contains("important")) {
		popupPriority.selectedIndex = 2
	} else if (todoToEdit.classList.contains("mid-important")) {
		popupPriority.selectedIndex = 1
	} else {
		popupPriority.selectedIndex = 0
	}
	previousPriority = popupPriority.selectedIndex
}

const editTitle = () => {
	let idToChange: null | number = parseInt(todoToEdit.getAttribute("id")!)
	if (typeof idToChange === "number") {
		if (popupInput.value.length > 3 && popupInput.value.length < 100) {
			todo.editTitle(idToChange, popupInput.value)
			todoToEdit.firstChild!.textContent = popupInput.value
			popupInfo.textContent = ""
			popup.style.display = "none"
		} else {
			popupInfo.textContent =
				"Musisz wpisać treść zadania o prawidłowej długości"
		}
		if (
			previousPriority !== popupPriority.selectedIndex &&
			popupInput.value.length > 3 &&
			popupInput.value.length < 100
		) {
			todo.editPriority(
				idToChange,
				popupPriority.options[popupPriority.selectedIndex].text
			)
			switch (popupPriority.options[popupPriority.selectedIndex].text) {
				case "low":
					todoToEdit.classList.remove("mid-important")
					todoToEdit.classList.remove("important")
					todoToEdit.style.color = ""
					break
				case "medium":
					todoToEdit.classList.remove("important")
					todoToEdit.classList.add("mid-important")
					break
				case "high":
					todoToEdit.classList.remove("mid-important")
					todoToEdit.classList.add("important")
					break
			}
			popupInfo.textContent = ""
			popup.style.display = "none"
		}
	}
}

const enterKeyCheckEdit = (e: KeyboardEvent) => {
	if (e.key === "Enter") {
		editTitle()
	}
}

const closePopup = () => {
	popupInfo.innerText = ""
	popup.style.display = "none"
}

document.addEventListener("DOMContentLoaded", renderTasks)
addBtn.addEventListener("click", addingTask)
input.addEventListener("keyup", enterKeyCheck)
priorityList.addEventListener("keydown", enterKeyCheck)
ulList.addEventListener("click", checkTaskIcon)
popupAddBtn.addEventListener("click", editTitle)
popupCloseBtn.addEventListener("click", closePopup)
popupInput.addEventListener("keyup", enterKeyCheckEdit)
popupPriority.addEventListener("keydown", enterKeyCheckEdit)
