import React, { useState, useEffect, useCallback } from 'react';
import '../css/Components.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import Axios from 'axios';
import TagBox from "./TagBox";

const editorConfiguration = {
   simpleUpload: {uploadUrl: '/upload'},
   toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo']
};

function Writing(props) {
	const [post, setPost] = useState(props.location.state ? props.location.state : JSON.parse(localStorage.getItem('prev')));
	const [title,setTitle] = useState('');
	const [contents,setContent] = useState('');
	const [tag, setTag] = useState([]);
	const onTitleHandler = (event) => {setTitle (event.currentTarget.value);}
	//const onTagHandler = (event) => {setTag (event.currentTarget.value); }
	const [user, setUser] = useState();

	Axios.defaults.withCredentials = true;
	const getUser = useCallback(() => {
		Axios.get("http://localhost:8000/login").then((res) => {
			if(res.data.loggedIn === true) {
				setUser(res.data.user[0].id);
			}
		});
	}, []);

	const loadPrevData = useCallback((e) => {
		setTitle(post.title);
		setContent(post.contents);
	}, []);

	useEffect(() => {
		getUser();
		if (props.location.state !== undefined) {
			localStorage.setItem("prev", JSON.stringify(props.location.state));
		}
		if (props.match.params.idx !== undefined) {
			loadPrevData();
		} else {
			reset();
		}
	}, [getUser, loadPrevData, props.location.state, props.match.params.idx])

	const reset = (e) => {
		setPost('');
		setTitle('');
		setTag('');
	}

	const updateBtn = (e) => {
		if (window.confirm("수정하시겠습니까?")) {
			const idx = e.target.getAttribute('comment-idx');

			if (post.name === "qna") {
				Axios.post('http://localhost:8000/board/updateqna', {
					idx: idx,
					title: title,
					contents: contents,
					tag: tag[0]+" "+tag[1]+" "+tag[2]
				}).then(() => {
					alert("수정 되었습니다!");
					Axios.post('http://localhost:8000/board/update_tag', {
						idx: idx,
			            tag1:tag[0],
			            tag2:tag[1],
			            tag3:tag[2]
			        }).then((res) => {console.log(tag);} );
					props.history.push(`/${props.match.params.name}`);
				}).catch((error) => { console.log(error) });

			} else if (post.name === "talk") {
				Axios.post('http://localhost:8000/board/updatetalk', {
					idx: idx,
					title: title,
					contents: contents,
					tag: tag[0]+" "+tag[1]+" "+tag[2]
				}).then(() => {
					alert("수정 되었습니다!");
					Axios.post('http://localhost:8000/board/update_category', {
						idx: idx,
			            category1:tag[0],
			            category2:tag[1],
			            category3:tag[2]
			        }).then((res) => {console.log(tag);} );
					props.history.push(`/${props.match.params.name}`);
				}).catch((error) => { console.log(error) });
			}
		}
	}

	const handleCkeditorState = (event, editor) => {
		const data = editor.getData();
		setContent(data);
	}

	const onSubmitHandler = (event) => {
		if(title.length === 0)
			alert("제목을 입력해주세요.");
		else if(contents.length === 0)
			alert("내용을 입력해주세요.");
		else{
			if (props.match.params.name === "qna") {
				Axios.post('http://localhost:8000/board/writing_qna', {
					writer: user,
					title: title,
					contents: contents,
					img: null,
					tag: tag[0]+" "+tag[1]+" "+tag[2],
					hit: 0
				}).then((res) => { alert("작성 되었습니다.");
				///////////qboard-tag 서로 idx 맞춰야함  - 그래야 삭제 가능 //나중에 두명 동시 작성 확인해보기
			        Axios.post('http://localhost:8000/board/writing_tag', {
			            tag1:tag[0],
			            tag2:tag[1],
			            tag3:tag[2]
			        }).then((res) => {console.log(tag);} );
					props.history.push(`/${props.match.params.name}`);
				}).catch((error) => { console.log(error) });

			} else if (props.match.params.name === "talk") {
				Axios.post('http://localhost:8000/board/writing_talk', {
					writer: user,
					title: title,
					contents: contents,
					img: null,
					category: tag[0]+" "+tag[1]+" "+tag[2],
					hit: 0
				}).then((res) => { alert("작성 되었습니다.");
				///////////qboard-tag 서로 idx 맞춰야함  - 그래야 삭제 가능 //나중에 두명 동시 작성 확인해보기
			        Axios.post('http://localhost:8000/board/writing_category', {
			            category1:tag[0],
			            category2:tag[1],
			            category3:tag[2]
			        }).then((res) => {console.log(tag);} );
					props.history.push(`/${props.match.params.name}`);
				}).catch((error) => { console.log(error) });
			}	
		}
	}

	const wtobBtnHandler = (event) => {
		props.history.push(`/${props.match.params.name}`)
	}

	const setOnTag = (tagset) =>{
		setTag(tagset);
	}

	return (
		<div className="Writing">
			<p className="bolder">Ask a public question</p>
			<div className='form-wrapper'>
				<p className="bold">제목</p>
				<input className="title-input" type='text' onChange={onTitleHandler} name='title' value={title}/>
				<p className="bold">내용</p>                
				<CKEditor
					editor={ Editor }
					config={ editorConfiguration }
					data= {contents}
	                onChange={ handleCkeditorState }    
	                name = 'contents'          
		        /> 
		        <p className="bold">태그</p>
		        {props.location.state ?
		        <TagBox change={setOnTag} ex_tags={post.tag.split(' ')} name={props.match.params.name}/>
		        :
		        <TagBox change={setOnTag} name={props.match.params.name}/>
		    	}
	            {/*<input className="tag-input" type='text' onChange={onTagHandler} name = 'tag' value={tag} placeholder="태그는 3개 제한 입니다."/>*/}
	        </div>
	            {(post) ? <button className="modify-button" onClick={updateBtn} comment-idx={post.idx}>수정</button> : <button className="submit-button" onClick={onSubmitHandler} >작성</button>}
        		<button className="toboard" onClick={wtobBtnHandler} >목록으로</button>
        </div>
   );
}

export default React.memo(Writing);