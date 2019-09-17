/* global test */
import { makeSuite } from "./util";

let { assertAST } = makeSuite("JSX", __filename);

test("empty element", () => {
	assertAST("<div></div>", "empty element");
	assertAST("<div />", "empty element");
	assertAST("<div/>", "empty element");
});

test("nested element", () => {
	assertAST(`<article>
	<h3>hello world</h3>
</article>`, "nested element");

	assertAST(`<section>
	<ul />
</section>`, "nested self-closing tag");
});

test("parameters", () => {
	assertAST('<span class="dummy"></span>', "parameter");
	assertAST('<span class="dummy" />', "parameter");
	// eslint-disable-next-line no-template-curly-in-string
	assertAST('<span id={`item${4 * 8}`} class="dummy"></span>', "complex parameters");
	assertAST('<span class="dummy" {...params}></span>', "spread parameters");
});

test("simple expression", () => {
	assertAST("<h1>{title}</h1>", "simple expression");
});

test("scoped expression", () => {
	assertAST(`<ul>
	{items.map(item => (
		<li>{item}</li>
	))}
</ul>`, "scoped expression");
});

test("fragments", () => {
	assertAST("<Fragment>lorem ipsum</Fragment>", "fragment");
	assertAST("<>lorem ipsum</>", "fragment");
	assertAST(`<ul>
	<>
		<li>foo</li>
		<li>bar</li>
	</>
	<Fragment>
		<li>lorem ipsum</li>
		<li>dolor <em>sit</em> amet</li>
	</Fragment>
</ul>`, "nested fragments");
});

/* eslint-disable */
void function() { // expectations scope

// EXPECTED: empty element
[{ _html: "<div></div>" }];

// EXPECTED: nested element
[{ _html: "<article>\n\t<h3>hello world</h3>\n</article>" }];

// EXPECTED: nested self-closing tag
[{ _html: "<section>\n\t<ul></ul>\n</section>" }];

// EXPECTED: parameter
[{ _html: "<span class=\"dummy\"></span>" }];

// EXPECTED: complex parameters
[
	{ _html: "<span id=" },
	`item${ 4 * 8 }`,
	{ _html: " class=\"dummy\"></span>" }
];

// EXPECTED: spread parameters
[
	{ _html: "<span class=\"dummy\" " },
	params,
	{ _html: "></span>" }
];

// EXPECTED: simple expression
[
	{ _html: "<h1>" },
	title,
	{ _html: "</h1>" }
];

// EXPECTED: scoped expression
[
	{ _html: "<ul>\n\t" },
	items.map(item => [
		{ _html: "<li>" },
		item,
		{ _html: "</li>" }
	]),
	{ _html: "\n</ul>" }
];

// EXPECTED: fragment
[{ _html: "lorem ipsum" }];

// EXPECTED: nested fragments
[{ _html: "<ul>\n\t\n\t\t<li>foo</li>\n\t\t<li>bar</li>\n\t\n\t\n\t\t<li>lorem ipsum</li>\n\t\t<li>dolor <em>sit</em> amet</li>\n\t\n</ul>" }];

}
