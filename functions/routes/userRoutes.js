import express from "express";
const router = express.Router();
import {
  authAdminUser,
  /*   getUserProfile,
  updateUserProfile, */
  getUsers,
  getUsersTable,
  deleteUser,
  getUserById,
  updateUser,
  createAndAuthStandardUser,
  updateUserScore,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/login").post(createAndAuthStandardUser);
router.route("/admin").post(authAdminUser).get(protect, admin, getUsers);

router.route("/table").get(/* protect, admin,  */ getUsersTable);
/* router.post("/login", authUser); */
/* router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile); */
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);
router.route("/:id/score").put(updateUserScore);

export default router;
