// adapted from Babel (MIT License)
// eslint-disable-next-line max-len
// https://github.com/babel/babel/blob/8270903ba25cd6a822c9c1ffc5ba96ec7b93076b/packages/babel-types/src/utils/react/cleanJSXElementLiteralChild.js
export default function normalizeWhitespace(txt) {
	let lines = txt.split(/\r\n|\n|\r/);

	let lastNonEmptyLine = 0;
	for(let i = 0; i < lines.length; i++) {
		if(lines[i].match(/[^ \t]/)) {
			lastNonEmptyLine = i;
		}
	}

	let str = "";
	for(let i = 0; i < lines.length; i++) {
		let line = lines[i];

		let isFirstLine = i === 0;
		let isLastLine = i === lines.length - 1;
		let isLastNonEmptyLine = i === lastNonEmptyLine;

		// replace rendered whitespace tabs with spaces
		let trimmedLine = line.replace(/\t/g, " ");

		// trim whitespace touching a newline
		if(!isFirstLine) {
			trimmedLine = trimmedLine.replace(/^[ ]+/, "");
		}

		// trim whitespace touching an endline
		if(!isLastLine) {
			trimmedLine = trimmedLine.replace(/[ ]+$/, "");
		}

		if(trimmedLine) {
			if(!isLastNonEmptyLine) {
				trimmedLine += " ";
			}
			str += trimmedLine;
		}
	}
	return str;
}
