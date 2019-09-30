/* global test */
import { makeSuite } from "./util";
import { throws as assertThrows } from "assert";

let { assertAST, transform } = makeSuite("HTML", __filename);

test("void elements", () => {
	assertAST("<input />", "void element");
	assertAST("<input></input>", "void element");
	assertAST('<meta charset="utf-8" />', "attribute in void element");
	assertThrows(() => transform("<input> </input>"),
			/void elements must not have children: `<input>`/);
	assertThrows(() => transform("<meta><span /></meta>"),
			/void elements must not have children: `<meta>`/);
});

test("attributes", () => {
	assertAST('<article data-title="Hello World" data-author={author} />',
			"hyphenated attributes");
	assertAST("<input disabled={false} hidden={null} readonly={undefined} required />",
			"boolean and blank attributes");
});

test("HTML encoding", () => {
	assertAST("<p>lorem & ipsum</p>", "HTML encoding");
	assertAST(`<div id="don't">foo -> bar</div>`, // eslint-disable-line quotes
			"HTML attribute encoding");
});

/* eslint-disable */
void function() { // expectations scope

// EXPECTED: void element
[{ _html: "<input>" }];

// EXPECTED: attribute in void element
[{ _html: "<meta charset=\"utf-8\">" }];

// EXPECTED: hyphenated attributes
[
	{ _html: "<article data-title=\"Hello World\" " },
	{ _attr: { "data-author": author } },
	{ _html: "></article>" }
];

// EXPECTED: boolean and blank attributes
[
	{ _html: "<input " },
	{ _attr: { disabled: false } },
	{ _html: " " },
	{ _attr: { hidden: null } },
	{ _html: " " },
	{ _attr: { readonly: undefined } },
	{ _html: " required>" }
];

// EXPECTED: HTML encoding
[{ _html: "<p>lorem &amp; ipsum</p>" }];

// EXPECTED: HTML attribute encoding
[{ _html: "<div id=\"don&#x27;t\">foo -&gt; bar</div>" }];

}
