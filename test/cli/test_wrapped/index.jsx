/* global __UnsafeRaw */
import Glossary from "../fixtures/glossary";

function Document(_, ...children) {
	// NB: no line breaks to avoid spurious leading whitespace
	return <><__UnsafeRaw html="<!DOCTYPE html>" />{children}</>;
}

export default <Document>
	<body>
		<h1>Hello World</h1>
		<Glossary term="foo">bar</Glossary>
	</body>
</Document>;
