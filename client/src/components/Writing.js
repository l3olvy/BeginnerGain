import React, { useState, useEffect, useCallback } from 'react';
import '../css/Components.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import Axios from 'axios';

const editorConfiguration = {
	simpleUpload: {uploadUrl: '/upload'},
	toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo']
};

function Writing(props) {
	const [post, setPost] = useState(props.location.state ? props.location.state : JSON.parse(localStorage.getItem('prev')));
	const [title,setTitle] = useState('');
	const [contents,setContent] = useState('');
	const [tag, setTag] = useState('');
	const onTitleHandler = (event) => {setTitle (event.currentTarget.value);}
	const onTagHandler = (event) => {setTag (event.currentTarget.value); }
	const [user, setUser] = useState();

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
		if (post.name === "QNA")
			setTag(post.tag);
		else
			setTag(post.category);
	}, [post.title, post.contents, post.tag, post.category, post.name]);




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

			if (post.name === "QNA") {
				Axios.post('http://localhost:8000/board/updateqna', {
					idx: idx,
					title: title,
					contents: contents,
					tag: tag
				}).then(() => {
					alert("수정 되었습니다!");
					props.history.push(`/${props.match.params.name}`);
				})
			} else if (post.name === "TALK") {
				Axios.post('http://localhost:8000/board/updatetalk', {
					idx: idx,
					title: title,
					contents: contents,
					tag: tag
				}).then(() => {
					alert("수정 되었습니다!");
					props.history.push(`/${props.match.params.name}`);
				})
			}
		}
	}

	const handleCkeditorState = (event, editor) => {
		const data = editor.getData();
		setContent(data);
	}

	const onSubmitHandler = (event) => {
		if (props.match.params.name === "qna") {
			Axios.post('http://localhost:8000/board/writing_qna', {
				writer: user,
				title: title,
				contents: contents,
				img: null,
				tag: tag,
				hit: 0
			}).then((res) => { alert("작성 되었습니다.");
			///////////qboard-tag 서로 idx 맞춰야함  - 그래야 삭제 가능
				const tagS = tag.split(';', 3);
		        Axios.post('http://localhost:8000/board/writing_qnatag', {
		            tag1:tagS[0],
		            tag2:tagS[1],
		            tag3:tagS[2]
		        }).then((res) => {console.log(tagS);} );
				props.history.push(`/${props.match.params.name}`);
			}).catch((error) => { console.log(error) });

		} else if (props.match.params.name === "talk") {
			Axios.post('http://localhost:8000/board/writing_talk', {
				writer: user,
				title: title,
				contents: contents,
				img: null,
				category: tag,
				hit: 0
			}).then((res) => { alert("작성 되었습니다.");
			props.history.push(`/${props.match.params.name}`); })
			.catch((error) => { console.log(error) });
		}
	}

	const wtobBtnHandler = (event) => {
		props.history.push(`/${props.match.params.name}`)
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
	            <input className="tag-input" type='text' onChange={onTagHandler} name = 'tag' value={tag}/>
	        </div>
	            {(post) ? <button className="modify-button" onClick={updateBtn} comment-idx={post.idx}>수정</button> : <button className="submit-button" onClick={onSubmitHandler} >작성</button>}
        		<button className="toboard" onClick={wtobBtnHandler} >목록으로</button>
        </div>
	);
}

export default Writing;