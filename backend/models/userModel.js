// backend/models/userModel.js

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
    // Usaremos 'role' para definir o tipo de usuário (barbeiro ou admin)
    role: {
      type: String,
      required: true,
      // Restringe os valores possíveis para 'role'
      enum: ['barbeiro', 'admin'], 
      default: 'barbeiro', // O papel padrão será 'barbeiro' ao registrar
    },

    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adiciona 'createdAt' e 'updatedAt'
  }
);

// Método para comparar a senha fornecida com a senha hash no banco de dados
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Middleware 'pre-save' para fazer o hash da senha antes de salvar
userSchema.pre("save", async function (next) {
  // Só faz o hash se a senha foi modificada (ou é um novo usuário)
  if (!this.isModified("password")) {
    next();
    return;
  }
  
  const salt = await bcrypt.genSalt(10); // Gera um salt para o hashing
  this.password = await bcrypt.hash(this.password, salt); // Faz o hash da senha
  next();
});

const User = mongoose.model("User", userSchema);

export default User;