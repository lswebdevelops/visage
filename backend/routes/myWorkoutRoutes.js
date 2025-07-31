import express from "express";
import { 
  getMyWorkout, 
  createMyWorkout, 
  updateMyWorkout, // Adicionei novamente
  deleteMyWorkout 
} from "../controllers/myWorkoutController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getMyWorkout).post(protect, createMyWorkout);
router.route("/:id").put(protect, updateMyWorkout).delete(protect, deleteMyWorkout); // Adicionei a rota PUT

export default router;
