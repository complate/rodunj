function Glossary({ term }, ...definitions) {
	return ["<dl class=\"glossary\">", "\n\t\t", "<dt>", term, "</dt>", "\n\t\t", definitions.map(desc => (
		"<dd>", desc, "</dd>"
	)), "\n\t", "</dl>"];
}

export default Glossary;
