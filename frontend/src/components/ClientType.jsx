import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const ClientType = ({ clientType }) => {
  return (
    <Card className="my-3 p-3 rounded ClientTypes-keyframe">
      <Link to={`/clientType/${clientType._id}`}></Link>
      <Card.Body>
        <Link to={`/clientType/${clientType._id}`}>
          <Card.Title
            as="div"
            className="home-screen-client-inside-box"
          >
            <strong>{clientType.name}</strong> { "-"}     
            <strong>{clientType.category}</strong> 
            {/* <strong>{clientType.brand}</strong> */}
            <hr />
            <p>{clientType.description}</p>
          </Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default ClientType;
