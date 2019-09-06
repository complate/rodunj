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

function verify(code, { test }) {
	let ast = parse(code, __filename);
	assertSame(transform(code, ast), EXPECTED.get(test.title));
}

/* eslint-disable */
void function() { // expectations scope

// EXPECTED: empty element
["<div>", "</div>"]

// EXPECTED: self-closing tag
["<div></div>"]

// EXPECTED: nested element
["<article>", "\n\t", "<h3>", "hello world", "</h3>", "\n", "</article>"]

// EXPECTED: nested self-closing tag
["<section>", "\n\t", "<ul></ul>", "\n", "</section>"]

// EXPECTED: HTML encoding
["<p>", "lorem &amp; ipsum", "</p>"]

// EXPECTED: simple expression
["<h1>", title, "</h1>"]

// EXPECTED: scoped expression
["<ul>", "\n\t", items.map(item => (
		["<li>", item, "</li>"]
	)), "\n", "</ul>"]

}
