const { GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { dynamoDB, s3 } = require("../config/awsConfig");

module.exports.updatePost = async (postId, newContent, newImage) => {
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";
  const bucketName = process.env.S3_BUCKET || "distribuidabucketsocial";

  try {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    const stringPostId = String(postId);

    console.log(`Checking if postId ${stringPostId} exists in table ${tableName}`);

    // 🔥 PRIMERO OBTENER EL POST COMPLETO
    const existingPost = await dynamoDB.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: stringPostId },
      })
    );

    if (!existingPost.Item) {
      throw new Error("Post not found");
    }

    // ✅ AHORA SE PUEDE ACCEDER A timestamp
    const postTimestamp = existingPost.Item.timestamp;
    let updatedImageUrl = existingPost.Item.imageUrl;

    if (newImage) {
      console.log("Uploading new image to S3...");
      const fileBuffer = newImage.buffer;
      const fileName = `${stringPostId}-${Date.now()}.jpg`;
      const mimeType = newImage.mimetype;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      };

      await s3.send(new PutObjectCommand(uploadParams));
      updatedImageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    }

    console.log("Updating post in DynamoDB...");
    await dynamoDB.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id: stringPostId, timestamp: postTimestamp }, // ✅ Ahora timestamp está definido
        UpdateExpression: "SET content = :content, imageUrl = :imageUrl, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":content": newContent || existingPost.Item.content,
          ":imageUrl": updatedImageUrl,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    console.log("Post updated successfully!");
    return { success: true, message: "Post updated successfully", updatedImageUrl };
  } catch (error) {
    console.error("❌ Error updating post:", error);
    throw new Error("Internal server error");
  }
};
