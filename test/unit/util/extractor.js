import fs from "fs";
import readline from "readline";
import { deepStrictEqual as assertDeep } from "assert";

// parses module to retrieve trailing expectation blocks
export default function extractExpectations(filepath) {
	let prefix = "// EXPECTED: ";
	let rl = readline.createInterface({
		input: fs.createReadStream(filepath, "utf8"),
		crlfDelay: Infinity
	});

	let map = new StrictMap();
	let current = {};
	let conclude = () => { // store current block
		let { id } = current;
		if(id) {
			let { lines } = current;
			if(lines[lines.length - 1] === "") { // discard blank line between blocks
				lines.pop();
			}
			map.set(id, lines.join("\n"));
		}
	};

	rl.on("line", line => {
		let { id } = current;
		if(line.startsWith(prefix)) { // new block
			conclude();

			let id = line.substr(prefix.length).trim();
			if(map.has(id)) {
				throw new Error(`duplicate expectation \`${id}\``);
			}
			current = {
				id,
				lines: []
			};
		} else if(id) {
			current.lines.push(line);
		}
	});

	return new Promise((resolve, reject) => {
		rl.on("close", () => {
			let { lines } = current;
			let scopeTerminator = lines.splice(lines.length - 2, 2);
			assertDeep(scopeTerminator, ["", "}"],
					"missing trailing scope terminator `\\n}`");

			conclude();
			resolve(map);
		});
	});
}
class StrictMap extends Map {
	get(key) {
		if(!this.has(key)) {
			throw new Error(`invalid entry \`${key}\``);
		}
		return super.get(key);
	}
}
