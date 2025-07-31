import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import {
  FaUser,
  FaUserTie,
  FaHome,
  FaUserAlt,
  FaNewspaper,
  FaDumbbell,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  // Este useEffect é responsável por redirecionar para a página de login
  // sempre que o userInfo se tornar nulo (ou seja, quando o usuário não estiver logado).
  useEffect(() => {
    if (!userInfo) {
      console.log("userInfo é nulo, redirecionando para /login");
      navigate("/login");
    } else {
      console.log("userInfo presente:", userInfo.name);
    }
  }, [userInfo, navigate]); // Depende de userInfo para re-executar quando ele muda

  // Função para lidar com o logout do usuário
  const logoutHandler = async () => {
    try {
      // 1. Tenta fazer a chamada para a API de logout no backend.
      // É importante que esta chamada seja bem-sucedida para invalidar a sessão no servidor.
      await logoutApiCall().unwrap();

      // 2. Se a chamada da API for bem-sucedida, despacha a ação de logout do Redux.
      // Isso irá limpar o estado 'userInfo' no Redux e remover 'userInfo' do localStorage.
      dispatch(logout());

      // O redirecionamento para /login será tratado pelo useEffect acima,
      // que detectará a mudança de userInfo para null.
    } catch (err) {
      // Em caso de erro na chamada da API de logout (ex: problema de rede, servidor),
      // ainda assim queremos limpar o estado do cliente para garantir que o usuário
      // não permaneça "logado" no frontend.
      console.error("Erro no logout da API:", err);
      dispatch(logout()); // Garante que o estado local seja limpo
    }
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          {/* Logo */}
          <Navbar.Brand href="/">
            <img
              src="https://res.cloudinary.com/dvnxrzpnl/image/upload/v1753968237/visage_logo_rc7zs1.png"
              alt="logo of visage"
              className="logo-hw"
            />
          </Navbar.Brand>

          <Nav className="me-auto d-flex flex-row nav-header">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center me-3">
              <FaHome size={20} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Visage</span>
            </Nav.Link>

            {userInfo && (
              <Nav.Link as={Link} to="/clients" className="d-flex align-items-center me-3">
                <FaDumbbell size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Clientes</span>
              </Nav.Link>
            )}

            <Nav.Link as={Link} to="/blogs" className="d-flex align-items-center">
              <FaNewspaper size={27} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Blog</span>
            </Nav.Link>

            <Nav.Link as={Link} to="/about_us" className="d-flex align-items-center">
              <FaUserAlt size={20} className="d-lg-none icon-bio-header" />
              <span className="ms-2 d-none d-lg-inline">Sobre o App</span>
            </Nav.Link>
          </Nav>

          <Navbar.Toggle aria-controls="user-navbar-collapse" />
          <Navbar.Collapse id="user-navbar-collapse">
            <Nav className="ms-auto">
              {/* User Dropdown */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item as={Link} to="/profile" className="perfil-link-a">
                    Meu Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={logoutHandler} className="perfil-link-a">
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                  <FaUser />
                  <span className="ms-2 d-none d-lg-inline">Login</span>
                </Nav.Link>
              )}

              {/* Admin Dropdown */}
              {userInfo?.isAdmin && (
                <NavDropdown title={<FaUserTie size={20} />} id="adminmenu">
                  <NavDropdown.Item as={Link} to="/admin/api_use" className="admin-menu-a">
                    Uso de API
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/bloglist" className="admin-menu-a">
                    Editar Blogs
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/userlist" className="admin-menu-a">
                    Editar Usuários
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
