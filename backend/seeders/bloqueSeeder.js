import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Blog from '../models/blogModel.js'; // ajuste o caminho conforme sua estrutura
import connectDB from '../config/db.js';   // ajuste o caminho conforme sua estrutura

dotenv.config();
await connectDB();

const blogs = [
  {
    title: '5 Benefícios do Treinamento de Força',
    image: 'https://res.cloudinary.com/dvnxrzpnl/image/upload/v1750946746/picture-blog_soomd8.png',
    author: 'Visage',
    content: `O treinamento de força não é apenas para fisiculturistas. Ele melhora a saúde óssea, acelera o metabolismo, aumenta a força funcional, melhora a postura e reduz o risco de lesões. Comece com pesos leves e aumente gradualmente!`,
  },
  {
    title: 'Como Montar sua Divisão de Treino Ideal',
    image: 'https://res.cloudinary.com/dvnxrzpnl/image/upload/v1750946746/picture-blog_soomd8.png',
    author: 'Visage',
    content: `Dividir seu treino entre diferentes grupos musculares ajuda na recuperação e otimiza os resultados. Você pode usar divisões A/B, A/B/C ou até A/B/C/D dependendo da sua rotina e objetivo.`,
  },
  {
    title: 'Alimentação Pré e Pós-Treino: o que Comer?',
    image: 'https://res.cloudinary.com/dvnxrzpnl/image/upload/v1750946746/picture-blog_soomd8.png',
    author: 'Visage',
    content: `Antes do treino, prefira carboidratos complexos e proteína leve. Após o treino, foque na recuperação com proteína de alto valor biológico e carboidratos simples para repor o glicogênio.`,
  },
  {
    title: 'Cardio Antes ou Depois da Musculação?',
    image: 'https://res.cloudinary.com/dvnxrzpnl/image/upload/v1750946746/picture-blog_soomd8.png',
    author: 'Visage',
    content: `Depende do objetivo! Para emagrecimento, o ideal é após o treino de musculação. Para condicionamento, pode ser feito antes. O importante é manter o equilíbrio para não comprometer o rendimento.`,
  },
  {
    title: 'Descanso é Parte do Treino',
    image: 'https://res.cloudinary.com/dvnxrzpnl/image/upload/v1750946746/picture-blog_soomd8.png',
    author: 'Visage',
    content: `Muitos ignoram o descanso, mas ele é crucial para o crescimento muscular. Dormir bem e respeitar os intervalos entre treinos é tão importante quanto treinar pesado e se alimentar bem.`,
  },
];

const importBlogs = async () => {
  try {
    await Blog.deleteMany();
    const createdBlogs = await Blog.insertMany(blogs);
    console.log('Blogs inseridos com sucesso!');
    process.exit();
  } catch (error) {
    console.error('Erro ao inserir blogs:', error);
    process.exit(1);
  }
};

importBlogs();
