// cf. https://www.w3.org/TR/html5/syntax.html#void-elements
// XXX: only needed in compilation step ⇒ module relies on tree shaking
export let VOID_ELEMENTS = new Set([
	"area", "base", "br", "col", "embed", "hr", "img", "input", "keygen",
	"link", "meta", "param", "source", "track", "wbr"
]);

// adapted from TiddlyWiki <http://tiddlywiki.com> and Python 3's `html` module
export function htmlEncode(str, attribute) {
	let res = str.replace(/&/g, "&amp;").
		replace(/</g, "&lt;").
		replace(/>/g, "&gt;");
	if(attribute) {
		res = res.replace(/"/g, "&quot;").
			replace(/'/g, "&#x27;");
	}
	return res;
}
