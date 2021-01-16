import React from 'react';
import '../css/Components.css';
//import { Link } from "react-router-dom";
import Ckeditor from "./Ckeditor";
import Axios from 'axios';

class Post extends React.Component {
   state = {
       state: this.props.location.state ? this.props.location.state : JSON.parse(localStorage.getItem('object'))
   }
   componentDidMount() {
       if(this.props.location.state!==undefined)
          localStorage.setItem("object", JSON.stringify(this.props.location.state));
   }

   render(){
      const { state } = this.state;
      let title = state ? state.title : "";
       let rdate = state ? state.rdate : "";
       let hit = state ? state.hit :0;
       let contents = state ? state.contents : "";
       let writer = state ? state.writer : "";
       let idx = state ? state.idx :0;
      let name = state ? state.name : "";

       const delBtn = (e) => {
        if(window.confirm("삭제하시겠습니까?")){
          const idx = e.target.getAttribute('data-idx');
          if(name === "QNA"){
            Axios.post('http://localhost:8000/board/deleteqna', {
              idx : idx
            }).then(() => {
              this.props.history.push("/qna")
              alert("삭제 되었습니다!");
            })
          }
          else if(name === "TALK"){
            Axios.post('http://localhost:8000/board/deletetalk', {
            idx : idx
            }).then(() => {
              this.props.history.push("/talk")
              alert("삭제 되었습니다!");
            })
          }
        }
      }
      return (
         <div className="Post">
            <div className='form-wrapper'>
               <div className="question-header">
                  <p className="bolder">{title}</p>
               </div>
               <div className="grid">
                  <div>
                     <span>Asked</span>
                     <time>{rdate.slice(0,10)}</time>
                  </div>
                  <div>
                     <span>Viewed</span>
                     {hit} times
                  </div>
                  <div className="writer">
                  <button className="modifyBtn"> 수정 </button>
                  <button className="deleteBtn" onClick={delBtn} data-idx={idx} data-name={name}> 삭제 </button>
                  </div>
               </div>
               <br/>
               <hr />
               <div className="question-body">
                  <p>{contents}</p>
                  <div class="user-info">
                      asked <span>{rdate}</span>
                          <span>{writer}</span>
                  </div>               
               </div>
               <br/>
               <hr/>
               
               <p className="bold">2개의 답변</p>
               <div className="question-answer">
                      <p>네 안 됩니다!<br/>수고염^-^</p>                    
                  <div class="user-info">   
                       <button className="modifyBtn"> 수정 </button>
                     <button className="deleteBtn"> 삭제 </button>
                      answered <span>20.01.09 15:17</span>
                          <span>송고은</span>
                  </div>   
                  </div>
                  <br/>
                  <hr/>
                  <div className="question-answer">
                      <p>졸업은 해야죠..<br/>힘내셈 아자아자^^</p>                   
                  <div class="user-info">
                     <button className="modifyBtn"> 수정 </button>
                     <button className="deleteBtn"> 삭제 </button>
                      answered <span>20.01.09 15:20</span>
                          <span>임수빈</span>
                  </div>   
                  </div>
                  <br/>
                  <hr/>
                  <p className="bold">답변</p>
                  <Ckeditor />
                  <button className="submit-button">작성</button>
              </div>
           </div>
      );
   }
}

export default Post; 