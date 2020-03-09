import { htmlEncode, VOID_ELEMENTS } from "./html";
import { $spread, $invocation, $identifier, $array, $object, $property, $literal } from "./ast";
import { generate } from "escodegen"; // TODO: switch to https://github.com/davidbonnet/astring?
import { walk } from "estree-walker";

let RAW = "_html";
let ATTR = "_attr";
let ATTRIBS = "_attribs";

// TODO: configurable
let FORMAT = {
	indent: {
		style: "\t"
	},
	quotes: "double"
};

let VISITORS = {
	JSXElement,
	JSXFragment,
	JSXExpressionContainer,
	JSXText
};

// if `options.nonStaticIDs` is `true`, ID attributes will _not_ be optimized in
// order to allow for runtime verification (e.g. duplicate IDs)
export default function transform(ast, options) {
	let queue = [];
	ast = walk(ast, {
		enter(node, parent) {
			let handler = VISITORS[node.type];
			if(handler) {
				handler.call(this, { queue }, node, parent, options);
			}
		}
	});
	// rewrite queued elements in reverse order
	for(let i = queue.length - 1; i >= 0; i--) {
		let el = queue[i];
		if(el.type === "CallExpression") { // macro invocation
			continue;
		}

		let { openingElement } = el;
		let repl = openingElement === false ? $array(...el.children) : // fragment
			$array(...openingElement, ...el.children, ...el.closingElement);
		rewriteNode(el, repl);
	}

	queue.forEach(node => {
		if(node.type === "ArrayExpression") {
			optimizeAdjacent(node.elements);
		} else { // macro invocation
			let args = node.arguments;
			let children = args.slice(1);
			children = optimizeAdjacent(children);
			node.arguments = args.slice(0, 1).concat(children);
		}
	});
	return generate(ast, { format: FORMAT });
}

function JSXElement(state, node, parent, { nonStaticIDs } = {}) {
	let { openingElement } = node;
	let tag = openingElement.name.name;
	if(tag === "Fragment") {
		JSXFragment(state, node, parent);
		return;
	} else if(tag === "__UnsafeRaw") { // XXX: does not belong here
		let html;
		openingElement.attributes.some(({ name, value }) => {
			if(name.name !== "html") {
				throw new Error(`unsupported \`__UnsafeRaw\` attribute: \`${name.name}\``);
			}

			switch(value.type) {
			case "Literal":
				html = raw(value.value);
				break;
			case "JSXExpressionContainer":
				html = raw(value.expression); // FIXME: this probably results in erronous combination with adjacent `__html` objects
				break;
			default:
				throw new Error(`unsupported \`__UnsafeRaw\` attribute value: \`${value.type}\``);
			}
			return true;
		});
		Object.assign(node, { // XXX: hacky; relies on queue's `JSXFragment` handling
			openingElement: false,
			children: [html]
		});
		state.queue.push(node);
		return;
	}

	let tagName = /^[a-z]/.test(tag) && tag;
	if(!tagName) { // macro or dynamic tag
		if(!tag.startsWith("$")) {
			transformMacro.call(this, { ...state, tag }, node);
			return;
		}

		tagName = tag;
		var dynamicTag = true; // eslint-disable-line no-var
	}

	let { attributes } = openingElement;
	attributes = attributes.flatMap(attr => transformAttribute(attr, nonStaticIDs));

	let startTag = optimizeAdjacent([
		raw("<"),
		dynamicTag ? $identifier(tagName) : raw(tagName),
		...attributes,
		raw(">")
	]);
	let isVoid = VOID_ELEMENTS.has(tagName); // XXX: does not work for dynamic tags
	if(isVoid) {
		let { children } = node;
		if(children && children.length) {
			throw new Error(`void elements must not have children: \`<${tagName}>\``);
		}
		this.replace($array(...startTag));
		return;
	}

	let endTag = dynamicTag ? [raw("</"), $identifier(tagName), raw(">")] :
		[raw(`</${tagName}>`)];
	if(openingElement.selfClosing || node.children.length === 0) {
		let nodes = optimizeAdjacent([...startTag, ...endTag]);
		this.replace($array(...nodes));
		return;
	}

	// queue for rewriting later, otherwise child nodes would never be processed
	// because estree-walker visits them only after `JSXElement`,
	// `JSXOpeningElement` and `JSXClosingElement` have been processed
	// XXX: inefficient, smelly
	Object.assign(node, { // XXX: hacky
		openingElement: startTag,
		closingElement: endTag
	});
	state.queue.push(node);
}

function JSXFragment(state, node, parent) {
	Object.assign(node, { // XXX: hacky
		openingElement: false
	});
	state.queue.push(node);
}

function JSXText(state, node, parent) {
	let txt = htmlEncode(node.value);
	this.replace(raw(txt));
}

function JSXExpressionContainer(state, node, parent) {
	this.replace(node.expression);
}

function transformMacro(state, { openingElement, children }) {
	let params = openingElement.attributes.map(transformMacroParam);
	let { tag } = state;
	if(children.length === 0) {
		this.replace($array($invocation(tag, $object(params))));
	} else {
		let node = $invocation(tag, $object(params), ...children);
		this.replace($array(node));
		state.queue.push(node);
	}
}

// XXX: partially duplicates `transformAttribute`
function transformMacroParam(attr) {
	if(attr.type === "JSXSpreadAttribute") {
		return $spread(attr.argument.name);
	}

	let { name, value } = attr;
	if(!name || name.type !== "JSXIdentifier") { // XXX: should never occur?
		throw new Error(`unexpected parameter: \`${name ? name.type : attr}\``);
	}
	if(value === null) { // boolean parameter
		value = { type: true }; // XXX: hacky
	}

	switch(value.type) {
	case "Literal":
		value = $literal(value.value);
		break;
	case "JSXExpressionContainer":
		value = value.expression;
		break;
	case true: // boolean; see above
		value = $literal(true);
		break;
	default:
		throw new Error(`unexpected attribute value: \`${value.type}\``);
	}
	return $property(name.name, value);
}

function transformAttribute(attr, nonStaticIDs) {
	if(attr.type === "JSXSpreadAttribute") {
		return [raw(" "), dynamicAttribute(attr.argument, true)];
	}

	let { name, value } = attr;
	if(!name || name.type !== "JSXIdentifier") { // XXX: should never occur?
		throw new Error(`unexpected attribute: \`${name ? name.type : attr}\``);
	}

	let key = name.name;
	let prefix = ` ${key}`; // TODO: `htmlEncode`?
	if(value === null) { // boolean attribute
		return [raw(prefix)];
	}

	switch(value.type) {
	case "Literal":
		if(nonStaticIDs && key === "id") {
			return [raw(" "), dynamicAttribute($object({
				[key]: $literal(value.value)
			}))];
		}
		return [raw(`${prefix}="${htmlEncode(value.value, true)}"`)];
	case "JSXExpressionContainer":
		return [raw(" "), dynamicAttribute($object({
			[key]: value.expression
		}))];
	default:
		throw new Error(`unexpected attribute value: \`${value.type}\``);
	}
}

function flatten(arrayExpression) {
	return arrayExpression.elements.reduce((memo, node) => {
		if(node.type !== "ArrayExpression") {
			return memo.concat(node);
		}
		return memo.concat(flatten(node));
	}, []);
}

// optimize by flattening arrays and combining adjacent HTML
// NB: mutates original array and objects within
// XXX: complex and inefficient; should be done directly upon rewriting nodes
// TODO: optimize recurring tokens (notably raw `<`, `</`, `>` and space)
function optimizeAdjacent(nodes) {
	nodes.splice(0, nodes.length, ...flatten({ elements: nodes }));

	for(let i = nodes.length - 1; i > 0; i--) {
		let prev = nodes[i - 1];
		let prevHTML = prev && rawUpdate(prev);
		if(prevHTML === false) {
			continue;
		}

		let curr = nodes[i];
		let currHTML = curr && rawUpdate(curr);
		if(currHTML === false) {
			continue;
		}

		rawUpdate(prev, prevHTML + currHTML);
		rewriteNode(curr, {}); // invalidates references elsewhere -- XXX: hacky
		nodes.splice(i, 1);
	}
	return nodes;
}

// XXX: crude; should use estree-walker's `#replace` instead
function rewriteNode(node, props) {
	Object.keys(node).forEach(key => {
		delete node[key];
	});
	Object.assign(node, props);
}

function dynamicAttribute(expression, multiple) {
	let key = multiple ? ATTRIBS : ATTR;
	return $object({
		[key]: expression
	});
}

function raw(html) {
	return $object({
		[RAW]: $literal(html)
	});
}

function rawUpdate(node, html) { // TODO: rename
	let prop = node.type === "ObjectExpression" && node.properties[0];
	if(!prop || prop.key.name !== RAW) {
		return false;
	}
	if(html === undefined) {
		return prop.value.value;
	}
	prop.value.value = html;
	prop.value.raw = JSON.stringify(html);
	return true;
}
