import { Row, Col } from "react-bootstrap";
import { useGetBlogsQuery } from "../slices/blogsApiSlice";
import Blog from "../components/Blog";
import Loader from "../components/Loader";
import Message from "../components/Message";

const BlogScreen = () => {
  const { data, isLoading, error } = useGetBlogsQuery();
  
  
  return (
    <div className="blogHomeScreenContainer">   
    <div className="blogHomeScreen">    
 
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className="clientTypesPageH1">Blog</h1>
          <Row>
            {data.blogs.map((blog) => (
              <Col key={blog._id} sm={12} md={12} lg={12} xl={12}>
                <Blog blog={blog} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
    </div>
  );
};

export default BlogScreen;
