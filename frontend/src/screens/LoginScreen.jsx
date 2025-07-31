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

  // Hook do RTK Query para a mutação de login
  const [login, { isLoading }] = useLoginMutation();

  // Seleciona as informações do usuário do estado do Redux
  const { userInfo } = useSelector((state) => state.auth);

  // Obtém o parâmetro de redirecionamento da URL
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // Efeito para lidar com o redirecionamento após o login
  // Este useEffect será acionado SOMENTE quando userInfo se tornar verdadeiro (ou seja, o usuário logar)
  // e fará isso de forma consistente após o estado do Redux ter sido atualizado.
  useEffect(() => {
    if (userInfo) {
      navigate(redirect); // Redireciona após login se userInfo estiver disponível
    }
  }, [userInfo, redirect, navigate]); // Depende de userInfo para acionar a re-execução

  // Função para lidar com o envio do formulário de login
  const submitHandler = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário
    try {
      // Realiza a mutação de login e espera pela resposta
      const res = await login({ email, password }).unwrap();
      // Armazena as credenciais do usuário no estado do Redux
      dispatch(setCredentials({ ...res }));
      // A navegação agora é tratada exclusivamente pelo useEffect acima,
      // que detectará a atualização de 'userInfo' no Redux.
    } catch (err) {
      // Exibe uma mensagem de erro em caso de falha no login
      toast.error(err?.data?.message || err.error || "Erro inesperado");
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
          disabled={isLoading} // Desabilita o botão enquanto a requisição está em andamento
        >
          {isLoading ? "Carregando..." : "Entrar"}{" "}
          {/* Texto dinâmico no botão */}
        </Button>
        {isLoading && <Loader />} {/* Exibe o loader enquanto está carregando */}
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
