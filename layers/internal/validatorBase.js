const _ = require("lodash");

function base(schema, input) {
  const { error, value } = schema.validate(input, { abortEarly: false });

  if (_.isUndefined(error)) {
    return {
      valid: true
    };
  } else {
    var response = {
      message: `Validation failed. ${error.details.length} error(s)`
    };

    let errors = {};

    error.details.map(d => {
      let field = "";

      if (d.type == "object.with") {
        field = d.context.peer;
      } else {
        field = d.context.key;
      }

      let message = d.context.mainWithLabel
        ? d.context.mainWithLabel
        : d.context.label;

      errors[field] = message;

      return field;
    });

    response["errors"] = errors;

    return {
      valid: false,
      errors: response
    };
  }
}

module.exports = base;
