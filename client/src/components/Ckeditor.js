import React, {useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';


const editorConfiguration = {

    simpleUpload: {
      uploadUrl: '/upload'
    },
    toolbar: [ 'heading', '|', 'bold', 'italic',  '|', 
    'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 
    'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo' ]
};

function Ckeditor(props) {


const [content, setContent] = useState('');
  
const handleCkeditorState =(event, editor) =>{
  const data = editor.getData();
  setContent (data); 
  console.log(data);
}

return (       
        <CKEditor
            editor={ Editor }
            config={ editorConfiguration }
            //data="<p>Hello from CKEditor 5!</p>"
            onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ handleCkeditorState }              
        />  
        //<Writing text={data}> <Writing/>
    );
}

export default Ckeditor;
