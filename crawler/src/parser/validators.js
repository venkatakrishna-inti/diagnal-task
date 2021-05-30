const Joi = require("@hapi/joi");
const { executeValidator } = require("diagnal-internal");

var parser = Joi.object({
	url: Joi.string()
		.required()
		.uri()
});

module.exports = function(identifier, req, res, next) {
	let schema = eval(identifier);
	return executeValidator(req, res, next, schema);
};
