const express = require("express");
const app = express();
const deleteRoutes = require("./routes/postRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger");

app.use(express.json());
app.use("/api", deleteRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DeletePost service running on port ${PORT}`));
