const AWS = require("aws-sdk");

const dynamoDB = {
  client: new AWS.DynamoDB.DocumentClient(),
  tableName: process.env.DYNAMODB_TABLE || "PostsTable",
};

module.exports = { dynamoDB };
