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

export default Glossary;
