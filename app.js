import * as dotenv from "dotenv";
// Load environment variables from a .env file
dotenv.config();
import globalErrorHandler from "./src/middlewares/globalErrorHandler.js";
import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import indexRoutes from "./src/routes/index.routes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./swagger.yaml");
// Creating an Express application
const app = express();
app.set("trust proxy", true);

// Express and third-party Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ------------------API routes---------------------------
// Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// API Routes V1
app.use("/", indexRoutes);

// Other Routes
app.get("/health", (req, res) => {
  res.send("Hello, Word!");
});

// ------------------ Subscribers -------------------------//

// PORT
const PORT = process.env.PORT || 5210;

//! Alert: Error Handler must in Last,Then it's worked
//* Custom Async Error handler Middleware *//
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
