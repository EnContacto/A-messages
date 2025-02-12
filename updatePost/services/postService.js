const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const s3 = new S3Client({ region: "us-east-1" });

module.exports.updatePost = async (postId, newContent, newImage) => {
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";
  const bucketName = process.env.S3_BUCKET || "distribuidabucketsocial";

  try {
    // Obtener el post actual
    const existingPost = await dynamoDB.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: postId },
      })
    );

    if (!existingPost.Item) {
      throw new Error("Post not found");
    }

    let updatedImageUrl = existingPost.Item.imageUrl;

    // Subir nueva imagen a S3 si se proporciona
    if (newImage) {
      const fileBuffer = newImage.buffer;
      const fileName = `${postId}-${Date.now()}.jpg`;
      const mimeType = newImage.mimetype;

      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimeType,
      };

      const uploadResult = await s3.send(new PutObjectCommand(uploadParams));
      updatedImageUrl = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    }

    // Actualizar el post en DynamoDB
    await dynamoDB.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id: postId },
        UpdateExpression: "set content = :content, imageUrl = :imageUrl, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":content": newContent || existingPost.Item.content,
          ":imageUrl": updatedImageUrl,
          ":updatedAt": new Date().toISOString(),
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    return { success: true, message: "Post updated successfully", updatedImageUrl };
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Internal server error");
  }
};
