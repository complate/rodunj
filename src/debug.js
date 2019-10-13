export function inspect(prefix, ...nodes) {
	nodes = nodes.map(simplify);
	console.error(prefix, ...nodes);
}

function simplify(node) {
	switch(node.type) {
	case "Identifier":
		return `[$]${node.name}`;
	case "Literal":
		return `["]${node.value}`;
	case "ObjectExpression": // eslint-disable-next-line no-var
		var res = node.properties.map(({ key, value }) => ({
			key: simplify(key),
			value: simplify(value)
		}));
		return res.length === 1 ? res[0] : res;
	case "ArrayExpression":
		return node.elements.map(node => simplify(node));
	case "CallExpression":
		return `[@]${node.callee.name}(${node.arguments})`;
	}
	return node;
}
