import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import {
  FaUser,
  FaUserTie,
  FaHome,
  FaWeightHanging,
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

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.log(err);
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
            <Nav.Link
              as={Link}
              to="/"
              className="d-flex align-items-center me-3"
            >
              <FaHome size={20} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Visage</span>
            </Nav.Link>

            {userInfo && (
              <Nav.Link
                as={Link}
                to="/clients"
                className="d-flex align-items-center me-3"
              >
                <FaDumbbell size={20} className="d-lg-none" />
                <span className="ms-2 d-none d-lg-inline">Clientes</span>
              </Nav.Link>
            )}
            {/* <Nav.Link
              as={Link}
              to="/clientTypes"
              className="d-flex align-items-center me-3"
            >
              <FaWeightHanging size={20} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Todos os Treinos</span>
            </Nav.Link> */}
            <Nav.Link
              as={Link}
              to="/blogs"
              className="d-flex align-items-center"
            >
              <FaNewspaper size={27} className="d-lg-none" />
              <span className="ms-2 d-none d-lg-inline">Blog</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about_us"
              className="d-flex align-items-center"
            >
              <FaUserAlt size={20} className="d-lg-none  icon-bio-header" />
              <span className="ms-2 d-none d-lg-inline">Sobre o App</span>
            </Nav.Link>
          </Nav>

          <Navbar.Toggle aria-controls="user-navbar-collapse" />

          <Navbar.Collapse id="user-navbar-collapse">
            <Nav className="ms-auto">
              {/* User Dropdown */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <NavDropdown.Item
                    className="perfil-link-a"
                    as={Link}
                    to="/profile"
                  >
                    Meu Perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    className="perfil-link-a"
                    onClick={logoutHandler}
                  >
                    Sair
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="d-flex align-items-center"
                >
                  <FaUser />
                  <span className="ms-2 d-none d-lg-inline ">Login</span>
                </Nav.Link>
              )}

              {/* Admin Dropdown */}
              {userInfo?.isAdmin && (
                <NavDropdown title={<FaUserTie size={20} />} id="adminmenu">
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/api_use"
                    className="admin-menu-a"
                  >
                    Use de Api
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/bloglist"
                    className="admin-menu-a"
                  >
                    Editar Blogs
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/userlist"
                    className="admin-menu-a"
                  >
                    Editar Usuários
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item as={Link} to="/admin/email-list" className="admin-menu-a">
              Email Usuários
            </NavDropdown.Item> */}
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
