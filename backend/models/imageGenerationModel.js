// backend/models/imageGenerationModel.js

import mongoose from 'mongoose';

const imageGenerationSchema = new mongoose.Schema(
  {
    // ID do barbeiro que realizou esta geração (referência ao modelo User)
    barber: {
      type: mongoose.Schema.Types.ObjectId, // Tipo de dado para ID de outro documento
      required: true,
      ref: 'User', // Indica que se refere ao modelo 'User'
    },
    // Nome do cliente para quem a imagem foi gerada
    clientName: {
      type: String,
      required: true,
    },
    // URL da foto original do rosto do cliente (armazenada em algum serviço de cloud/armazenamento)
    originalPhotoUrl: {
      type: String,
      required: true,
    },
    // URL da imagem de cabelo/barba gerada pela IA
    generatedImageUrl: {
      type: String,
      required: true,
    },
    // O prompt completo que foi enviado para o modelo de IA (para registro)
    promptUsed: {
      type: String,
      required: true,
    },
    // Número de tokens consumidos pela API de IA para esta geração
    tokensUsed: {
      type: Number,
      required: true,
      default: 0,
    },
    // Custo estimado desta geração (baseado em tokens e margem)
    estimatedCost: {
      type: Number,
      required: true,
      default: 0.0,
      set: (v) => parseFloat(v.toFixed(2)), // Garante que o custo seja armazenado com 2 casas decimais
    },
  },
  {
    timestamps: true, // Adiciona 'createdAt' (data da geração) e 'updatedAt' automaticamente
  }
);

// Cria o modelo 'ImageGeneration' a partir do schema definido
const ImageGeneration = mongoose.model('ImageGeneration', imageGenerationSchema);

export default ImageGeneration;