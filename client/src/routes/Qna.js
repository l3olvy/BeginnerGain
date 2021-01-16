import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import "../css/Menu.css";
import Axios from 'axios';

function Qna(props) {

  const [viewContent, setViewContent] = useState([]);

  useEffect(()=>{
    Axios.get('http://localhost:8000/board/getqna').then((response)=>{
      setViewContent(response.data);
    })
  }, []) 

  return (
    <div className="menu__container">
		<Board viewContent = {viewContent} name="QNA" />
    </div>
  );
}

export default Qna;