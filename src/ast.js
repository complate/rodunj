export let $spread = name => ({
	type: "SpreadElement",
	argument: {
		type: "Identifier",
		name
	}
});

export let $invocation = (functionName, ...args) => ({
	type: "CallExpression",
	callee: {
		type: "Identifier",
		name: functionName
	},
	arguments: args
});

export let $array = (...elements) => ({
	type: "ArrayExpression",
	elements
});

// `obj` is either a plain object or an array of properties
export let $object = obj => ({
	type: "ObjectExpression",
	properties: Array.isArray(obj) ? obj : Object.entries(obj).
		map(([key, value]) => $property(key, value))
});

export let $property = (key, value) => ({
	type: "Property",
	kind: "init", // XXX: ?
	method: false,
	shorthand: false,
	computed: false,
	key: {
		type: "Identifier",
		name: key
	},
	value
});

export let $literal = value => ({
	type: "Literal",
	value,
	raw: JSON.stringify(value)
});
