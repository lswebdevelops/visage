import { useState, useEffect } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import {
  useGetMyWorkoutDetailsQuery,
  useUpdateMyWorkoutMutation,
} from "../slices/myTrainingApiSlice";
import { useProfileMutation } from "../slices/usersApiSlice";
import TrainingTypeComponent from "../components/TrainingType";
import Loader from "../components/Loader";
import Message from "../components/Message";
import image_logout from "../assets/image_logout.png";

const TRAINING_CODE_TO_MUSCLE_GROUP = {
  A1: "Pernas",
  A2: "Pernas",
  A3: "Pernas",
  A4: "Pernas",
  A5: "Pernas",
  B1: "Costas",
  B2: "Costas",
  B3: "Costas",
  B4: "Costas",
  B5: "Costas",
  C1: "Bíceps",
  C2: "Bíceps",
  C3: "Bíceps",
  C4: "Bíceps",
  C5: "Bíceps",
  D1: "Tríceps",
  D2: "Tríceps",
  D3: "Tríceps",
  D4: "Tríceps",
  D5: "Tríceps",
  E1: "Peito",
  E2: "Peito",
  E3: "Peito",
  E4: "Peito",
  E5: "Peito",
  F1: "Abdômen",
  F2: "Abdômen",
  F3: "Abdômen",
  F4: "Abdômen",
  F5: "Abdômen",
};

const HomeScreen = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: myWorkoutsData,
    isLoading,
    error,
    refetch: refetchWorkouts,
  } = useGetMyWorkoutDetailsQuery();

  const [updateWorkout] = useUpdateMyWorkoutMutation();
  const [updateUserProfile] = useProfileMutation();

  const [workoutsArray, setWorkoutsArray] = useState([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(null);

  // Aguarda o carregamento de userInfo completo antes de iniciar a lógica do index
  useEffect(() => {
    if (
      userInfo &&
      userInfo.currentWorkoutIndex !== undefined &&
      currentWorkoutIndex === null
    ) {
      setCurrentWorkoutIndex(userInfo.currentWorkoutIndex);
    }
  }, [userInfo, currentWorkoutIndex]);

  useEffect(() => {
    if (
      userInfo &&
      userInfo.currentWorkoutIndex !== undefined &&
      currentWorkoutIndex !== null &&
      myWorkoutsData
    ) {
      const sorted = [...myWorkoutsData].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setWorkoutsArray(sorted);

      if (currentWorkoutIndex >= sorted.length && sorted.length > 0) {
        const correctedIndex = 0;
        setCurrentWorkoutIndex(correctedIndex);
        updateUserProfile({ currentWorkoutIndex: correctedIndex })
          .unwrap()
          .then((updatedUser) => dispatch(setCredentials(updatedUser)))
          .catch((err) =>
            console.error("Erro ao corrigir índice fora do limite:", err)
          );
      }

      if (sorted.length === 0 && userInfo.currentWorkoutIndex !== 0) {
        setCurrentWorkoutIndex(0);
        updateUserProfile({ currentWorkoutIndex: 0 })
          .unwrap()
          .then((updatedUser) => dispatch(setCredentials(updatedUser)))
          .catch((err) =>
            console.error("Erro ao resetar índice sem treinos:", err)
          );
      }
    }
  }, [userInfo, myWorkoutsData, currentWorkoutIndex, updateUserProfile, dispatch]);

  const handleWorkoutDone = async (id) => {
    if (!userInfo || !userInfo._id) return;

    try {
      await updateWorkout({ id, status: "completed" }).unwrap();

      const nextIndex =
        workoutsArray.length > 0
          ? (currentWorkoutIndex + 1) % workoutsArray.length
          : 0;

      const workoutName = workoutsArray[currentWorkoutIndex]?.name;

      await updateUserProfile({
        currentWorkoutIndex: nextIndex,
        lastCompletedWorkout: workoutName,
      })
        .unwrap()
        .then((updatedUser) => {
          setCurrentWorkoutIndex(nextIndex);
          dispatch(setCredentials(updatedUser));
          refetchWorkouts();
        });
    } catch (err) {
      console.error("Erro ao concluir treino:", err);
    }
  };

  if (isLoading || currentWorkoutIndex === null || userInfo === null) {
    return <Loader />;
  }

  const workoutOfTheDay =
    workoutsArray.length > 0 && currentWorkoutIndex < workoutsArray.length
      ? workoutsArray[currentWorkoutIndex]
      : null;

  return (
    <Container className="trainingTypeHomeScreenContainer text-center py-4">
      {!keyword ? (
        <h1 className="h1-recent-titles mb-4">Seu Exercício</h1>
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Voltar
        </Link>
      )}

      {userInfo?.lastCompletedWorkout && (
        <div className="mb-4">
          
        </div>
      )}

      {workoutOfTheDay ? (
        <>
          <Row className="justify-content-center box-training-day">
            <Col xs={12} sm={10} md={8} lg={6} xl={4}>
              <TrainingTypeComponent trainingType={workoutOfTheDay} />
            </Col>
          </Row>
          <Button
            variant="success"
            className="mt-3 w-50 button-training-done"
            onClick={() => handleWorkoutDone(workoutOfTheDay._id)}
          >
            Treino Concluído
          </Button>

          {/* Progress bar */}
          {workoutsArray.length > 0 && (
            <div className="workout-progress-bar-container mt-5">
              <Row className="justify-content-center">
                <Col
                  xs={12}
                  className="d-flex justify-content-center flex-wrap"
                >
                  {workoutsArray.map((workout, index) => (
                    <div
                      key={workout._id}
                      className={`workout-progress-item
                        ${index < currentWorkoutIndex ? "completed-past" : ""}
                        ${index === currentWorkoutIndex ? "current-active" : ""}
                        ${index > currentWorkoutIndex ? "pending-future" : ""}
                      `}
                      title={
                        TRAINING_CODE_TO_MUSCLE_GROUP[workout.name] ||
                        workout.name
                      }
                    >
                      {workout.name}
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          )}
        </>
      ) : (
        <>
          <Message variant="info">Nenhum treino encontrado.</Message>
          <p className="mt-3">Você ainda não adicionou nenhum treino.</p>
          <p className="red_home_message">
            Se adicionou ou removeu treinos recentemente e eles não aparecem,
            tente entrar novamente (deslogar e logar).
          </p>
          <p>Click em seu nome e sair:</p>
          <img
            src={image_logout}
            alt="logout image"
            className="img-fluid mt-3"
          />
        </>
      )}
    </Container>
  );
};

export default HomeScreen;
