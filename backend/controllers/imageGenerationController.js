// backend/controllers/imageGenerationController.js

import asyncHandler from '../middleware/asyncHandler.js';
import ImageGeneration from '../models/imageGenerationModel.js';
import User from '../models/userModel.js'; // Para verificar o barbeiro
import dotenv from 'dotenv';
dotenv.config();

// --- Substitua esta função pela sua lógica real de chamada à API de IA ---
// Exemplo de chamada para Imagen 3.0 (modelo de geração de imagem do Google Gemini API)
async function callAIGenerationAPI(prompt, imageUrl) {
  // Aqui você faria a chamada real para a API de IA
  // Para o MVP, vamos simular uma resposta
  console.log(`Chamando IA com prompt: "${prompt}" e imagem: "${imageUrl}"`);

  // Simulação de delay da API
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Simulação de resposta da API de IA
  const mockGeneratedImageUrl = `https://placehold.co/400x400/00FF00/FFFFFF?text=Visage+IA+${Date.now()}`;
  const mockTokensUsed = Math.floor(Math.random() * (2000 - 500 + 1)) + 500; // Tokens aleatórios
  
  // Retorna a URL da imagem gerada e os tokens usados
  return {
    generatedImageUrl: mockGeneratedImageUrl,
    tokensUsed: mockTokensUsed,
  };
}
// --- FIM da função de simulação ---


// @desc Gerar imagem com IA
// @route POST /api/generations
// @access Private (Barbeiro)
const generateImage = asyncHandler(async (req, res) => {
  // O arquivo original foi processado pelo Multer e estará em req.file
  if (!req.file) {
    res.status(400);
    throw new Error('Nenhuma imagem original foi enviada.');
  }

  const { clientName, faceShape, hairType, hasBeard, preferredStyle } = req.body;
  const originalPhotoUrl = `/uploads/${req.file.filename}`; // URL local do arquivo salvo

  if (!clientName || !faceShape || !hairType || !hasBeard || !preferredStyle) {
    res.status(400);
    throw new Error('Por favor, preencha todos os campos do formulário.');
  }

  // Constrói o prompt para a IA com base nas preferências do cliente
  const prompt = `Crie uma imagem de um rosto humano com o formato ${faceShape}, com um corte de cabelo ${hairType} e ${hasBeard === 'sim' ? 'com barba' : hasBeard === 'nao' ? 'sem barba' : hasBeard}. O estilo desejado é ${preferredStyle}. Use a imagem de referência do cliente para manter as características faciais.`;

  try {
    // Chama a função que interage com a API de IA
    const aiResponse = await callAIGenerationAPI(prompt, originalPhotoUrl);

    const { generatedImageUrl, tokensUsed } = aiResponse;

    // Calcula o custo estimado (exemplo: $0.02 por 1000 tokens + 30% de margem)
    const costPer1000Tokens = parseFloat(process.env.COST_PER_1000_TOKENS || 0.02); // Defina no .env
    const margin = parseFloat(process.env.MARGIN_PERCENTAGE || 0.30); // Defina no .env (30%)
    const estimatedCost = (tokensUsed / 1000) * costPer1000Tokens * (1 + margin);

    // Cria e salva o registro da geração no banco de dados
    const generation = await ImageGeneration.create({
      barber: req.user._id, // O ID do barbeiro logado (vindo do middleware protect)
      clientName,
      originalPhotoUrl,
      generatedImageUrl,
      promptUsed: prompt,
      tokensUsed,
      estimatedCost: parseFloat(estimatedCost.toFixed(2)), // Arredonda para 2 casas decimais
    });

    res.status(201).json({
      message: 'Visual gerado com sucesso!',
      generationId: generation._id,
      generatedImageUrl: generation.generatedImageUrl,
      tokensUsed: generation.tokensUsed,
      estimatedCost: generation.estimatedCost,
      clientName: generation.clientName,
    });

  } catch (error) {
    console.error('Erro ao gerar imagem com IA:', error);
    res.status(500);
    throw new Error('Erro ao gerar o visual com IA. Tente novamente mais tarde.');
  }
});

// @desc Obter todas as gerações de um barbeiro específico
// @route GET /api/generations/my-generations
// @access Private (Barbeiro)
const getBarberGenerations = asyncHandler(async (req, res) => {
  const generations = await ImageGeneration.find({ barber: req.user._id })
    .sort({ createdAt: -1 }); // Ordena pelas mais recentes primeiro

  res.status(200).json(generations);
});

// @desc Obter detalhes de uma geração específica
// @route GET /api/generations/:id
// @access Private (Barbeiro ou Admin)
const getGenerationById = asyncHandler(async (req, res) => {
  const generation = await ImageGeneration.findById(req.params.id);

  if (generation) {
    // Garante que apenas o próprio barbeiro ou um admin possa ver a geração
    if (generation.barber.toString() === req.user._id.toString() || req.user.role === 'admin') {
      res.status(200).json(generation);
    } else {
      res.status(403); // Forbidden
      throw new Error('Não autorizado a acessar esta geração.');
    }
  } else {
    res.status(404);
    throw new Error('Geração não encontrada.');
  }
});

// @desc Deletar uma geração (somente admin)
// @route DELETE /api/generations/:id
// @access Private/Admin
const deleteGeneration = asyncHandler(async (req, res) => {
  const generation = await ImageGeneration.findById(req.params.id);

  if (generation) {
    await ImageGeneration.deleteOne({ _id: generation._id });
    res.status(200).json({ message: 'Geração removida com sucesso.' });
  } else {
    res.status(404);
    throw new Error('Geração não encontrada.');
  }
});

// @desc Obter todas as gerações (somente admin)
// @route GET /api/generations/admin/all
// @access Private/Admin
const getAllGenerationsAdmin = asyncHandler(async (req, res) => {
  const generations = await ImageGeneration.find({}).populate('barber', 'name email'); // Popula com nome e email do barbeiro
  res.status(200).json(generations);
});


export {
  generateImage,
  getBarberGenerations,
  getGenerationById,
  deleteGeneration,
  getAllGenerationsAdmin,
};