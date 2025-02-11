const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/postController");
const upload = multer();

router.put("/posts/:id", upload.single("image"), postController.updatePost);

module.exports = router;
