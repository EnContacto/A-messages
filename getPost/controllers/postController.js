const { dynamoDB } = require("../config/awsConfig");

module.exports.getPostById = async (req, res) => {
  const { id } = req.params;
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";

  try {
    const result = await dynamoDB.client.get({
      TableName: tableName,
      Key: { id },
    }).promise();

    if (!result.Item) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(result.Item);

  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getAllPosts = async (req, res) => {
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";

  try {
    const result = await dynamoDB.client.scan({
      TableName: tableName,
    }).promise();

    res.status(200).json(result.Items);

  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
