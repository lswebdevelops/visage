import asyncHandler from "../middleware/asyncHandler.js";
import TrainingType from "../models/trainingTypeModel.js";
import Workout from "../models/myWorkoutModel.js";

// Mapeamento dos códigos de treino para grupos musculares
const TRAINING_CODE_TO_MUSCLE_GROUP = {
  'A1': 'Pernas', 'A2': 'Pernas', 'A3': 'Pernas', 'A4': 'Pernas', 'A5': 'Pernas',
  'B1': 'Costas', 'B2': 'Costas', 'B3': 'Costas', 'B4': 'Costas', 'B5': 'Costas',
  'C1': 'Bíceps', 'C2': 'Bíceps', 'C3': 'Bíceps', 'C4': 'Bíceps', 'C5': 'Bíceps',
  'D1': 'Tríceps', 'D2': 'Tríceps', 'D3': 'Tríceps', 'D4': 'Tríceps', 'D5': 'Tríceps',
  'E1': 'Peito', 'E2': 'Peito', 'E3': 'Peito', 'E4': 'Peito', 'E5': 'Peito',
  'F1': 'Funcional', 'F2': 'Funcional', 'F3': 'Funcional', 'F4': 'Funcional', 'F5': 'Funcional'
};

// @desc Fetch all TrainingTypes
// @route get /api/TrainingTypes
// @access Public
const getTrainingTypes = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await TrainingType.countDocuments({ ...keyword });

  const trainingTypes = await TrainingType.find({ ...keyword })
    .sort({ createdAt: -1 }) // newest trainingTypes first
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.json({ trainingTypes, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch a trainingType
// @route get /api/TrainingTypes/:id
// @access Public
const getTrainingTypeById = asyncHandler(async (req, res) => {
  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    res.json(trainingType);
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado.");
  }
});

// @desc create a new trainingType
// @route post /api/TrainingTypes
// @access private admin
const createTrainingType = asyncHandler(async (req, res) => {
  const trainingType = new TrainingType({
    name: "-",
    user: req.user._id,   
    category: "Grupo Muscular",
    description: `Adicionar séries e repetições`,
  });

  const createdTrainingType = await trainingType.save();
  res.status(201).json(createdTrainingType);
});

// @desc update a trainingType
// @route PUT  /api/trainingType/:id
// @access private admin
const updateTrainingType = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    trainingType.name = name;
    trainingType.description = description;    
    
    // Atualizar automaticamente a categoria baseada no código do treino
    if (name && TRAINING_CODE_TO_MUSCLE_GROUP[name]) {
      trainingType.category = TRAINING_CODE_TO_MUSCLE_GROUP[name];
    } else {
      trainingType.category = category; // Fallback para o valor enviado
    }

    const updatedTrainingType = await trainingType.save();
    res.json(updatedTrainingType);
  } else {
    res.status(404);
    throw new Error("Training Type not found");
  }
});

// @desc delete a trainingType
// @route delete  /api/trainingType/:id
// @access private admin
const deleteTrainingType = asyncHandler(async (req, res) => {
  const trainingType = await TrainingType.findById(req.params.id);

  if (trainingType) {
    // Remove o treino
    await trainingType.deleteOne();
    // Remove todos os workouts que referenciam esse treino
    await Workout.deleteMany({ trainingType: trainingType._id });
    res
      .status(200)
      .json({
        message: "Treino deletado e removido dos workouts dos usuários",
      });
  } else {
    res.status(404);
    throw new Error("Recurso não encontrado");
  }
});

export {
  getTrainingTypes,
  getTrainingTypeById,
  createTrainingType,
  updateTrainingType,
  deleteTrainingType,  
};