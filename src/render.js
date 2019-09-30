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
		if(raw && Object.keys(el).length === 1) { // raw HTML
			stream.write(raw);
			continue;
		}

		let attr = el._attribs;
		if(attr && Object.keys(el).length === 1) { // attributes object
			Object.keys(attr).forEach(key => {
				stream.write(renderAttribute(key, attr[key]));
			});
			continue;
		}

		attr = el._attr;
		if(attr && Object.keys(el).length === 1) { // individual attribute
			let key = Object.keys(attr)[0]; // XXX: awkward
			raw = renderAttribute(key, attr[key]);
		} else { // regular HTML
			raw = htmlEncode(stringify(el));
		}
		stream.write(raw);
	}
}

// XXX: rarely used ⇒ module relies on tree shaking
export function renderToString(...elements) { // TODO: rename
	let stream = new BufferedStream();
	renderHTML(stream, ...elements);
	return stream.read();
}

function renderAttribute(key, value) {
	switch(value) { // boolean or blank attributes
	case false:
	case null:
	case undefined:
		return;
	case true:
		value = null;
		break;
	default:
		value = htmlEncode(stringify(value), true);
	}
	key = htmlEncode(key, true); // XXX: unnecessary?
	// XXX: leading space might be redundant
	return value === null ? ` ${key}` : ` ${key}="${value}"`;
}

function stringify(value) {
	if(typeof value === "number") {
		return value.toString();
	}
	if(!value.substr) {
		throw new Error(`non-stringifiable value: \`${value}\``); // XXX: unhelpful
	}
	return value;
}
