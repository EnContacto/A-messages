const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const dynamoDB = DynamoDBDocumentClient.from(new DynamoDBClient({ region: "us-east-1" }));
const s3 = new S3Client({ region: "us-east-1" });

module.exports.deletePost = async (postId) => {
  const tableName = process.env.DYNAMODB_TABLE || "PostsTable";
  const bucketName = process.env.S3_BUCKET || "distribuidabucketsocial";

  try {
    // Obtener el post de DynamoDB
    const existingPost = await dynamoDB.send(
      new GetCommand({
        TableName: tableName,
        Key: { id: postId },
      })
    );

    if (!existingPost.Item) {
      throw new Error("Post not found");
    }

    // Eliminar la imagen de S3 si existe
    if (existingPost.Item.imageUrl) {
      const imageKey = existingPost.Item.imageUrl.split("/").pop();
      await s3.send(
        new DeleteObjectCommand({
          Bucket: bucketName,
          Key: imageKey,
        })
      );
    }

    // Eliminar el post de DynamoDB
    await dynamoDB.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id: postId },
      })
    );

    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Internal server error");
  }
};
