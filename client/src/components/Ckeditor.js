import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

const editorConfiguration = {
    simpleUpload: {
      uploadUrl: '/upload'
    },
    toolbar: [ 'heading', '|', 'bold', 'italic',  '|', 
    'link', 'blockquote', 'code', 'ckfinder', 'imageupload', 'codeblock', '|', 
    'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo' ]
};


class Ckeditor extends React.Component {
  state = {
    content: ''
  }

  handleCkeditorState =(event, editor) =>{
    const data = editor.getData();
    this.setState({
      content: data
    })
    console.log(data);
  }

  render(){
    return (
        <CKEditor
            editor={ Editor }
            config={ editorConfiguration }
            //data="<p>Hello from CKEditor 5!</p>"
            onReady={ editor => {
            // You can store the "editor" and use when it is needed.
            console.log( 'Editor is ready to use!', editor );
            } }
            onChange={ this.handleCkeditorState }
              
        /> 
    );
  }
}

export default Ckeditor;
