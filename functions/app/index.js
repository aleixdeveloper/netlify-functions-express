/* Express App */
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import compression from "compression";
import customLogger from "../utils/logger";
import testRoutes from "../routes/testRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import { connectDB } from "../config/db.js";
import { notFound, errorHandler } from "../middleware/errorMiddleware.js";

/* My express App */
export default function expressApp(functionName) {
  dotenv.config();
  connectDB();

  const app = express();

  const router = express.Router();

  // gzip responses
  router.use(compression());

  // Set router base path for local dev
  const routerBasePath =
    process.env.NODE_ENV === "dev"
      ? `/${functionName}`
      : `/.netlify/functions/${functionName}/`;

  app.use(`${routerBasePath}/test`, testRoutes);
  app.use(`${routerBasePath}/users`, userRoutes);

  app.use(notFound);
  app.use(errorHandler);
  router.get("/hello/", function (req, res) {
    res.send("hello world");
  });

  // Attach logger
  app.use(morgan(customLogger));

  // Setup routes
  app.use(routerBasePath, router);

  // Apply express middlewares
  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  return app;
}
