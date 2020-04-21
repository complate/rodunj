function Glossary({term}, ...definitions) {
	return [
		{ _html: "<dl class=\"glossary\"><dt>" },
		term,
		{ _html: "</dt>" },
		definitions.map(desc => [
			{ _html: "<dd>" },
			desc,
			{ _html: "</dd>" }
		]),
		{ _html: "</dl>" }
	];
}

function Document(_, ...children) {
	return [
		{ _html: "<!DOCTYPE html>" },
		children
	];
}
var index = [Document({}, { _html: "<body><h1>Hello World</h1>" }, Glossary({ term: "foo" }, { _html: "bar" }), { _html: "</body>" })];

export default index;
