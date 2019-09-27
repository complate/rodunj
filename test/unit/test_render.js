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

test.skip("HTML attributes", () => {
});
