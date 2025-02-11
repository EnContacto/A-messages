const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/postController");

const upload = multer();
router.post("/posts", upload.single("image"), postController.createPost);

module.exports = router;
