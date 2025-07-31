import { useState } from "react";
import { Row, Col, Form, Button, Badge } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useGetTrainingTypesQuery } from "../slices/trainingTypesApiSlice";
import { useCreateMyWorkoutMutation } from "../slices/myTrainingApiSlice";
import TrainingType from "../components/TrainingType";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrainingTypeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetTrainingTypesQuery({
    keyword,
    pageNumber,
  });

  const [sortOrder, setSortOrder] = useState("asc");
  const [createWorkout] = useCreateMyWorkoutMutation();

  // Ordenar os exercícios pelo nome
  const sortedTrainingTypes = data?.trainingTypes
    ? [...data.trainingTypes].sort((a, b) => {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      })
    : [];

  // Função para adicionar o treino
  const handleAddToWorkout = async (trainingTypeId) => {
    try {
      await createWorkout({ trainingTypeId }).unwrap();
      toast.success("Treino adicionado com sucesso!"); // Toast de sucesso
    } catch (error) {
      console.error("Erro ao adicionar treino:", error);
      toast.error("Erro ao adicionar treino./ Treino já adicionado."); // Toast de erro
    }
  };

  return (
    <div className="trainingTypeHomeScreenContainer">
      <div className="homeScreen">
        {!keyword ? (
          ""
        ) : (
          <Link to="/" className="btn btn-light mb-4">
            Voltar
          </Link>
        )}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <h1 className="trainingTypesPageH1">Treinos</h1>
            {/* Seção de exemplos (mantida para referência) */}
            <div className="mt-4">
              <h3>Exemplos de treinos:</h3>              
              <p>Treino 1: A1, B1, C1, D1, E1, F1 </p>
              <p>Treino 2: A2, B2, C2, D2, E2 </p>

              <Row>
                <Col>
                  <div className="p-3 bg-light rounded">
                    <h5>Grupos Musculares</h5>
                    <ul className="list-unstyled d-flex flex-wrap gap-3 align-items-center m-0">
                      <li>
                        <Badge bg="primary">A</Badge> Pernas
                      </li>
                      <li>
                        <Badge bg="success">B</Badge> Costas
                      </li>
                      <li>
                        <Badge bg="warning text-dark">C</Badge> Bíceps
                      </li>
                      <li>
                        <Badge bg="danger">D</Badge> Tríceps
                      </li>
                      <li>
                        <Badge bg="info text-dark">E</Badge> Peito
                      </li>
                      <li>
                        <Badge bg="dark">F</Badge> Abdômen
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Filtro de ordenação */}
            <Form.Group controlId="filterOrder" className="mb-3">
              <Form.Label>Ordenar por:</Form.Label>
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">A-Z</option>
                <option value="desc">Z-A</option>
              </Form.Select>
            </Form.Group>

            <Row>
              {sortedTrainingTypes.map((trainingType) => (
                <Col
                  key={trainingType._id}
                  sm={12}
                  md={6}
                  lg={4}
                  xl={3}
                  className="home-screen-training-box"
                >
                  <TrainingType trainingType={trainingType} />
                  <Button
                    variant="primary"
                    className="mt-2 w-100"
                    onClick={() => handleAddToWorkout(trainingType._id)}
                  >
                    Adicionar ao Meu Treino
                  </Button>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>

      {/* Container de Toasts */}
      <ToastContainer />
    </div>
  );
};

export default TrainingTypeScreen;
