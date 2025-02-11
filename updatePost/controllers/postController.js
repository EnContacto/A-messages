const { dynamoDB, s3 } = require("../config/awsConfig");

module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";
  
  try {
    // Fetch the existing post
    const existingPost = await dynamoDB.client.get({
      TableName: tableName,
      Key: { id },
    }).promise();

    if (!existingPost.Item) {
      return res.status(404).json({ error: "Post not found" });
    }

    let updatedImageUrl = existingPost.Item.imageUrl;

    // If a new image is uploaded, replace the existing one in S3
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const fileName = `${id}-${Date.now()}.jpg`;
      const mimeType = req.file.mimetype;

      const uploadParams = {
        Bucket: process.env.S3_BUCKET || "distribuidabucketsocial",
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType
      };

      const uploadResult = await s3.client.upload(uploadParams).promise();
      updatedImageUrl = uploadResult.Location;
    }

    // Update the post in DynamoDB
    const updatedPost = {
      ...existingPost.Item,
      content: content || existingPost.Item.content,
      imageUrl: updatedImageUrl,
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.client.put({
      TableName: tableName,
      Item: updatedPost,
    }).promise();

    res.status(200).json(updatedPost);
    
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
