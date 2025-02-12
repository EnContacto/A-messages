const express = require("express");
const multer = require("multer");
const router = express.Router();
const postController = require("../controllers/postController");

// 📌 Configuración de multer para subir imágenes con restricciones
const storage = multer.memoryStorage(); // Guardar en memoria
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // ✅ Acepta el archivo
    } else {
        cb(new Error("❌ Solo se permiten imágenes (jpeg, jpg, png)"), false);
    }
};

// Configuración del middleware de `multer`
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB límite
});

// 📌 Rutas de actualización de posts
router.put("/posts/:id", upload.single("image"), async (req, res) => {
    try {
        await postController.updatePost(req, res);
    } catch (error) {
        console.error("🚨 Error en la ruta updatePost:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
