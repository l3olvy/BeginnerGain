import React, {useState, useEffect} from 'react';
import '../css/Components.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import Axios from 'axios';


const editorConfiguration = {
  simpleUpload: {
    uploadUrl: '/upload'
  },
  toolbar: [ 'heading', '|', 'bold', 'italic',  '|', 
  'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 
  'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo' ]
};

function Writing(props) {
    const [post, setPost] = useState(props.location.state ? props.location.state : JSON.parse(localStorage.getItem('prev')));
    const [title,setTitle] = useState('');
    const [contents,setContent] = useState('');
    const [tag, setTag] = useState('');
    const onTitleHandler = (event) => {setTitle (event.currentTarget.value);}
    const onTagHandler = (event) => {setTag (event.currentTarget.value); }
    
    useEffect(()=>{
      if(props.location.state !== undefined){
         localStorage.setItem("prev", JSON.stringify(props.location.state));
      }
           }, []) 

    const handleCkeditorState =(event, editor) =>{
        const data = editor.getData();
        setContent (data); 
    }

    const onSubmitHandler = (event) => {      
        Axios.post('http://localhost:8000/board/writing',
        { writer:"wwwww",
          title: title,
          contents: contents,
          img: null,
          tag: tag,
          hit: 0
        }).then((res) => {alert("작성 되었습니다."); props.history.push(`/${props.match.params.name}`);})
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
            <button className="submit-button" onClick={onSubmitHandler} >작성</button>

        </div>
    );

}

export default Writing;
