import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Blog = ({ blog }) => {
  const truncateContent = (content, maxWords) => {
    const words = content.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : content;
  };

  return (
    <Card className="my-6 p-6" style={{ borderRadius: 0 }}>
      {/* Remove noGutters to see if it resolves the warning */}
      <Row>
        <Col md={6}>
          <Link to={`/blog/${blog._id}`}>
            <Card.Img
              src={blog.image}
              variant="top"
              className="img-fluid"
              style={{ borderRadius: 0 }}
            />
          </Link>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center">
          <Card.Body>
            <Link to={`/blog/${blog._id}`}>
              <Card.Title as="div">
                <p className="blog-author-blog-genetal mb-1">{blog.author}</p>
                <p className="blog-createdAt-blog-genetal mb-1">
                  {format(new Date(blog.createdAt), "d 'de' MMMM, yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <p className="blog-title-blog-genetal mb-1 font-weight-bold">
                  {blog.title}
                </p>
                <p className="blog-content-blog-genetal text-muted">
                  {truncateContent(blog.content, 15)}
                </p>
              </Card.Title>
            </Link>
          </Card.Body>
        </Col>
      </Row>
      <br />
    </Card>
  );
};

export default Blog;
