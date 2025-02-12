const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { S3Client } = require("@aws-sdk/client-s3");

// Configurar DynamoDB Client
const dynamoDB = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: "us-east-1" })
);

// Configurar S3 Client
const s3 = new S3Client({ region: "us-east-1" });

module.exports = { dynamoDB, s3 };
