import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Biography from '../models/biographyModel.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    const about_us = {
      name: "Visage",
      bio: "Focados em ajudar você a alcançar seus objetivos de fitness, o Visage é um aplicativo inovador que combina tecnologia e paixão pelo esporte. Com uma interface intuitiva e recursos avançados, ele permite que você registre seus treinos, monitore seu progresso e receba dicas personalizadas para otimizar seus resultados. Seja você um iniciante ou um atleta experiente, o Visage é o seu parceiro ideal na jornada rumo a uma vida mais saudável e ativa.",
      image: "https://res.cloudinary.com/dvnxrzpnl/image/upload/v1753722672/download_elmwmo.png",
    };

    await Biography.create(about_us);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();