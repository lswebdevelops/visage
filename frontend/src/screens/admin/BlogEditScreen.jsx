import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateBlogMutation,
  useGetBlogDetailsQuery,
  useUploadBlogImageMutation,
} from "../../slices/blogsApiSlice";

const BlogEditScreen = () => {
  const { id: blogId } = useParams();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");

  const {
    data: blog,
    isLoading,
    error,
  } = useGetBlogDetailsQuery(blogId);

  const [updateBlog, { isLoading: loadingUpdate }] =
    useUpdateBlogMutation();

  const [uploadBlogImage, { isLoading: loadingUpload }] =
    useUploadBlogImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);      
      setImage(blog.image);     
      setAuthor(blog.author);
      setContent(blog.content);
    }
  }, [blog]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedBlog = {
      blogId,
      title,
      image,
      author,
      content,
    };

    const result = await updateBlog(updatedBlog);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Blog updated");
      navigate("/admin/bloglist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadBlogImage(formData).unwrap();
      toast.success(res.message);

      // Normalize the path to always use forward slashes
      const imageUrl = res.image.replace(/\\/g, "/");
      setImage(imageUrl); // Set the normalized image URL
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/bloglist" className="btn btn-light my-3">
        Voltar
      </Link>
      <FormContainer>
        <h1>Editar Blog</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></Form.Control>
            </Form.Group>

           

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Imagem</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escolha arquivo"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                label="Escolha arquivo"
                onChange={uploadFileHandler}
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>
            
           

            <Form.Group controlId="author" className="my-2">            
              <Form.Label>Autor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do autor"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="content" className="my-2">
              <Form.Label>Conteúdo</Form.Label>
              <Form.Control
                type="text"
                as="textarea"
                rows={5}
                placeholder="Digite o conteúdo de seu blog"
                value={content}
                maxLength="2000"
                onChange={(e) => setContent(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Button type="submit" variant="primary" className="my-2">
              Salvar
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default BlogEditScreen;
