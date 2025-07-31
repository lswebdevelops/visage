import {
  useGetMyWorkoutDetailsQuery,
  useDeleteMyWorkoutMutation,
} from "../slices/myTrainingApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col, Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from 'react-redux'; // Import useSelector
import { useUpdateUserMutation } from '../slices/usersApiSlice'; // Import mutation for user updates

const MyTrainingScreen = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get userInfo from Redux

  const {
    data: workouts,
    isLoading,
    error,
    refetch,
  } = useGetMyWorkoutDetailsQuery();

  const [deleteWorkout, { isLoading: loadingDelete }] =
    useDeleteMyWorkoutMutation();

  const [updateUser] = useUpdateUserMutation(); // User update mutation

  // If the error is "Workout not found", display a message that no workouts have been added.
  if (
    error &&
    (error?.data?.message === "Adicione um Treino" ||
      error.error === "Adicione um Treino")
  ) {
    return <Message>Nenhum treino adicionado.</Message>;
  }

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="danger">
        {error?.data?.message || "Erro ao carregar treino"}
      </Message>
    );

  const handleDelete = async (workoutId) => {
    if (window.confirm("Tem certeza que deseja deletar este treino?")) {
      try {
        await deleteWorkout(workoutId).unwrap();
        toast.success("Treino deletado");
        refetch(); // Refetch the user's workouts

        // After deleting a workout, reset currentWorkoutIndex to 0 in the user's database record.
        // This ensures the user starts from the beginning of their remaining workouts.
        if (userInfo) {
          await updateUser({ _id: userInfo._id, currentWorkoutIndex: 0 })
            .unwrap()
            .then(() => {
              // The user info in Redux will be updated upon the next login or data fetch
              // For a more immediate UI update, you might need to dispatch an action
              // or refetch user data explicitly after updating currentWorkoutIndex.
              // For now, relying on next login/data fetch for full sync.
            })
            .catch((err) => {
              console.error("Failed to reset user workout index after deletion:", err);
            });
        }

      } catch (err) {
        toast.error(
          err?.data?.message || "Falha ao deletar treino"
        );
      }
    }
  };

  return (
    <>
      <h2 className="text-center mb-4">Editar meus Treinos</h2>
      {workouts && workouts.length > 0 ? (
        <Row>
          {workouts.map((workout) => {
            // Now 'workout' directly contains 'name', 'category', 'description'
            // No need to access workout.trainingType
            return (
              <Col key={workout._id} md={6} lg={4} className="mb-3">
                <Card className="workout-card shadow-sm">
                  <Card.Body>
                    <Card.Title className="text-primary">
                      {workout.name}
                    </Card.Title>
                    <hr />
                    <Card.Text>
                      <strong>Categoria:</strong> {workout.category || "N/A"}
                      <br />
                      <br />
                      {workout.description || "Sem descrição"}
                    </Card.Text>
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(workout._id)}
                        disabled={loadingDelete}
                      >
                        {loadingDelete ? "Deletando..." : "Deletar treino"}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      ) : (
        <Message>Nenhum treino adicionado.</Message>
      )}
    </>
  );
};

export default MyTrainingScreen;