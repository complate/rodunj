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

	let _transform = code => {
		let ast = parse(code, filepath);
		return transform(code, ast);
	};
	return {
		assertAST(code, snippet) {
			assertSame(_transform(code), EXPECTED.get(snippet));
		},
		transform: _transform
	};
}

function parse(code, context) {
	try {
		return JSXParser.parse(code);
	} catch(err) {
		reportError(err, context);
	}
}
