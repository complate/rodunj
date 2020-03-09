/* global __UnsafeRaw */
import Glossary from "../fixtures/glossary";

export default <>
	<__UnsafeRaw html="<!DOCTYPE html>" />
	<body>
		<h1>Hello World</h1>
		<Glossary term="foo">bar</Glossary>
	</body>
</>;
