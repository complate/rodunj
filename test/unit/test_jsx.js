/* global test */
import { makeSuite } from "./util";

let { assertAST } = makeSuite("JSX", __filename);

test("empty element", () => {
	assertAST("<div></div>", "empty element");
	assertAST("<div />", "empty element");
	assertAST("<div/>", "empty element");
});

test("nested elements", () => {
	assertAST(`<article>
	<header {...attribs}>
		<h3>hello world</h3>
	</header>
</article>`, "nested elements");

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

test("dynamic element tags", () => {
	assertAST(`
let $Heading = "h" + headingLevel;

<$Heading>{title}</$Heading>`, "dynamic heading level");
	assertAST(`
let $List = ordered ? "ol" : "ul";

<$List />`, "dynamic list type");
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

test("whitespace", () => {
	assertAST(`
<>
	<__UnsafeRaw html="<!DOCTYPE html>" />
	<html lang={lang}>
		<head>
			<meta charset="utf-8" />
			<title>{title}</title>
		</head>
		<body>
			<h1>
				{title} | My Site
			</h1>
			<p>lorem <b>ipsum</b> dolor <i>sit</i> amet</p>

			<p>consectetur {txt} elit</p>
			{children}
			<ul>
				<li>foo</li>
				<li>bar etc.</li>
			</ul>
			{" "}
			<pre>
				10 PRINT "Hello, World!"
				20 END
			</pre>
		</body>
	</html>
</>
	`, "whitespace");
});

/* eslint-disable */
void function() { // expectations scope

// EXPECTED: empty element
[{ _html: "<div></div>" }];

// EXPECTED: nested elements
[
	{ _html: "<article><header " },
	{ _attribs: attribs },
	{ _html: "><h3>hello world</h3></header></article>" }
];

// EXPECTED: nested self-closing tag
[{ _html: "<section><ul></ul></section>" }];

// EXPECTED: parameter
[{ _html: "<span class=\"dummy\"></span>" }];

// EXPECTED: complex parameters
[
	{ _html: "<span " },
	{ _attr: { id: `item${ 4 * 8 }` } },
	{ _html: " class=\"dummy\"></span>" }
];

// EXPECTED: spread parameters
[
	{ _html: "<span class=\"dummy\" " },
	{ _attribs: params },
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
	{ _html: "<ul>" },
	items.map(item => [
		{ _html: "<li>" },
		item,
		{ _html: "</li>" }
	]),
	{ _html: "</ul>" }
];

// EXPECTED: dynamic heading level
let $Heading = "h" + headingLevel;
[
	{ _html: "<" },
	$Heading,
	{ _html: ">" },
	title,
	{ _html: "</" },
	$Heading,
	{ _html: ">" }
];

// EXPECTED: dynamic list type
let $List = ordered ? "ol" : "ul";
[
	{ _html: "<" },
	$List,
	{ _html: "></" },
	$List,
	{ _html: ">" }
];

// EXPECTED: fragment
[{ _html: "lorem ipsum" }];

// EXPECTED: nested fragments
[{ _html: "<ul><li>foo</li><li>bar</li><li>lorem ipsum</li><li>dolor <em>sit</em> amet</li></ul>" }];

// EXPECTED: whitespace
[
	{ _html: "<!DOCTYPE html><html " },
	{ _attr: { lang: lang } },
	{ _html: "><head><meta charset=\"utf-8\"><title>" },
	title,
	{ _html: "</title></head><body><h1>" },
	title,
	{ _html: " | My Site</h1><p>lorem <b>ipsum</b> dolor <i>sit</i> amet</p><p>consectetur " },
	txt,
	{ _html: " elit</p>" },
	children,
	{ _html: "<ul><li>foo</li><li>bar etc.</li></ul>" },
	" ",
	{ _html: "<pre>10 PRINT \"Hello, World!\" 20 END</pre></body></html>" }
];

}
