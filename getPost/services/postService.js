const { dynamoDB } = require("../config/awsConfig");

module.exports.getPosts = async () => {
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";

  try {
    const result = await dynamoDB.client.scan({ TableName: tableName }).promise();
    return result.Items || [];
  } catch (error) {
    console.error("Error retrieving posts:", error);
    throw new Error("Internal server error");
  }
};
