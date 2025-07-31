import { Link } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message";
import Loader from "../../components/Loader";

import {
  useGetBlogsQuery,
  useCreateBlogMutation,  
  useDeleteBlogMutation,
} from "../../slices/blogsApiSlice";
import { toast } from "react-toastify";

const BlogListScreen = () => {
  const { pageNumber } = useParams();
  const { data, isLoading, error, refetch } = useGetBlogsQuery({
    pageNumber,
  });

  const [createBlog, { isLoading: loadingCreate }] = useCreateBlogMutation();

  const [deleteBlog, { isLoading: loadingDelete }] = useDeleteBlogMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteBlog(id);
        toast.success("Blog deleted");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const createBlogHandler = async () => {
    if (!window.confirm("Tem certeza de que deseja  um novo blog?")) {
      return;
    }
    try {
      await createBlog();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Lista de blogs</h1>
        </Col>
        <Col className="text-end">
          <Button onClick={createBlogHandler} className="btn-sm m-3">
            <FaEdit />
            &nbsp; Criar Blog
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message>{error.data.message}</Message>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>Código</th>
                <th>Título</th>
                <th>Autor</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.blogs.map((blog) => (
                <tr key={blog._id}>
                  <td>{blog._id}</td>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>

                  <td>
                    <Link to={`/admin/blog/${blog._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-2">
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(blog._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default BlogListScreen;
