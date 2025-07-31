import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const TrainingType = ({ trainingType }) => {
  return (
    <Card className="my-3 p-3 rounded TrainingTypes-keyframe">
      <Link to={`/trainingType/${trainingType._id}`}></Link>
      <Card.Body>
        <Link to={`/trainingType/${trainingType._id}`}>
          <Card.Title
            as="div"
            className="home-screen-training-inside-box"
          >
            <strong>{trainingType.name}</strong> { "-"}     
            <strong>{trainingType.category}</strong> 
            {/* <strong>{trainingType.brand}</strong> */}
            <hr />
            <p>{trainingType.description}</p>
          </Card.Title>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default TrainingType;
