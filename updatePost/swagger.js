module.exports = {
    openapi: "3.0.0",
    info: {
      title: "Update Post API",
      version: "1.0.0"
    },
    paths: {
      "/api/posts/{id}": {
        put: {
          summary: "Update a post by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    content: { type: "string" },
                    imageUrl: { type: "string" }
                  }
                }
              }
            }
          },
          responses: {
            "200": { description: "Post updated successfully" },
            "404": { description: "Post not found" }
          }
        }
      }
    }
  };
  