import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

// O usuário deve estar autenticado
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Lê o JWT do cookie 'jwt'
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Anexa o usuário à requisição (excluindo a senha)
      // O campo 'role' será incluído aqui automaticamente pelo modelo
      req.user = await User.findById(decoded.userId).select("-password");

      next(); // Continua para a próxima função middleware/rota
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Não autorizado, token inválido");
    }
  } else {
    res.status(401);
    throw new Error("Não autorizado, nenhum token fornecido");
  }
});

// O usuário deve ser um administrador
const admin = (req, res, next) => {
  // MUDANÇA AQUI: Verifica se o 'role' do usuário é 'admin'
  if (req.user && req.user.role === 'admin') {
    next(); // Continua para a próxima função middleware/rota
  } else {
    res.status(401);
    throw new Error("Não autorizado como administrador");
  }
};

export { protect, admin };