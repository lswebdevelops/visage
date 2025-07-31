import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useGetBlogDetailsQuery,
  useAddCommentToBlogMutation,
} from "../slices/blogsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Row, Col, Image, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const BlogDetailsScreen = () => {
  const { id } = useParams();
  const { data: blog, isLoading, error, refetch } = useGetBlogDetailsQuery(id);
  const userInfo = useSelector((state) => state.auth.userInfo);


  const [comment, setComment] = useState("");
  const [addComment] = useAddCommentToBlogMutation();

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("O comentário não pode estar vazio!");
      return;
    }

    try {
      await addComment({ blogId: id, content: comment }).unwrap();
      toast.success("Comentário adicionado!");
      setComment(""); // Limpar campo após envio
      refetch(); // Atualiza os comentários
    } catch (error) {
      toast.error(error?.data?.message || "Erro ao adicionar comentário");
    }
  };

  return (
    <div>
       <Link className="btn btn-light my-3" to="/blogs">
          Voltar
        </Link>
      <div className="comment-form-container-div">
       

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div>
            <div className="container-blog-details-div">
              <Row className="d-flex flex-column align-items-center text-center container-blog-details">
                <h3 className="blog-title text-center">{blog.title}</h3>

                <Col
                  xs={12}
                  md={8}
                  lg={6}
                  className="d-flex justify-content-center"
                >
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    className="image-blog img-fluid rounded"
                  />
                </Col>

                <Col xs={12} md={10} lg={8} className="blog-text-container">
                  <p className="blog-content">{blog.content}</p>
                  <h4 className="blog-author">{blog.author}</h4>
                </Col>
              </Row>
            </div>
            <hr />

            {/* Seção de Comentários */}
            <div className="comments-section-container">
              <Row className="comments-section">
                <Col md={8}>
                  <h4 className="comments-title">Comentários</h4>
                  {blog.comments && blog.comments.length > 0 ? (
                    <ul className="comments-list">
                      {blog.comments.map((comment, index) => (
                        <li key={index} className="comment-item">
                          <p className="comment-author">
                            {new Date(comment.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                          <p className="comment-content">{comment.content}</p>
                          <small className="comment-author">
                            Comentado por:{" "}
                            {comment.user?.name
                              ? comment.user.name.split(" ")[0]
                              : "Ex-usuário"}
                          </small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Message variant="secondary" className="no-comments">
                      Nenhum comentário ainda.
                    </Message>
                  )}
                </Col>
              </Row>
            </div>
            {/* Formulário para adicionar comentário */}
            <Row className="comment-form">
              <Col md={8}>
                {userInfo ? ( // Verifica se o usuário está logado
                  <div>
                    <h4>Deixe um comentário</h4>
                    <Form onSubmit={submitCommentHandler}>
                      <Form.Group controlId="comment">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Escreva seu comentário..."
                          className="comment-textarea"
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="primary"
                        className="comment-submit-btn"
                      >
                        Enviar
                      </Button>
                    </Form>
                  </div>
                ) : (
                  <Message variant="warning">
                    Você precisa estar logado para comentar.{" "}
                    <Link to="/login" className="btn btn-link">
                      Faça login aqui
                    </Link>
                  </Message>
                )}
              </Col>
            </Row>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetailsScreen;
