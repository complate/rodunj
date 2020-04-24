import { Bundle as _Bundle, Config } from "beatdown";
import { Plugin } from "beatdown/lib/config/plugin";
import rodunj from "rodunj";
import acornJSX from "acorn-jsx";

module.exports = {
	key: "complate",
	bucket: "scripts",
	plugin: (config, { writeFile, resolvePath }, options) => {
		config.map(bundleConfig => {
			let { source, target, ...config } = bundleConfig;
			source = resolvePath(source, { enforceRelative: true });
			target = resolvePath(target, { enforceRelative: true });
			let bundle = new Bundle(source, config); // TODO: Browserslist support

			return filepaths => bundle.match(filepaths) ?
				bundle.compile(). // TODO: error handling, fingerprinting, bundle-size warning
					then(code => writeFile(target, code)) :
				Promise.resolve(null);
		});
	}
};

class Bundle extends _Bundle {
	constructor(entryPoint, config) {
		this.modules = new Set([entryPoint]); // XXX: awkward?

		config = new Config(entryPoint, {
			...config,
			parser: acornJSX()
		});
		config.addPlugin(new Plugin("complate-rodunj", rodunj));
		super(config);
	}

	compile() {
		return super.compile(this.entryPoint).
			then(res => {
				this.modules = collectModulePaths(this._modules);
			});
	}

	match(filepaths) {
		let { modules } = this;
		return filepaths.some(fp => modules.has(fp));
	}
}

function collectModulePaths(modules) {
	return Object.keys(modules).reduce((memo, id) => {
		// skip plugin helper modules (`\0` prefix is a Rollup convention)
		return /\0/.test(id) ? memo : memo.add(id);
	}, new Set());
}
