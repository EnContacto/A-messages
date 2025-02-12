const express = require("express");
const cors = require("cors"); // <-- Agregar esto

const app = express();
const postRoutes = require("./routes/postRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");

// 🛠️ Permitir solicitudes desde cualquier origen
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/api", postRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
