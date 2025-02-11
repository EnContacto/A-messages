const postService = require("../services/postService");

exports.createPost = async (req, res) => {
  try {
    const { user, content } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await postService.uploadImageToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
    }

    const newPost = await postService.createPost({ user, content, imageUrl });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};
