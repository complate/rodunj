/* global suite, before */
import extractExpectations from "./extractor";
import transform from "../../../src/transform";
import { reportError } from "../../../src/util";
import { Parser } from "acorn";
import jsx from "acorn-jsx";
import { strictEqual as assertSame } from "assert";

let JSXParser = Parser.extend(jsx());

export function makeSuite(title, filepath) {
	suite(title);

	let EXPECTED;
	before(async () => {
		EXPECTED = await extractExpectations(filepath);
	});

	let _transform = (jsx, options) => transformCode(jsx, options, filepath);
	return {
		assertAST(jsx, snippet, options) {
			let actual = _transform(jsx, options);
			assertSame(actual, EXPECTED.get(snippet));
		},
		transform: _transform
	};
}

export function transformCode(jsx, options, filepath) {
	try {
		var ast = JSXParser.parse(jsx); // eslint-disable-line no-var
	} catch(err) {
		reportError(err, filepath);
	}
	return transform(ast, options || undefined);
}
