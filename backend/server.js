// backend/server.js

import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
// Importe as novas rotas de geração de imagem
import imageGenerationRoutes from "./routes/imageGenerationRoutes.js"; 

// Importe suas outras rotas existentes
import myClientsRoutes from "./routes/myClientsRoutes.js";
import aboutUsRoutes from "./routes/aboutUsRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

connectDB(); // Conecta ao MongoDB

const app = express();
// Middleware para parsear o corpo das requisições JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware para parsear cookies
app.use(cookieParser());

// Rotas de Usuários
app.use("/api/users", userRoutes);
// NOVO: Rotas para Geração de Imagens com IA
app.use("/api/generations", imageGenerationRoutes); 

// Suas outras rotas existentes
app.use("/api/about_us", aboutUsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/clients", myClientsRoutes); // Mantenha se ainda for usar esta rota para algo diferente de geração de imagem

const __dirname = path.resolve(); // Define __dirname para o diretório atual
// Serve a pasta 'uploads' estaticamente para que as imagens possam ser acessadas via URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Bloco de código para produção (mantido comentado como no seu original)
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/frontend/build')));
//   app.get('*', (req, res) =>
//     res.sendFile(path.resolve(__dirname, 'frontend', 'build' , 'index.html')))
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
// }

// Middlewares de tratamento de erro
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));