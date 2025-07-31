import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastCompletedWorkout: {
      type: String,
      default: null,
    },
    currentWorkoutIndex: {
      type: Number,
      default: 0,
    },
    currentTrainingProgramId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TrainingProgram",
      default: null,
    },

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Este hook pre-save irá fazer o hashing da senha apenas se ela foi modificada.
// Esta é a abordagem correta para garantir que o hashing ocorra apenas uma vez
// antes de salvar o documento na base de dados.
userSchema.pre("save", async function (next) {
  // Se a senha não foi modificada, passe para o próximo middleware/salvamento
  if (!this.isModified("password")) {
    next();
    return; // Adicionado return para garantir que a execução pare aqui
  }
  // Gera um salt (valor aleatório) para o hashing da senha
  const salt = await bcrypt.genSalt(10);
  // Hashes a senha com o salt gerado
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Continua para o próximo middleware/salvamento
});

const User = mongoose.model("User", userSchema);

export default User;
