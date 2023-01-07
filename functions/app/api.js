"use strict";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "../config/db.js";
import serverless from "serverless-http";
import testRoutes from "../routes/testRoutes.js";
import userRoutes from "../routes/userRoutes.js";

import { notFound, errorHandler } from "../middleware/errorMiddleware.js";
dotenv.config();
connectDB();

const appPath =
  process.env.NODE_ENV !== "production" ? "/api" : "/.netlify/functions/api";

const app = express();
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());

// ----------------------------------------------------

app.use(`${appPath}/test`, testRoutes);
app.use(`${appPath}/users`, userRoutes);

app.use(notFound);
app.use(errorHandler);

// ----------------------------------------------------
if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT, function () {
    console.log(`Server started on port ${process.env.PORT}...`);
  });
}
const handler = serverless(app);
export { handler };
