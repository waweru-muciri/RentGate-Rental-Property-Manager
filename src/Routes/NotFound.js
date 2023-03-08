import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: "center" }}>
    <h1>404 - Not Found!</h1>
    <p>
      <Link to="/app/">Go to Home </Link>
    </p>
  </div>
);

export default NotFound;