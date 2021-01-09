import React from 'react';
import '../css/Components.css';
import Ckeditor from "./Ckeditor";
import { Link } from "react-router-dom";

class Writing extends React.Component {

  render(){
    return (
        <div className="Writing">
            <p className="bolder">Ask a public question</p>
            <div className='form-wrapper'>
                <p className="bold">제목</p>
                <input className="title-input" type='text' />
                <p className="bold">내용</p>
                <Ckeditor />
                <p className="bold">태그</p>
                <input className="tag-input" type='text' />
            </div>
            <Link to="/post">
                <button className="submit-button">작성</button>
            </Link>  
        </div>
    );
  }
}

export default Writing;
