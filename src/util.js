// friendly error reporting for users
export function reportError(err, context) {
	if(err.name !== "SyntaxError") {
		throw err;
	}
	// the original stack trace is more confusing than helpful here
	if(context.call) {
		context = context();
	}
	throw new SyntaxError(`${err.message} in \`${context}\``);
}
