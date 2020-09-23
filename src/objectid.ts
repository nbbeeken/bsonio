export class ObjectId {
	#id: Uint8Array
	constructor() {
		this.#id = new Uint8Array(12)
		window.crypto.getRandomValues(this.#id)
	}
}
