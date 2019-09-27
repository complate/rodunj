import { htmlEncode } from "./html";
import BufferedStream from "./buffered_stream";

export function renderHTML(stream, ...elements) {
	for(let i = 0; i < elements.length; i++) {
		let el = elements[i];

		if(el === false || el === null || el === undefined) {
			continue;
		}

		if(el.pop) {
			renderHTML(stream, ...el);
			continue;
		}

		let raw = el._html;
		raw = (raw && Object.keys(el).length === 1) ? raw : htmlEncode(el);
		stream.write(raw);
	}
}

// XXX: rarely used ⇒ module relies on tree shaking
export function renderToString(...elements) { // TODO: rename
	let stream = new BufferedStream();
	renderHTML(stream, ...elements);
	return stream.read();
}
