import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Row, Col, Card, Badge } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateTrainingTypeMutation,
  useGetTrainingTypeDetailsQuery,
} from "../../slices/trainingTypesApiSlice";
import { TRAINING_CODE_TO_MUSCLE_GROUP } from "../../utils/constants.js";

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

const TrainingTypeEditScreen = () => {
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
        navigate("/admin/trainingTypelist");
      }
    } catch (error) {
      toast.error("Erro ao atualizar treino");
    }
  };
  // Estado para exercício manual
  const [manualExercise, setManualExercise] = useState("");

  return (
    <>
      <Link to="/admin/trainingTypelist" className="btn btn-light my-3">
        Voltar
      </Link>

      <Row className="g-3">
        {/* Left section - Form */}
        <Col lg={6} md={12} sm={12}>
          <div className="p-3 bg-light rounded shadow">
            <FormContainer>
              <h1>Editar Treino</h1>
              {loadingUpdate && <Loader />}
              {isLoading ? (
                <Loader />
              ) : error ? (
                <Message variant="danger">{error.data.message}</Message>
              ) : (
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId="name" className="my-2">
                    <Form.Label>Treino</Form.Label>
                    <Form.Control
                      as="select"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    >
                      {[
                        "Selecione uma Opção:",
                        "A1",
                        "A2",
                        "A3",
                        "A4",
                        "A5",
                        "B1",
                        "B2",
                        "B3",
                        "B4",
                        "B5",
                        "C1",
                        "C2",
                        "C3",
                        "C4",
                        "C5",
                        "D1",
                        "D2",
                        "D3",
                        "D4",
                        "D5",
                        "E1",
                        "E2",
                        "E3",
                        "E4",
                        "E5",
                        "F1",
                        "F2",
                        "F3",
                        "F4",
                        "F5",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="category" className="my-2">
                    <Form.Label>Grupo Muscular</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nome do Grupo Muscular"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      readOnly
                      className="bg-light"
                    />
                    <Form.Text className="text-muted">
                      Este campo é atualizado automaticamente baseado no código
                      do treino
                    </Form.Text>
                  </Form.Group>

                  {/* Seletor de grupo muscular */}
                  <Form.Group controlId="muscleGroup" className="my-2">
                    <Form.Label>Selecionar Grupo Muscular</Form.Label>
                    <Form.Control
                      as="select"
                      value={currentMuscleGroup}
                      onChange={(e) => setCurrentMuscleGroup(e.target.value)}
                    >
                      {Object.keys(EXERCISE_DATA).map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Lista de exercícios do grupo selecionado */}
                  <div className="my-3">
                    <h6>Exercícios Disponíveis - {currentMuscleGroup}</h6>
                    <div
                      style={{
                        maxHeight: "200px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      {EXERCISE_DATA[currentMuscleGroup].map(
                        (exercise, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between align-items-center mb-2"
                          >
                            <span style={{ fontSize: "0.9rem" }}>
                              {exercise}
                            </span>
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => addExercise(exercise)}
                              disabled={selectedExercises.includes(exercise)}
                            >
                              +
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Campo para adicionar exercício manualmente */}
                  <div className="my-3">
                    <Form.Label>Adicionar Exercício Manual</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        placeholder="Digite o nome do exercício"
                        value={manualExercise}
                        onChange={(e) => setManualExercise(e.target.value)}
                      />
                      <Button
                        variant="success"
                        className="ms-2"
                        onClick={() => {
                          const trimmed = manualExercise.trim();
                          if (trimmed.length === 0) {
                            toast.error("O exercício não pode ser vazio.");
                          } else if (selectedExercises.includes(trimmed)) {
                            toast.error("Este exercício já foi adicionado.");
                          } else {
                            setSelectedExercises([
                              ...selectedExercises,
                              trimmed,
                            ]);
                            setManualExercise("");
                          }
                        }}
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  {/* Exercícios selecionados */}
                  <div className="my-3">
                    <h6>
                      Exercícios Selecionados ({selectedExercises.length})
                    </h6>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "5px",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      {selectedExercises.length === 0 ? (
                        <p className="text-muted">
                          Nenhum exercício selecionado
                        </p>
                      ) : (
                        selectedExercises.map((exercise, index) => (
                          <div
                            key={index}
                            className="d-flex justify-content-between align-items-center mb-2"
                          >
                            <Badge bg="secondary" className="me-2">
                              {index + 1}
                            </Badge>
                            <span style={{ fontSize: "0.9rem", flex: 1 }}>
                              {exercise}
                            </span>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => removeExercise(exercise)}
                            >
                              ×
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <Button type="submit" variant="primary" className="my-2">
                    Salvar
                  </Button>
                </Form>
              )}
            </FormContainer>
          </div>
        </Col>

        {/* Right section - Instructions */}
        <Col lg={6} md={12} sm={12}>
          <div className="p-3 bg-white rounded shadow">
            <h4>Como Organizar os Treinos</h4>
            <p>
              Os treinos são organizados por letras, cada uma representando um
              grupo muscular específico:
            </p>
            <ul>
              <li>
                <strong>A:</strong> Pernas
              </li>
              <li>
                <strong>B:</strong> Costas
              </li>
              <li>
                <strong>C:</strong> Bíceps
              </li>
              <li>
                <strong>D:</strong> Tríceps
              </li>
              <li>
                <strong>E:</strong> Peito
              </li>
              <li>
                <strong>F:</strong> Abdômen
              </li>
            </ul>
            <p>
              Os treinos devem ser montados combinando letras diferentes, mas
              mantendo a mesma numeração. Exemplos:
            </p>
            <ul>
              <li>
                <strong>Treino 1</strong>: 4 exercícios → A1, B1, C1, D1
              </li>
              <li>
                <strong>Treino 2</strong>: 5 exercícios → A2, B2, C2, D2, E2
              </li>
            </ul>

            <Card className="mt-3">
              <Card.Header>
                <h6>Como Usar o Sistema</h6>
              </Card.Header>
              <Card.Body>
                <ol style={{ fontSize: "0.9rem" }}>
                  <li>Selecione um grupo muscular no dropdown</li>
                  <li>Clique no botão "+" para adicionar exercícios</li>
                  <li>Ou digite um novo exercício e clique em "Adicionar"</li>
                  <li>Os exercícios selecionados aparecerão na lista abaixo</li>
                  <li>Use o "×" para remover exercícios indesejados</li>
                  <li>Salve quando terminar a seleção</li>
                </ol>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default TrainingTypeEditScreen;
