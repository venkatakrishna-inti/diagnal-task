const ApifyClient = require("apify-client");
const { ScanBuilder } = require("../../DDB/index");
const crawlerSchema = require("../../DDB/crawler");
const AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports = async requestBody => {
  try {
    const DDBdata = await getDDBCrawlerData(requestBody.url);

    console.log("DDBdataDDBdata", DDBdata);

    if (DDBdata.count) {
      return DDBdata.Items[0];
    }

    const client = new ApifyClient({
      token: process.env.APIFY_KEY
    });

    let response = {
      title: null,
      description: null,
      images: []
    };

    const run = await client
      .actor("jancurn/extract-metadata")
      .call(requestBody);

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    items.forEach(item => {
      if (!response.title) response.title = item.title;
      if (!response.description && item.meta.description)
        response.description = item.meta.description;
      if (item.meta["og:image"]) response.images.push(item.meta["og:image"]);
    });

    await saveToDDB({ url: requestBody.url, data: JSON.stringify(response) });

    return response;
  } catch (e) {
    throw new Error(
      JSON.stringify({
        message: e.message,
        code: 501
      })
    );
  }
};

const getDDBCrawlerData = async url => {
  let query = new ScanBuilder(process.env.CRAWLERS_TABLE, crawlerSchema);

  if (url) {
    query.where("url", url, "equals");
  } else {
    throw new Error(
      JSON.stringify({
        message: `URL not defined`,
        code: "501"
      })
    );
  }

  let params = query.build("and");

  return query.scan(params);
};

const saveToDDB = payload => {
  var d1 = new Date(),
    d2 = new Date(d1);
  d2.setMinutes(d1.getMinutes() + 1);

  payload.ExpirationTime = Math.floor(d1.getTime() / 1000);

  var itemParams = {
    TableName: process.env.CRAWLERS_TABLE,
    Item: payload
  };

  return docClient
    .put(itemParams)
    .promise()
    .then(async r => {
      return r;
    })
    .catch(error => {
      throw new Error(
        JSON.stringify({
          message: error.message,
          code: error.code
        })
      );
    });
};
