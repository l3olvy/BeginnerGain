import React, {useState} from 'react';
import '../css/Components.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Link, Router } from "react-router-dom";
import Axios from 'axios';
//import ReactHtmlParser from 'node-html-parser';


const editorConfiguration = {
  simpleUpload: {
    uploadUrl: '/upload'
  },
  toolbar: [ 'heading', '|', 'bold', 'italic',  '|', 
  'link', 'blockquote', 'code', 'ckfinder', 'imageupload', 'codeblock', '|', 
  'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo' ]
};

function Writing(props) {
    
    const [title,setTitle] = useState('');
    const [contents,setContent] = useState('');
    const [tag, setTag] = useState('');
    const onTitleHandler = (event) => {setTitle (event.currentTarget.value); console.log(title);}
    const onTagHandler = (event) => {setTag (event.currentTarget.value); console.log(tag);}
  

    const handleCkeditorState =(event, editor) =>{
        const data = editor.getData();
        setContent (data); 
        console.log(data);
    }

    const onSubmitHandler = (event) => {
        console.log(contents);
        console.log(title);
        console.log(tag);
        Axios.post('http://localhost:8000/board/writing',
        { writer:"wwwww",
          title: title,
          contents: contents,
          img: null,
          tag: tag,
          hit: 0,
          rdate: null
        }).then((res) => {alert("작성 되었습니다."); props.history.push("/post"); })
       .catch((error) => {console.log(error)} ); }
    
    return (
        <div className="Writing">
            <p className="bolder">Ask a public question</p>
            <div className='form-wrapper'>
                <p className="bold">제목</p>
                <input className="title-input" type='text' onChange={onTitleHandler} name = 'title'/>
                <p className="bold">내용</p>                
                <CKEditor
            editor={ Editor }
            config={ editorConfiguration }
            //data="<p>Hello from CKEditor 5!</p>"
            onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ handleCkeditorState }    
            name = 'contents'          
        /> 

                <p className="bold">태그</p>
                <input className="tag-input" type='text' onChange={onTagHandler} name = 'tag'/>
            </div>
            {/*<Link to="/post">*/}
                <button className="submit-button" onClick={onSubmitHandler} >작성</button>
              
        </div>
    );

}


export default Writing;
