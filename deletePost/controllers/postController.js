const { dynamoDB, s3 } = require("../config/awsConfig");

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";

  try {
    // Retrieve post to get the image URL
    const result = await dynamoDB.get({
      TableName: tableName,
      Key: { id },
    }).promise();

    if (!result.Item) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { imageUrl } = result.Item;

    // Delete post from DynamoDB
    await dynamoDB.delete({
      TableName: tableName,
      Key: { id },
    }).promise();

    // Delete image from S3 (if it exists)
    if (imageUrl) {
      const bucketName = process.env.S3_BUCKET || "distribuidabucketsocial";
      const key = imageUrl.split("/").pop();

      await s3.deleteObject({
        Bucket: bucketName,
        Key: key,
      }).promise();
    }

    res.status(200).json({ message: "Post deleted successfully" });

  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
