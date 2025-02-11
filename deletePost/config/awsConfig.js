const AWS = require("aws-sdk");

const dynamoDB = {
  client: new AWS.DynamoDB.DocumentClient(),
  tableName: process.env.DYNAMODB_TABLE || "PostsTable",
};

const s3 = {
  client: new AWS.S3(),
  bucketName: process.env.S3_BUCKET || "distribuidabucketsocial",
};

module.exports = { dynamoDB, s3 };
