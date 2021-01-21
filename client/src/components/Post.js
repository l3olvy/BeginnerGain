import React, { useState, useEffect } from 'react';
import '../css/Components.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import striptags from 'striptags';
import Axios from 'axios';


const editorConfiguration = {
    simpleUpload: { uploadUrl: '/upload'},
    toolbar:[ 'heading', '|', 'bold', 'italic',  '|', 
           'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 
           'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo' ]
};


function Post(props) {   
    const [post, setPost] = useState(props.location.state ? props.location.state : JSON.parse(localStorage.getItem('prev')));
    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState('');

   	useEffect(()=>{
      	if(props.location.state !== undefined){
         	localStorage.setItem("prev", JSON.stringify(props.location.state));
      	}
      	loadComment();
    }, []) 

    const loadComment = async () => {
        const idx = post.idx;
         	if(post.name === "QNA"){
          	Axios.post('http://localhost:8000/board/getqna_c', {
               	idx: idx
           	}).then((response)=>{
              	setComment(response.data);
           		})
        	}
         	else if(post.name === "TALK"){
           		Axios.post('http://localhost:8000/board/gettalk_c', {
               		idx: idx
           		}).then((response)=>{
               	setComment(response.data);
           		})
       		}
    }

    const delBtn =  (e) => {
         if(window.confirm("삭제하시겠습니까?")){
            const idx = e.target.getAttribute('post-idx');
            if(post.name === "QNA"){
               	Axios.post('http://localhost:8000/board/deleteqna', {
                       idx : idx
                  	}).then(() => {
                       props.history.push("/qna")
                       alert("삭제 되었습니다!");
                    })
                }
                else if(post.name === "TALK"){
                  Axios.post('http://localhost:8000/board/deletetalk', {
                     idx : idx
                  }).then(() => {
                       props.history.push("/talk")
                       alert("삭제 되었습니다!");
                  })
                }
           }
        }

    const delBtn_c =  (e) => {
     if(window.confirm("삭제하시겠습니까?")){
        const idx = e.target.getAttribute('comment-idx');
        if(post.name === "QNA"){
           Axios.post('http://localhost:8000/board/deleteqna_c', {
                   idx : idx
              }).then(() => {
                   alert("삭제 되었습니다!");
                })
            }
            else if(post.name === "TALK"){
              Axios.post('http://localhost:8000/board/deletetalk_c', {
                 idx : idx
              }).then(() => {
                   alert("삭제 되었습니다!");
              })
            }
       }
       loadComment();
    }   


    const handleCkeditorState = (event, editor) =>{
        const data = editor.getData();
        setComments(data);
    }
    const onSubmitHandler = (event) => {
        if(post.name === "QNA"){
            Axios.post('http://localhost:8000/board/postqna',
            { bid:post.idx, 
              writer:"writer", 
              contents:comments, 
              img:null, 
              good:8
            }).then((res) => {alert("작성 되었습니다."); loadComment(); })
           .catch((error) => {console.log(error)} ); 
        }    
        else{
            Axios.post('http://localhost:8000/board/posttalk',
            { bid:post.idx, 
              writer:"writer", 
              contents:comments, 
              img:null, 
              good:8
            }).then((res) => {alert("작성 되었습니다."); loadComment(); })
           .catch((error) => {console.log(error)} ); 
        }       
    }

    const onptbHandler = (event) => {
        if(post.name === "TALK")
            props.history.push("/talk")
        else
            props.history.push("/qna")
    }


   return(
      <div className="Post">
         <div className='form-wrapper'>
            <div className="question-header">
               <p className="bolder">{post.title}</p>
            </div>
            <div className="grid">
               <div>
                  <span>Asked</span>
                  <time>{post.rdate}</time>
               </div>
               <div>
                  <span>Viewed</span>
                  {post.hit} times
                  </div>
                  <div className="writer">
                  <button className="modifyBtn" > 수정 </button>
                  <button className="deleteBtn" onClick={delBtn} post-idx={post.idx}> 삭제 </button>
                  </div>
            </div>
         <br/>
         <hr />
         <div className="question-body">
            <div className="selctContents" dangerouslySetInnerHTML={ {__html: post.contents} }></div>
            <div className="user-info">
               asked <span>{post.rdate}</span>
               <span>{post.writer}</span>
            </div>               
         </div>
         <br/>
         <hr/>
         
         <p className="bold">답변</p>
         {comment.map(element =>(
            <div className="question-answer">
               <p dangerouslySetInnerHTML={ {__html: element.contents} } ></p>                    
               <div className="user-info">   
                  <button className="modifyBtn"> 수정 </button>
                  <button className="deleteBtn" onClick={delBtn_c} comment-idx={element.idx}> 삭제 </button>
                  answered <span>{element.cdate}</span>
                  <span>{element.writer}</span>
               </div>
               <br/>   
            </div>
         ))}
         
        <p className="bold">댓글작성</p>
          	<CKEditor
                editor={ Editor }
                config={ editorConfiguration }
                onReady={ editor => { console.log( 'Editor is ready to use!', editor );} }
                onChange={ handleCkeditorState }    
                name={comments}
            />
            <div>
                <button className="submit-button" onClick={onSubmitHandler} >작성</button>
                <button className="posttoboard" onClick={onptbHandler}>목록으로</button>
            </div>

      </div>
   </div>
   );
}


export default Post; 