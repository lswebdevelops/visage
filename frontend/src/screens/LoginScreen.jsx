import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect); // Redireciona após login se userInfo estiver disponível
    }
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap(); // Realiza a mutação de login
      dispatch(setCredentials({ ...res })); // Armazena as credenciais no Redux
      navigate(redirect); // Redireciona após login
    } catch (err) {
      toast.error(err?.data?.message || err.error || "Erro inesperado"); // Mensagem de erro
    }
  };

  return (
    <FormContainer>
      <h1>Login</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-3">
          <Form.Label>Endereço de email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password" className="my-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button
          type="submit"
          variant="primary"
          className="mt-2"
          disabled={isLoading} // Desabilita o botão enquanto está carregando
        >
          {isLoading ? "Carregando..." : "Entrar"}{" "}
          {/* Texto dinâmico no botão */}
        </Button>
        {isLoading && <Loader />} {/* Exibe loader enquanto está carregando */}
      </Form>

      <Row className="py-3">
        <Col>
          Novo por aqui?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Registre-se
          </Link>{" "}
          para receber e-mails sobre os nossos últimos lançamentos.
        </Col>
        <div className="mt-3">
          <Link to="/forgot-password">Esqueceu sua senha?</Link>
        </div>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
