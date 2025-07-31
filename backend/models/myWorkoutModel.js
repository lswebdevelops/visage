import mongoose from "mongoose";

const workoutSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // De-normalized fields from TrainingType - these are copies at the time the workout is added
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    // Reference to the original TrainingType (optional, for admin or linking back)
    originalTrainingType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingType",
      default: null, // Can be null if it's a completely custom user workout
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;
