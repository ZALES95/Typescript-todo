// export class TodoList {
// 	get getLastId() {
// 		if (this.lastId) {
// 			return this.lastId
// 		} else {
// 			throw new Error("No lastId founded")
// 		}
// 	}

// 	constructor(private baseUrl: string, private lastId = 0) {
// 		this.baseUrl = baseUrl
// 	}

// 	async getAll() {
// 		const response = await fetch(`${this.baseUrl}`, {
// 			method: "GET",
// 		})
// 		const data = await response.json()
// 		this.lastId = data.length > 0 ? data[data.length - 1].id : 0
// 		return data
// 	}

// 	async addTask(title: string, priority: string) {
// 		const info = {
// 			title: title,
// 			isDone: false,
// 			priority: priority,
// 		}

// 		const response = await fetch(`${this.baseUrl}`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			method: "POST",
// 			body: JSON.stringify(info),
// 		})
// 		const data = await response.json()
// 		this.lastId = data.id
// 		return data
// 	}

// 	async removeTask(id: number) {
// 		let newId: any = id
// 		const response = await fetch(`${this.baseUrl}/${parseInt(newId)}`, {
// 			method: "DELETE",
// 		})
// 		const data = await response.json()
// 		return data
// 	}

// 	async changeToDone(id: number) {
// 		const baseRes = await fetch(`${this.baseUrl}/${id}`)
// 		const baseData = await baseRes.json()
// 		if (baseData.isDone === true) {
// 			baseData.isDone = false
// 		} else {
// 			baseData.isDone = true
// 		}

// 		const response = await fetch(`${this.baseUrl}/${id}`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			method: "PUT",
// 			body: JSON.stringify(baseData),
// 		})
// 		const data = await response.json()

// 		return data
// 	}

// 	async editTitle(id: number, newTitle: string) {
// 		const baseRes = await fetch(`${this.baseUrl}/${id}`)
// 		const baseData = await baseRes.json()

// 		baseData.title = newTitle

// 		const response = await fetch(`${this.baseUrl}/${id}`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			method: "PUT",
// 			body: JSON.stringify(baseData),
// 		})

// 		const data = await response.json()
// 		return data
// 	}

// 	async editPriority(id: number, newPriority: string) {
// 		const baseRes = await fetch(`${this.baseUrl}/${id}`)
// 		const baseData = await baseRes.json()

// 		baseData.priority = newPriority

// 		const response = await fetch(`${this.baseUrl}/${id}`, {
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			method: "PUT",
// 			body: JSON.stringify(baseData),
// 		})

// 		const data = await response.json()
// 		return data
// 	}
// }
