const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.delete("/posts/:id", postController.deletePost);

module.exports = router;
