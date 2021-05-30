const AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

let ScanBuilder = class {
  constructor(table, schema) {
    this.table = table;
    this.schema = schema;
    this.params = {};
    this.ExpressionAttributeNames = {};
    this.ExpressionAttributeValues = {};
    this.filters = [];
    this.count = 1;
  }

  addLimit(limit) {
    this.params["Limit"] = limit;
  }

  addExclusiveStartKey(ExclusiveStartKey) {
    this.params["ExclusiveStartKey"] = ExclusiveStartKey;
  }

  addExpressions(key, value, counter) {
    this.ExpressionAttributeNames[`#${key}${counter}`] = key;
    this.ExpressionAttributeValues[`:${key}${counter}`] = {};

    this.ExpressionAttributeValues[`:${key}${counter}`][
      this.schema[key]
    ] = value;
  }

  where(key, value, ops) {
    let counter = this.count++;

    this.addExpressions(key, value, counter);

    switch (ops) {
      case "contains":
        this.filters.push(`contains(#${key}${counter},:${key}${counter})`);
        break;

      case "equals":
        this.filters.push(`#${key}${counter} = :${key}${counter}`);
        break;

      default:
        break;
    }
  }

  build(connector) {
    let localParams = {
      TableName: this.table,
      ...this.params
    };

    if (Object.keys(this.ExpressionAttributeNames).length) {
      localParams["ExpressionAttributeNames"] = this.ExpressionAttributeNames;
    }

    if (Object.keys(this.ExpressionAttributeValues).length) {
      localParams["ExpressionAttributeValues"] = this.ExpressionAttributeValues;
    }

    if (this.filters.length) {
      localParams["FilterExpression"] = this.filters.join(
        " " + connector + " "
      );
    }

    return localParams;
  }

  scan(params) {
    return dynamodb
      .scan(params)
      .promise()
      .then(r => {
        let items = r.Items;

        // console.log("scanItems", r.Items);

        items = items.map(i => {
          let item = {};

          for (const property in i) {
            item[property] = i[property][this.schema[property]];
          }

          return item;
        });

        r["Items"] = items;
        return r;
      })
      .catch(error => {
        console.log("error", error);
        throw new Error(
          JSON.stringify({
            message: error.message,
            code: error.code
          })
        );
      });
  }
};

module.exports = {
  ScanBuilder
};
