/* global suite, test */
import { renderToString } from "../../src/render";
import { strictEqual as assertSame } from "assert";

suite("rendering", __filename);

test("HTML elements", () => {
	let segments = [
		{ _html: '<meta charset="utf-8">\n\t<p>\n\t\t' },
		false,
		"lörem ipßüm <do&or> sit ämet",
		null,
		undefined,
		{ _html: "\n\t</p>" }
	];
	assertSame(renderToString(...segments), `<meta charset="utf-8">
	<p>
		lörem ipßüm &lt;do&amp;or&gt; sit ämet
	</p>`);

	segments = [
		{ _html: "<ul>\n\t" },
		["foo", "bar & baz"].map(item => [
			{ _html: "<li>" },
			item,
			{ _html: "</li>" }
		]),
		{ _html: "\n</ul>" }
	];
	assertSame(renderToString(...segments), `<ul>
	<li>foo</li><li>bar &amp; baz</li>
</ul>`);
});

test("macros", () => {
	let List = ({ entries, selected }) => [
		{ _html: "<ul>" },
		entries.map(id => [
			{ _html: "<li>" },
			id === selected.id ? [
				{ _html: "<mark>" },
				id,
				{ _html: "</mark>" }
			] : id,
			{ _html: "</li>" }
		]),
		{ _html: "</ul>" }
	];

	let segments = [List({
		entries: [123, 456],
		selected: { id: 123 }
	})];
	assertSame(renderToString(...segments),
			"<ul><li><mark>123</mark></li><li>456</li></ul>");
});

test("recursive macros", () => {
	function Recursivitis({ depth = 0 }) {
		if(depth === 3) {
			return "EOR";
		}
		depth++;
		return [
			{ _html: "<div>\n\t\t" },
			Recursivitis({ depth: depth }),
			{ _html: "\n\t</div>" }
		];
	}

	let segments = [Recursivitis({})];
	assertSame(renderToString(...segments), `<div>
		<div>
		<div>
		EOR
	</div>
	</div>
	</div>`);
});

test("HTML attributes", () => {
	let segments = [
		{ _html: "<span " },
		{ _attr: { id: 32 } },
		{ _html: " class=\"dummy\"></span>" }
	];
	assertSame(renderToString(...segments),
			'<span  id="32" class="dummy"></span>');

	segments = [
		{ _html: "<span " },
		{ _attr: { id: null } },
		{ _html: "></span>" }
	];
	assertSame(renderToString(...segments), "<span ></span>");

	let params = {
		foo: `lörem'ipßüm <do&or> sit"ämet`, // eslint-disable-line quotes
		bar: 123
	};
	segments = [
		{ _html: "<span " },
		{ _attribs: params },
		{ _html: "></span>" }
	];
	assertSame(renderToString(...segments), // eslint-disable-next-line
			`<span  foo="lörem&#x27;ipßüm &lt;do&amp;or&gt; sit&quot;ämet" bar="123"></span>`);

	segments = [
		{ _html: "<span class=\"dummy\" " },
		{ _attribs: params },
		{ _html: "></span>" }
	];
	assertSame(renderToString(...segments), // eslint-disable-next-line
			`<span class="dummy"  foo="lörem&#x27;ipßüm &lt;do&amp;or&gt; sit&quot;ämet" bar="123"></span>`);

	params = {
		disabled: false,
		required: true,
		hidden: null,
		readonly: undefined
	};
	segments = [
		{ _html: "<input " },
		{ _attribs: params },
		{ _html: ">" }
	];
	assertSame(renderToString(...segments), "<input  required>");
});

test("document-type declaration", () => {
	let DOCTYPE = "<!DOCTYPE html>";
	let Document = (_, ...children) => [
		{ _html: DOCTYPE },
		children
	];
	let List = () => [{ _html: "<ul></ul>" }];
	let segments = [
		Document({},
				{ _html: "\n\t<body>\n\t\t<h1>Hello World</h1>\n\t\t" },
				List(),
				{ _html: "\n\t</body>\n" })
	];
	assertSame(renderToString(...segments), `<!DOCTYPE html>
	<body>
		<h1>Hello World</h1>
		<ul></ul>
	</body>\n`);
});
