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
