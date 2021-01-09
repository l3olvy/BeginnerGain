import React from "react";
import { Link } from "react-router-dom";
import "../css/Menu.css";

function News(props) {
  return (
    <div className="menu__container">
      <Link to="/writing"><button>작성</button></Link>
    </div>
  );
}

export default News;