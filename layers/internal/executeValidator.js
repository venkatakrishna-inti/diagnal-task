const base = require("./validatorBase");

module.exports = async function(req, res, next, schema) {
	let validate = base(schema, req.body);

	if (validate.valid) {
		next();
	} else {
		return res.status(422).send(validate.errors);
	}
};
