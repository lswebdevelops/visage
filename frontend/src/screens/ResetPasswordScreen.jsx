import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao redefinir a senha");
      }

      toast.success("Senha redefinida com sucesso");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <FormContainer>
      <h1>Redefinir Senha</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Nova Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Digite sua nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="my-3">
          <Form.Label>Confirmar Nova Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirme sua nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          Redefinir Senha
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
