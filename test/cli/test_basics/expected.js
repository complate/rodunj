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

export default Glossary;
