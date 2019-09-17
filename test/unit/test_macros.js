/* global test */
import { makeSuite } from "./util";

let { assertAST } = makeSuite("macros", __filename);

test("macro", () => {
	assertAST("<Card title={title} />", "macro");
	assertAST('<Card id={16 * 8} {...params} title="Hello World" inert />',
			"macro with complex parameters");
	assertAST(`<Card>
	<p>lipsum</p>
</Card>`, "macro with children");
});

test("macro internals", () => {
	// XXX: never evaluated, thus recursion isn't actually being tested here
	assertAST(`
function Recursivitis({ depth = 0 }) {
	if(depth === 3) {
		return null;
	}
	return <div>
		<Recursivitis depth={depth} />
	</div>;
}

<Recursivitis />`, "recursion");
});

/* eslint-disable */
void function() { // expectations scope

// EXPECTED: macro
[Card({ title: title })];

// EXPECTED: macro with complex parameters
[Card({
		id: 16 * 8,
		...params,
		title: "Hello World",
		inert: true
	})];

// EXPECTED: macro with children
[Card({}, { _html: "\n\t<p>lipsum</p>\n" })];

// EXPECTED: recursion
function Recursivitis({
	depth = 0
}) {
	if (depth === 3) {
		return null;
	}
	return [
		{ _html: "<div>\n\t\t" },
		Recursivitis({ depth: depth }),
		{ _html: "\n\t</div>" }
	];
}
[Recursivitis({})];

}
