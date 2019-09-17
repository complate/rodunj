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

var index = [
	{ _html: "<body>\n\t<h1>Hello World</h1>\n\t" },
	Glossary({ term: "foo" }, { _html: "bar" }),
	{ _html: "\n</body>" }
];

export default index;
