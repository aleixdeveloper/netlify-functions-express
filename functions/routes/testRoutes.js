import express from "express";
const router = express.Router();
import { getTest } from "../controllers/testController.js";
/* import { protect, admin } from "../middleware/authMiddleware.js"; */

router.route("/").get(getTest);

export default router;
