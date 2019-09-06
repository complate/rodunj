import transform from "./transform";
import { reportError } from "./util";
import { createFilter } from "rollup-pluginutils";

let filter = createFilter(/\.jsx$/); // XXX: inelegant

export default {
	name: "rodunj",
	transform(code, id) {
		if(!filter(id)) {
			console.error("📄 skipping", id); // XXX: DEBUG
			return;
		}
		console.error("📄 checking", id); // XXX: DEBUG

		try {
			var ast = this.parse(code); // eslint-disable-line no-var
		} catch(err) {
			reportError(err, id);
		}
		return {
			code: transform(code, ast),
			ast
		};
	}
};
