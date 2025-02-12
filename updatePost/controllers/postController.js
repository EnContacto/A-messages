const postService = require("../services/postService");

module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedPost = await postService.updatePost(id, content, req.file);
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
