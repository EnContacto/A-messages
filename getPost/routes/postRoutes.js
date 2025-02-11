const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/posts/:id", postController.getPostById);
router.get("/posts", postController.getAllPosts);

module.exports = router;
