const serverless = require("serverless-http");
const {
  expressApp: app,
  executeFunction,
  executeFunctionForResult
} = require("diagnal-internal");
const _ = require("lodash");
const validateRequest = require("./validators");

app.post("/", [
  validateRequest.bind(this, "parser"),
  (req, res) => {
    return executeFunction(req, res, require("./functions/parser"), [req.body]);
  }
]);

module.exports.handler = serverless(app, {
  basePath: "/parser",
  request: function(req, event, context) {
    req.lambdaEvent = event;

    req.lambdaEvent.mappedHeaders = _.transform(
      req.lambdaEvent.headers,
      function(result, val, key) {
        result[key.toLowerCase()] = val;
      }
    );

    req.lambdaContext = context;
  }
});
