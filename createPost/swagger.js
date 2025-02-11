module.exports = {
    openapi: "3.0.0",
    info: {
      title: "Create Post API",
      version: "1.0.0"
    },
    paths: {
      "/api/posts": {
        post: {
          summary: "Create a new post",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { type: "string" },
                    content: { type: "string" },
                    imageUrl: { type: "string" }
                  },
                  required: ["user", "content"]
                }
              }
            }
          },
          responses: {
            "201": { description: "Post created successfully" }
          }
        }
      }
    }
  };
  