/* global suite, test */
import { Slot, resolveSlots } from "../../src/slots";
import { renderToString } from "../../src/render";
import { transformCode } from "./util";
import vm from "vm";
import { strictEqual as assertSame } from "assert";

suite("slots", __filename);

test("named slots", async () => {
	let code = `
function Card(_, ...children) {
	let slots = resolveSlots(children);
	return <div class="card">
		{slots.get("header")}
		{slots.unnamed}
		<pre>{slots.names().join(", ")}</pre>
		{slots.get("footer")}
	</div>;
}

<Card>
	<Slot name="header">
		<h1>Hello World</h1>
	</Slot>

	<Slot name="footer">
		<footer>…</footer>
	</Slot>

	<p>lorem ipsum dolor sit amet</p>
</Card>
	`;

	let js = transformCode(code, null, __filename);
	let context = { Slot, resolveSlots };
	let segments = vm.runInNewContext(js, context);

	let html = renderToString(...segments);
	assertSame(html.replace(/\n|\t/g, ""), // eslint-disable-next-line max-len
			'<div class="card"><h1>Hello World</h1><p>lorem ipsum dolor sit amet</p><pre>header, footer</pre><footer>…</footer></div>');
});
