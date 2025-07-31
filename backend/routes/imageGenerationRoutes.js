// backend/routes/imageGenerationRoutes.js

import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js'; // Importe seu middleware de autenticação/autorização
import upload from '../middleware/uploadMiddleware.js'; // Importe o middleware de upload
import {
  generateImage,
  getBarberGenerations,
  getGenerationById,
  deleteGeneration,
  getAllGenerationsAdmin,
} from '../controllers/imageGenerationController.js'; // Importe os controladores que criaremos

const router = express.Router();

// Rotas para barbeiros autenticados
router.route('/')
  .post(protect, upload.single('originalImage'), generateImage); // Rota para gerar imagem (requer autenticação e upload de uma única imagem)

router.route('/my-generations').get(protect, getBarberGenerations); // Rota para obter histórico do barbeiro

// Rotas para administradores (se necessário no futuro para gerenciar todas as gerações)
router.route('/:id')
  .get(protect, getGenerationById) // Obter uma geração específica
  .delete(protect, admin, deleteGeneration); // Deletar uma geração (somente admin)

router.route('/admin/all').get(protect, admin, getAllGenerationsAdmin); // Obter todas as gerações (somente admin)

export default router;