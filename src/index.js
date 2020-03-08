import transform from "./transform";
import { reportError } from "./util";
import { createFilter } from "rollup-pluginutils";

let filter = createFilter(/\.jsx$/); // XXX: inelegant

export default {
	name: "rodunj",
	transform(code, id) {
		if(!filter(id)) {
			return;
		}

		try {
			var ast = this.parse(code); // eslint-disable-line no-var
		} catch(err) {
			reportError(err, id);
		}
		return transform(ast);
	}
};
