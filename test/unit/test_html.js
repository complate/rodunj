/* global suite, test, before */
"use strict";

import transform from "../../src/transform";
import { parse, extractExpectations } from "./util";
import { strictEqual as assertSame } from "assert";

let EXPECTED;

before(async () => {
	EXPECTED = await extractExpectations(__filename);
});

suite("HTML elements");

test("empty element", function() {
	verify("<div></div>", this);
});

test.skip("self-closing tag", function() {
	verify("<div />", this);
	verify("<div/>", this);
});

test("nested element", function() {
	verify(`<article>
	<h3>hello world</h3>
</article>`, this);
});

test("nested self-closing tag", function() {
	verify(`<section>
	<ul />
</section>`, this);
});

test.skip("void elements", function() {
	// TODO:
	// * rendering
	// * validation: children
	// * validation: closing tag
});

test("HTML encoding", function() {
	verify("<p>lorem & ipsum</p>", this);
	// TODO: attributes
});

test("simple expression", function() {
	verify("<h1>{title}</h1>", this);
});

test.skip("scoped expression", function() {
	verify(`<ul>
	{items.map(item => (
		<li>{item}</li>
	))}
</ul>`, this);
});

function verify(code, { test }) {
	let ast = parse(code, __filename);
	assertSame(transform(code, ast), EXPECTED.get(test.title));
}

/* eslint-disable */
void function() { // expectations scope

// EXPECTED: empty element
[raw("<div>"), raw("</div>")]

// EXPECTED: self-closing tag
[raw("<div></div>")]

// EXPECTED: nested element
[raw("<article>"), raw("\n\t"), raw("<h3>"), raw("hello world"), raw("</h3>"), raw("\n"), raw("</article>")]

// EXPECTED: nested self-closing tag
[raw("<section>"), raw("\n\t"), raw("<ul></ul>"), raw("\n"), raw("</section>")]

// EXPECTED: HTML encoding
[raw("<p>"), raw("lorem &amp; ipsum"), raw("</p>")]

// EXPECTED: simple expression
[raw("<h1>"), title, raw("</h1>")]

// EXPECTED: scoped expression
[raw("<ul>"), raw("\n\t"), items.map(item => (
		["<li>", item, "</li>"]
	)), raw("\n"), raw("</ul>")]

}
