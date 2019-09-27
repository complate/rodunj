// pseudo-stream, buffering contents to be consumed afterwards as a single string
export default class BufferedStream {
	constructor() {
		this._buffer = [];
	}

	write(msg) {
		this._buffer.push(msg);
	}

	read() {
		return this._buffer.join("");
	}
}
