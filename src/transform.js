import { htmlEncode, VOID_ELEMENTS } from "./html";
import { walk } from "estree-walker";
import MagicString from "magic-string";

let visitors = {
	JSXElement,
	JSXOpeningElement,
	JSXClosingElement,
	JSXExpressionContainer,
	JSXText
};

export default function transformAll(code, ast) {
	code = new MagicString(code);
	// traverse each root-level JSX element independently
	walk(ast, {
		enter(node, ...args) {
			if(node.type !== "JSXElement") {
				return;
			}

			transformTree(node, code);
			this.skip();
		}
	});
	return code.toString();
}

function transformTree(root, code) {
	let state = { code };
	walk(root, {
		enter(node, ...args) {
			let handler = visitors[node.type];
			if(handler) {
				handler(state, node, ...args);
			}
		}
	});
}

function JSXElement(state, node, parent) {
	if(parent) {
		node._parent = parent; // XXX: hacky?
	}
}

function JSXOpeningElement(state, node, parent) {
	let tagName = htmlTag(node);
	if(!tagName) {
		return;
	}

	let tag = `<${tagName}>`;
	let isVoid = VOID_ELEMENTS.has(tagName);
	let { children } = node;
	if(children && children.length && isVoid) {
		throw new Error(`void elements must not have children: \`${tag}\``);
	}

	let { selfClosing } = node;
	let code = (selfClosing && !isVoid) ? `${tag}</${tagName}>` : tag;
	code = "raw(" + JSON.stringify(code) + "), ";
	if(isSubtree(parent)) {
		code = "[" + code;
	}
	state.code.overwrite(node.start, node.end, code);
	console.error(tag.padEnd(13));
}

function JSXClosingElement(state, node, parent) {
	let tagName = htmlTag(node);
	if(!tagName) {
		return;
	}

	let tag = `</${tagName}>`;
	let isVoid = VOID_ELEMENTS.has(tagName);
	if(isVoid) {
		throw new Error(`void elements must not have a closing tag: \`${tag}\``);
	}

	let code = "raw(" + JSON.stringify(tag) + ")";
	code += isSubtree(parent) ? "]" : ", ";
	state.code.overwrite(node.start, node.end, code);
	console.error(tag);
}

function JSXExpressionContainer(state, node) {
	let { start, end } = node;
	let { code } = state;
	let sub = code.slice(start, end);
	if(!sub.startsWith("{") || !sub.endsWith("}")) { // XXX: gratuitous paranoia?
		throw new Error(`unrecognized expression \`${sub}\` at ${start}:${end}`);
	}
	// TODO: replace braces with parentheses, to be safe?
	code.remove(start, start + 1).
		overwrite(end - 1, end, ", ");
}

function JSXText(state, node) {
	let txt = htmlEncode(node.value);
	state.code.overwrite(node.start, node.end, "raw(" + JSON.stringify(txt) + "), ");
}

function isSubtree(parent) {
	let grandparent = parent._parent;
	if(grandparent) {
		return grandparent.type !== "JSXElement";
	}
	return true; // root
}

function htmlTag(node) {
	let tagName = node.name.name;
	return /^[a-z]/.test(tagName) && tagName;
}
