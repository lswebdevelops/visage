import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();

  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
        setKeyword("")
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex search-space-box">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Buscar Treinos"
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>
      <Button
        type="submit"
        variant="outline-secondary"
        className="p-2 mx-2"
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "1.2rem",
          borderColor: "transparent",
          transition: "border-color 0.1s",
        }}
        onMouseEnter={(e) => (e.target.style.borderColor = "rgb(226, 226, 226)")}
        onMouseLeave={(e) => (e.target.style.borderColor = "transparent")}
      >
        <FaSearch />
      </Button>
    </Form>
  );
};

export default SearchBox;
