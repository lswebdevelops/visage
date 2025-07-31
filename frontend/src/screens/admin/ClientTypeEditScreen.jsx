import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useUpdateTrainingTypeMutation,
  useGetTrainingTypeDetailsQuery,
} from "../../slices/clientTypesApiSlice.js";
import { TRAINING_CODE_TO_MUSCLE_GROUP } from "../../utils/constants.js";
import { div } from "motion/react-client";

// Dados dos exercícios organizados por grupo muscular
const EXERCISE_DATA = {
  Pernas: [
    "Agachamento Livre – 4x 8-12",
    "Leg Press – 3x 10-12",
    "Afundo com Halteres – 3x 10 (cada perna)",
    "Stiff com Barra – 3x 10-12",
    "Cadeira Extensora – 3x 12-15",
    "Panturrilha no Smith – 3x 15-20",
    "Levantamento Terra – 4x 5-8",
    "Passada com Barra – 3x 8 (cada perna)",
    "Cadeira Flexora – 3x 10-12",
    "Agachamento Búlgaro – 3x 15",
    "Avanço Alternado – 3x 12 (cada perna)",
    "Elevação de Panturrilha Unilateral – 3x 15-20",
    "Agachamento com Salto – 3x 15",
    "Levantamento Terra Romeno – 4x 10",
    "Agachamento Sumo – 3x 12",
    "Glúteo na Polia – 3x 12",
    "Elevação Pélvica com Barra – 3x 10-12",
  ],
  Costas: [
    "Puxada Frontal – 4x 8-12",
    "Remada Curvada – 4x 10",
    "Remada Unilateral – 3x 10",
    "Pulldown na Polia – 3x 12",
    "Levantamento Terra – 3x 8-10",
    "Encolhimento de Ombros – 3x 15",
    "Barra Fixa – 5x 6-8",
    "Remada Cavalinho – 4x 8",
    "Remada Baixa na Polia – 3x 10",
    "Face Pull – 3x 12",
    "Puxada Pegada Fechada – 3x 12-15",
    "Pullover com Halter – 3x 12-15",
    "Remada com Halteres – 3x 12",
    "Hiperextensão Lombar – 3x 15-20",
    "Encolhimento com Halteres – 3x 15",
    "Puxada Pegada Aberta – 4x 10",
    "Remada Baixa – 3x 12",
    "Levantamento Terra Romeno – 3x 8",
  ],
  Bíceps: [
    "Rosca Direta com Barra – 4x 8-12",
    "Rosca Martelo – 3x 10-12",
    "Rosca Concentrada – 3x 12",
    "Rosca Alternada com Halteres – 4x 10",
    "Rosca Scott – 3x 12-15",
    "Rosca Inversa – 3x 12-15",
    "Rosca 21 – 3 séries",
    "Rosca Martelo com Corda – 3x 10-12",
    "Rosca com Barra W – 3x 10-12",
    "Rosca no Cabo – 3x 12-15",
    "Rosca Hammer Cross Body – 3x 10",
    "Rosca Pronada – 3x 12-15",
  ],
  Tríceps: [
    "Tríceps Corda no Pulley – 3x 12-15",
    "Tríceps Francês – 3x 10-12",
    "Fundos em Paralelas – 3x 8-12",
    "Tríceps Testa – 4x 8-10",
    "Paralelas com Peso – 3x 6-8",
    "Tríceps Mergulho no Banco – 3x 15-20",
    "Tríceps Pulley com Pegada Invertida – 3x 12-15",
    "Tríceps Coice – 3x 12-15",
    "Tríceps na Polia Alta – 3x 10-12",
    "Supino Fechado – 4x 8-10",
  ],
  Peito: [
    "Supino Reto com Barra – 4x 8-12",
    "Supino Inclinado com Halteres – 3x 10-12",
    "Crucifixo com Halteres – 3x 12",
    "Crossover – 3x 12-15",
    "Flexões – 3 séries até a falha",
    "Supino Fechado – 4x 8",
    "Supino com Pegada Invertida – 3x 10",
    "Flexão Diamante – 3x 12",
    "Supino com Halteres – 3x 12-15",
    "Crossover na Polia Alta – 3x 12-15",
    "Crucifixo Inclinado – 3x 15",
    "Supino Declinado – 3x 10-12",
    "Peck Deck – 3x 12-15",
  ],
  Ombros: [
    "Desenvolvimento com Halteres – 4x 8-12",
    "Elevação Lateral – 3x 12-15",
    "Elevação Frontal – 3x 10-12",
    "Desenvolvimento Militar – 4x 6-8",
    "Elevação Posterior – 3x 12-15",
    "Arnold Press – 3x 10-12",
    "Upright Row – 3x 10-12",
    "Face Pull – 3x 15",
    "Desenvolvimento na Máquina – 3x 12",
    "Elevação Lateral na Polia – 3x 12-15",
    "Remada Alta – 3x 10-12",
  ],
  Abdômen: [
    "Burpee – 3x 10",
    "Mountain Climber – 3x 20",
    "Jump Squat – 3x 15",
    "Prancha – 3x 60s",
    "Russian Twist – 3x 20",
    "High Knees – 3x 30s",
    "Jumping Jacks – 3x 30s",
    "Kettlebell Swing – 3x 15",
    "Box Jump – 3x 10",
    "Battle Rope – 3x 30s",
    "Agility Ladder – 3x 1 minuto",
    "Bear Crawl – 3x 10 metros",
    "Turkish Get Up – 3x 5 (cada lado)",
    "Farmer's Walk – 3x 20 metros",
  ],
};

const ClientTypeEditScreen = () => {
  const { id: trainingTypeId } = useParams();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [currentMuscleGroup, setCurrentMuscleGroup] = useState("Pernas");

  const {
    data: trainingType,
    isLoading,
    error,
  } = useGetTrainingTypeDetailsQuery(trainingTypeId);

  const [updateTrainingType, { isLoading: loadingUpdate }] =
    useUpdateTrainingTypeMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (trainingType) {
      setName(trainingType.name);
      setCategory(trainingType.category);

      // Converte a description em array de exercícios
      if (
        trainingType.description &&
        trainingType.description !== "Adicionar séries erepetições"
      ) {
        const exercises = trainingType.description
          .split("\n")
          .filter((ex) => ex.trim() !== "");
        setSelectedExercises(exercises);
      }
    }
  }, [trainingType]);

  // Atualizar automaticamente a categoria quando o nome do treino mudar
  useEffect(() => {
    if (name && TRAINING_CODE_TO_MUSCLE_GROUP[name]) {
      setCategory(TRAINING_CODE_TO_MUSCLE_GROUP[name]);
    }
  }, [name]);

  const addExercise = (exercise) => {
    if (!selectedExercises.includes(exercise)) {
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };

  const removeExercise = (exerciseToRemove) => {
    setSelectedExercises(
      selectedExercises.filter((ex) => ex !== exerciseToRemove)
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!trainingTypeId) {
      toast.error("Erro: ID do treino não encontrado!");
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error("Adicione pelo menos um exercício!");
      return;
    }

    const updatedTrainingType = {
      name,
      category,
      description: selectedExercises.join("\n"), // Converte array em string
    };

    try {
      const result = await updateTrainingType({
        trainingTypeId,
        ...updatedTrainingType,
      });

      if (result.error) {
        toast.error(result.error.data?.message || "Erro ao atualizar treino");
      } else {
        toast.success("Treino atualizado com sucesso");
        navigate("/admin/api_use");
      }
    } catch (error) {
      toast.error("Erro ao atualizar treino");
    }
  };
  // Estado para exercício manual
  const [manualExercise, setManualExercise] = useState("");

  return (
    <div>
      test
    </div>
  );
};

export default ClientTypeEditScreen;
