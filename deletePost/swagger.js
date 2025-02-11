module.exports = {
    openapi: "3.0.0",
    info: {
      title: "Delete Post API",
      version: "1.0.0"
    },
    paths: {
      "/api/posts/{id}": {
        delete: {
          summary: "Delete a post",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "Post deleted successfully" },
            "404": { description: "Post not found" }
          }
        }
      }
    }
  };