import asyncHandler from "../middleware/asyncHandler.js";
import Workout from "../models/myWorkoutModel.js";
import TrainingType from "../models/trainingTypeModel.js";
import User from "../models/userModel.js"; // Import the User model

// @desc    Get user's workout plan
// @route   GET /api/clients
// @access  Private
const getMyWorkout = asyncHandler(async (req, res) => {
  // We no longer populate trainingType here, as the relevant data (name, category, description)
  // is now directly embedded in the Workout document.
  const workouts = await Workout.find({ user: req.user._id });

  if (!workouts || workouts.length === 0) {
    res.status(404);
    throw new Error("Adicione um Treino");
  }

  res.json(workouts);
});

// @desc    Add trainingType to user's workout plan
// @route   POST /api/clients
// @access  Private
const createMyWorkout = asyncHandler(async (req, res) => {
  const { trainingTypeId } = req.body;

  if (!trainingTypeId) {
    res.status(400);
    throw new Error("TrainingType ID is required");
  }

  const trainingType = await TrainingType.findById(trainingTypeId);
  if (!trainingType) {
    res.status(404);
    throw new Error("Treino não encontrado");
  }

  // Check if this specific trainingType name has already been added by the user
  // This helps prevent adding the same workout template multiple times under the same name.
  const existingWorkout = await Workout.findOne({ user: req.user._id, name: trainingType.name });

  if (existingWorkout) {
    res.status(400);
    throw new Error("Treino já adicionado");
  }

  // Create the Workout entry by copying relevant TrainingType data (de-normalization)
  const workout = new Workout({
    user: req.user._id,
    name: trainingType.name,
    category: trainingType.category,
    description: trainingType.description,
    originalTrainingType: trainingType._id, // Keep a reference to the original template
    status: "pending", // Set initial status
  });

  const createdWorkout = await workout.save();
  res.status(201).json(createdWorkout);
});

// @desc    Update user's workout status and progress
// @route   PUT /api/clients/:id
// @access  Private
const updateMyWorkout = asyncHandler(async (req, res) => {
  const { status, currentWorkoutIndex } = req.body;

  const workout = await Workout.findOneAndUpdate(
    { user: req.user._id, _id: req.params.id },
    { status: status },
    { new: true } // Return the updated document
  );

  if (!workout) {
    res.status(404);
    throw new Error("Treino não encontrado");
  }

  // Update user's progress in the database
  const user = await User.findById(req.user._id);

  if (user) {
    // If the workout is marked as completed, update lastCompletedWorkout
    if (status === "completed") {
      user.lastCompletedWorkout = workout.name; // Store the name of the completed workout
    }

    // Update the current workout index if provided
    if (currentWorkoutIndex !== undefined) {
      user.currentWorkoutIndex = currentWorkoutIndex;
    }
    await user.save();
  }

  res.json(workout);
});

// @desc    Remove trainingType from user's workout plan
// @route   DELETE /api/clients/:id
// @access  Private
const deleteMyWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ user: req.user._id, _id: req.params.id });

  if (!workout) {
    res.status(404);
    throw new Error("Treino não encontrado");
  }

  await workout.deleteOne();

  // After deletion, we might need to reset or adjust the currentWorkoutIndex if the
  // deleted workout was the current one or before it. This logic is best handled
  // on the frontend after refetching the user's workouts, but for robustness,
  // we could add basic reset logic here. For now, assuming frontend handles.

  res.json({ message: "Treino removido" });
});

export { getMyWorkout, createMyWorkout, updateMyWorkout, deleteMyWorkout };
