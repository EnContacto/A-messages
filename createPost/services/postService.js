const { v4: uuidv4 } = require("uuid");
const { dynamoDB, s3 } = require("../config/awsConfig");

module.exports.createPost = async ({ user, content, imageUrl }) => {
  const id = uuidv4();
  const timestamp = new Date().toISOString();
  const newPost = { id, user, content, imageUrl, timestamp };

  await dynamoDB.put({ TableName: process.env.DYNAMODB_TABLE || "PostsTable", Item: newPost }).promise();

  return newPost;
};

module.exports.uploadImageToS3 = async (fileBuffer, fileName, mimeType) => {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET || "distribuidabucketsocial",
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType
  };

  const result = await s3.upload(uploadParams).promise();
  return result.Location;
};
