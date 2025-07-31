import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from '../config/db.js';
import TrainingType from '../models/trainingTypeModel.js';
import User from '../models/userModel.js';
import Workout from '../models/myWorkoutModel.js'; // Importar o modelo Workout

dotenv.config();
await connectDB();

const trainingTypes = [
  // A – Pernas
  { name: 'A1', category: 'Pernas', description: 'Agachamento livre\nLeg press\nCadeira extensora\nCadeira flexora\nPanturrilha em pé' },
  { name: 'A2', category: 'Pernas', description: 'Agachamento sumô\nAvanço com halteres\nCadeira abdutora\nPanturrilha sentada\nAgachamento búlgaro' },
  { name: 'A3', category: 'Pernas', description: 'Stiff com halteres\nLevantamento terra romeno\nGlúteo na máquina\nCadeira adutora\nMesa flexora' },
  { name: 'A4', category: 'Pernas', description: 'Agachamento no Smith\nPassada no step\nPanturrilha no leg\nCadeira flexora unilateral\nExtensora com pausa' },
  { name: 'A5', category: 'Pernas', description: 'Hack machine\nAgachamento frontal\nAfundo com barra\nElevação de quadril\nFlexora 21' },

  // B – Costas
  { name: 'B1', category: 'Costas', description: 'Puxada frente\nRemada baixa\nPullover no cabo\nBarra fixa\nRemada curvada com barra' },
  { name: 'B2', category: 'Costas', description: 'Remada unilateral\nPulldown com triângulo\nLevantamento terra\nRemada cavalinho\nPuxada atrás' },
  { name: 'B3', category: 'Costas', description: 'Remada serrote\nRemada na máquina Hammer\nFace pull\nPull-over com halteres\nPuxada neutra' },
  { name: 'B4', category: 'Costas', description: 'Remada T-bar\nRemada invertida\nPulldown unilateral\nBarra fixa com pegada aberta\nRemada no Smith' },
  { name: 'B5', category: 'Costas', description: 'Remada sentada com corda\nPuxada pronada\nRemada supinada\nPullover na máquina\nBarra com pegada fechada' },

  // C – Peito
  { name: 'C1', category: 'Peito', description: 'Supino reto\nSupino inclinado\nCrucifixo reto\nCrossover\nFlexão' },
  { name: 'C2', category: 'Peito', description: 'Supino com halteres\nSupino declinado\nCrucifixo inclinado\nPeck deck\nPullover com halteres' },
  { name: 'C3', category: 'Peito', description: 'Crucifixo com cabo\nSupino máquina\nFlexão com pés elevados\nCrossover unilateral\nPress inclinado' },
  { name: 'C4', category: 'Peito', description: 'Press declinado no Smith\nSupino alternado\nCrucifixo máquina\nPeck deck unilateral\nFlexão diamante' },
  { name: 'C5', category: 'Peito', description: 'Press com pega neutra\nCrucifixo no cross\nPush-up com halteres\nPress com elástico\nCrossover inclinado' },

  // D – Ombros
  { name: 'D1', category: 'Ombros', description: 'Desenvolvimento com halteres\nElevação lateral\nRemada alta\nEncolhimento\nCrucifixo invertido' },
  { name: 'D2', category: 'Ombros', description: 'Desenvolvimento no Smith\nElevação frontal\nFace pull\nRemada baixa no cabo\nDesenvolvimento Arnold' },
  { name: 'D3', category: 'Ombros', description: 'Crucifixo inverso\nEncolhimento com barra\nElevação lateral inclinada\nRemada unilateral\nDesenvolvimento militar' },
  { name: 'D4', category: 'Ombros', description: 'Elevação 21\nRemada no cross\nDesenvolvimento alternado\nEncolhimento com halteres\nElevação no cabo' },
  { name: 'D5', category: 'Ombros', description: 'Desenvolvimento com kettlebell\nCrucifixo máquina\nRemada pegada aberta\nElevação lateral com isometria\nFace pull com corda' },

  // E – Braços
  { name: 'E1', category: 'Braços', description: 'Rosca direta\nTríceps pulley\nRosca martelo\nTríceps testa\nRosca concentrada' },
  { name: 'E2', category: 'Braços', description: 'Rosca Scott\nTríceps corda\nRosca inversa\nTríceps banco\nRosca alternada' },
  { name: 'E3', category: 'Braços', description: 'Rosca 21\nTríceps francês\nRosca no cabo\nTríceps unilateral\nRosca com barra EZ' },
  { name: 'E4', category: 'Braços', description: 'Tríceps coice\nRosca com resistência elástica\nTríceps máquina\nRosca Zottman\nRosca martelo cruzada' },
  { name: 'E5', category: 'Braços', description: 'Rosca concentrada sentado\nTríceps na testa com halteres\nRosca no banco inclinado\nTríceps cruzado no cabo\nRosca direta com isometria' },

  // F – Abdômen
  { name: 'F1', category: 'Abdômen', description: 'Prancha\nAbdominal supra\nAbdominal infra\nElevação de pernas\nAbdominal na bola' },
  { name: 'F2', category: 'Abdômen', description: 'Prancha lateral\nAbdominal bicicleta\nAbdominal oblíquo\nAbdominal com carga\nPrancha com elevação' },
  { name: 'F3', category: 'Abdômen', description: 'Prancha com braço estendido\nElevação de joelhos\nAbdominal na prancha inclinada\nAbdominal máquina\nTwist russo' },
  { name: 'F4', category: 'Abdômen', description: 'Abdominal invertido\nAbdominal V-up\nPrancha com instabilidade\nElevação de pernas com peso\nCrunch com bola suíça' },
  { name: 'F5', category: 'Abdômen', description: 'Mountain climber\nAbdominal com polia alta\nPrancha com halteres\nCrunch cruzado\nElevação suspensa' },
];

const importData = async () => {
  try {
    // 1. Limpar dados existentes para evitar inconsistências
    console.log('Limpando dados existentes...'.yellow.inverse);
    await TrainingType.deleteMany();
    await Workout.deleteMany(); // Limpa todos os treinos dos usuários
    // Resetar campos de progresso para todos os usuários (exceto admin, se preferir)
    // Ou, se quiser resetar TUDO e recriar usuários, use User.deleteMany()
    await User.updateMany(
      {}, // Atualiza todos os usuários
      { $set: { lastCompletedWorkout: null, currentWorkoutIndex: 0 } }
    );
    console.log('Dados existentes limpos!'.yellow.inverse);

    // 2. Encontrar o usuário admin (assumindo que ele já existe ou será criado separadamente)
    let adminUser = await User.findOne({ isAdmin: true });

    // Se não houver admin, você pode criar um aqui ou garantir que seu processo de registro o faça.
    // Para este seeder, vamos assumir que o admin já existe ou que você o criará manualmente.
    // Se o admin não for encontrado, o seeder irá falhar.
    if (!adminUser) {
      console.log('Usuário admin não encontrado. Por favor, crie um usuário admin primeiro.'.red.inverse);
      // Opcional: Criar um admin padrão se não existir
      // adminUser = await User.create({
      //   name: 'Admin User',
      //   email: 'admin@example.com',
      //   password: '123456', // Mude para uma senha segura em produção
      //   isAdmin: true,
      // });
      // console.log('Usuário admin padrão criado.'.green.inverse);
      process.exit(1); // Saia se o admin não for encontrado e não for criado
    }

    // 3. Inserir os tipos de treino (treinos gerais)
    const trainingTypesWithUser = trainingTypes.map((t) => ({
      ...t,
      user: adminUser._id, // Associa os treinos gerais ao admin
    }));

    await TrainingType.insertMany(trainingTypesWithUser);
    console.log('Tipos de treino (gerais) populados!'.green.inverse);

    console.log('Dados importados com sucesso!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Erro ao importar dados: ${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await TrainingType.deleteMany();
    await Workout.deleteMany();
    await User.deleteMany(); // Deleta todos os usuários (incluindo admin)
    console.log('Dados destruídos!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Erro ao destruir dados: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Adicione scripts ao package.json para rodar o seeder
// "scripts": {
//   "data:import": "node backend/seeder.js",
//   "data:destroy": "node backend/seeder.js -d"
// }

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
