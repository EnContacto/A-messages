const { dynamoDB, s3 } = require("../config/awsConfig");

module.exports.deletePost = async (postId) => {
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";

  try {
    // Fetch existing post to get image URL
    const existingPost = await dynamoDB.get({
      TableName: tableName,
      Key: { id: postId },
    }).promise();

    if (!existingPost.Item) {
      throw new Error("Post not found");
    }

    // Delete the image from S3 if it exists
    if (existingPost.Item.imageUrl) {
      const imageKey = existingPost.Item.imageUrl.split("/").pop();
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET || "distribuidabucketsocial",
        Key: imageKey,
      }).promise();
    }

    // Delete the post from DynamoDB
    await dynamoDB.delete({
      TableName: tableName,
      Key: { id: postId },
    }).promise();

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Internal server error");
  }
};
