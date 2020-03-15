let PROP = "__slot";
let PREFIX = "____";

export function Slot({ name }, ...children) {
	return {
		[PROP]: name, // XXX: crude
		children
	};
}

export function determineSlots(children) {
	let slots = {}; // poor man's `Map`
	children = children.filter(child => {
		let name = child[PROP];
		if(name && name.substr) {
			slots[PREFIX + name] = child.children;
			return false;
		}
		return true;
	});
	return {
		unnamed: children,
		names: () => Object.keys(slots).map(name => name.substr(PREFIX.length)),
		get: name => slots[PREFIX + name]
	};
}
