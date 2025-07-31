import React from "react";
import { Link } from "react-router-dom";
import { Table, Button, Row, Col, Badge, Collapse } from "react-bootstrap";
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import Paginate from "../../components/Paginate";
import {
  useGetTrainingTypesQuery,
  useCreateTrainingTypeMutation,
  useDeleteTrainingTypeMutation,
} from "../../slices/trainingTypesApiSlice";
import { toast } from "react-toastify";
import { TRAINING_CODE_TO_MUSCLE_GROUP } from "../../utils/constants.js";
const TrainingTypeListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetTrainingTypesQuery({
    pageNumber,
  });

  const [createTrainingType, { isLoading: loadingCreate }] =
    useCreateTrainingTypeMutation();

  const [deleteTrainingType, { isLoading: loadingDelete }] =
    useDeleteTrainingTypeMutation();

  const [expandedRows, setExpandedRows] = useState({});

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Tem certeza que deseja deletar este treino?")) {
      try {
        await deleteTrainingType(id);
        toast.success("Treino deletado com sucesso");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createTrainingTypeHandler = async () => {
    if (!window.confirm("Tem certeza de que deseja criar um novo treino?")) {
      return;
    }
    try {
      await createTrainingType();
      refetch();
      toast.success("Treino criado! Agora você pode editá-lo.");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const formatExercises = (description) => {
    if (!description || description === "Adicionar séries erepetições") {
      return [];
    }
    return description.split("\n").filter((ex) => ex.trim() !== "");
  };

  const getExerciseCount = (description) => {
    return formatExercises(description).length;
  };

  // Função para obter o grupo muscular correto
  const getMuscleGroup = (trainingType) => {
    return (
      TRAINING_CODE_TO_MUSCLE_GROUP[trainingType.name] || trainingType.category
    );
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Paginate pages={data?.pages} page={data?.page} isAdmin={true} />
          <h1>Treinos</h1>
        </Col>
        {/* <Col className="text-end">
          <Button onClick={createTrainingTypeHandler} className="btn-sm m-3">
            <FaEdit />
            &nbsp; Criar Treino
          </Button>
        </Col> */}
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error.data.message}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome Treino</th>
                <th>Categoria</th>
                <th>Exercícios</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {[...data.trainingTypes]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((trainingType) => {
                  const exerciseCount = getExerciseCount(
                    trainingType.description
                  );
                  const exercises = formatExercises(trainingType.description);
                  const isExpanded = expandedRows[trainingType._id];
                  const muscleGroup = getMuscleGroup(trainingType);

                  return (
                    <React.Fragment key={trainingType._id}>
                      <tr>
                        <td>
                          <small className="text-muted">
                            {trainingType._id.slice(-6)}
                          </small>
                        </td>
                        <td>
                          <Badge
                            bg={
                              trainingType.name.charAt(0) === "A"
                                ? "primary"
                                : trainingType.name.charAt(0) === "B"
                                ? "success"
                                : trainingType.name.charAt(0) === "C"
                                ? "warning"
                                : trainingType.name.charAt(0) === "D"
                                ? "danger"
                                : trainingType.name.charAt(0) === "E"
                                ? "info"
                                : "dark"
                            }
                            className="me-2"
                          >
                            {trainingType.name}
                          </Badge>
                        </td>
                        <td>{muscleGroup}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <Badge
                              bg={exerciseCount === 0 ? "danger" : "success"}
                            >
                              {exerciseCount}
                            </Badge>

                            {exerciseCount > 0 && (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() =>
                                  toggleRowExpansion(trainingType._id)
                                }
                                className="p-0"
                              >
                                {isExpanded ? <FaEyeSlash /> : <FaEye />}
                              </Button>
                            )}
                          </div>
                        </td>
                        <td>
                          <Link
                            to={`/admin/trainingType/${trainingType._id}/edit`}
                          >
                            <Button variant="light" className="btn-sm mx-1">
                              <FaEdit />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            className="btn-sm mx-1"
                            onClick={() => deleteHandler(trainingType._id)}
                          >
                            <FaTrash style={{ color: "white" }} />
                          </Button>
                        </td>
                      </tr>

                      {/* Linha expandida com exercícios */}
                      {exercises.length > 0 && (
                        <tr>
                          <td colSpan="5" className="p-0">
                            <Collapse in={isExpanded}>
                              <div className="bg-light p-3 border-top">
                                <h6 className="mb-2">
                                  Exercícios do Treino {trainingType.name}:
                                </h6>
                                <Row>
                                  {exercises.map((exercise, index) => (
                                    <Col md={6} key={index} className="mb-2">
                                      <div className="d-flex align-items-start">
                                        <Badge
                                          bg="outline-primary"
                                          className="me-2 mt-1"
                                        >
                                          {index + 1}
                                        </Badge>
                                        <small>{exercise}</small>
                                      </div>
                                    </Col>
                                  ))}
                                </Row>
                              </div>
                            </Collapse>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </Table>

          {/* Seção de exemplos (mantida para referência) */}
          <div className="mt-4">
            <h3>Sistema de Organização</h3>
            <Row>
              <Col md={6}>
                <div className="p-3 bg-light rounded">
                  <h5>Grupos Musculares</h5>
                  <ul className="list-unstyled">
                    <li>
                      <Badge bg="primary">A</Badge> Pernas
                    </li>
                    <li>
                      <Badge bg="success">B</Badge> Costas
                    </li>
                    <li>
                      <Badge bg="warning">C</Badge> Bíceps
                    </li>
                    <li>
                      <Badge bg="danger">D</Badge> Tríceps
                    </li>
                    <li>
                      <Badge bg="info">E</Badge> Peito
                    </li>
                    <li>
                      <Badge bg="dark">F</Badge> Abdômen
                    </li>
                  </ul>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-3 bg-light rounded">
                  <h5>Como Funciona</h5>
                  <p className="mb-2">
                    <strong>Numeração:</strong> Combine diferentes grupos
                    musculares mantendo o mesmo número.
                  </p>
                  <p className="mb-2">
                    <strong>Exemplo 1:</strong> A1 + B1 + C1 = Treino completo
                  </p>
                  <p className="mb-0">
                    <strong>Exemplo 2:</strong> A2 + D2 + E2 = Outro treino
                    completo
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </>
  );
};

export default TrainingTypeListScreen;
