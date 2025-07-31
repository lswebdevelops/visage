import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/users/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao enviar e-mail");
      }

      toast.success("Email enviado com instruções para redefinir a senha.");
      setEmail("");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <h1>Esqueci minha senha</h1>
      <p>Digite seu email para receber um link de redefinição de senha.</p>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Endereço de Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar instruções"}
        </Button>
      </Form>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
