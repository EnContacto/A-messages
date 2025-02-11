module.exports = {
    openapi: "3.0.0",
    info: {
      title: "Get Post API",
      version: "1.0.0"
    },
    paths: {
      "/api/posts/{id}": {
        get: {
          summary: "Get a post by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" }
            }
          ],
          responses: {
            "200": { description: "Post retrieved successfully" },
            "404": { description: "Post not found" }
          }
        }
      }
    }
  };