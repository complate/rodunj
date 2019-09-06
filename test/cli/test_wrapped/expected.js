function Glossary({ term }, ...definitions) {
	return ["<dl class=\"glossary\">", "\n\t\t", "<dt>", term, "</dt>", "\n\t\t", definitions.map(desc => (
		"<dd>", desc, "</dd>"
	)), "\n\t", "</dl>"];
}

var index = ["<body>", "\n\t", "<h1>", "Hello World", "</h1>", "\n\t", Glossary({ term: "foo" }, "bar"), "</body>"];

export default index;
