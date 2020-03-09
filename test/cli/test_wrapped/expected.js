function Glossary({term}, ...definitions) {
	return [
		{ _html: "<dl class=\"glossary\">\n\t\t<dt>" },
		term,
		{ _html: "</dt>\n\t\t" },
		definitions.map(desc => [
			{ _html: "<dd>" },
			desc,
			{ _html: "</dd>" }
		]),
		{ _html: "\n\t</dl>" }
	];
}

function Document(_, ...children) {
	return [
		{ _html: "<!DOCTYPE html>" },
		children
	];
}
var index = [Document({}, { _html: "\n\t<body>\n\t\t<h1>Hello World</h1>\n\t\t" }, Glossary({ term: "foo" }, { _html: "bar" }), { _html: "\n\t</body>\n" })];

export default index;
