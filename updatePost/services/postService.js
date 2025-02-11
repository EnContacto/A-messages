const { dynamoDB, s3 } = require("../config/awsConfig");

module.exports.updatePost = async (postId, newContent, newImage) => {
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";

  try {
    // Fetch existing post
    const existingPost = await dynamoDB.client.get({
      TableName: tableName,
      Key: { id: postId },
    }).promise();

    if (!existingPost.Item) {
      throw new Error("Post not found");
    }

    let updatedImageUrl = existingPost.Item.imageUrl;

    // Upload new image to S3 if provided
    if (newImage) {
      const fileBuffer = newImage.buffer;
      const fileName = `${postId}-${Date.now()}.jpg`;
      const mimeType = newImage.mimetype;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET || "distribuidabucketsocial",
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      };

      const uploadResult = await s3.client.upload(uploadParams).promise();
      updatedImageUrl = uploadResult.Location;
    }

    // Update DynamoDB record
    const updatedPost = {
      ...existingPost.Item,
      content: newContent || existingPost.Item.content,
      imageUrl: updatedImageUrl,
      updatedAt: new Date().toISOString(),
    };

    await dynamoDB.client.put({
      TableName: tableName,
      Item: updatedPost,
    }).promise();

    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Internal server error");
  }
};
