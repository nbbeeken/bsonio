function random(size: number): Uint8Array {
	const result = new Uint8Array(size);
	for (let i = 0; i < size; ++i) {
		result[i] = Math.floor(Math.random() * 256);
	}
	return result;
}


export class ObjectId {
	_id: Uint8Array
	constructor() {
		if (typeof window !== 'undefined') {
			this._id = new Uint8Array(12)
			window.crypto.getRandomValues(this._id)
			return
		}
		this._id = new Uint8Array(12)
		this._id.set(random(12))
	}

	toString() {
		return `ObjectId('${[...this._id].map(v => v.toString(16)).join('').toUpperCase()}')`;
	}
}
