import React, { useState, useEffect, useCallback } from 'react';
import '../css/Components.css';
import Axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Link } from "react-router-dom";
import Prism from "../lib/PrismImport";

const editorConfiguration = {
    simpleUpload: { uploadUrl: '/upload'},
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo']
};




function Post(props) {
    const [post] = useState(props.location.state ? props.location.state : JSON.parse(localStorage.getItem('prev')));
    const [comment, setComment] = useState([]);
    const [mod, setMod] = useState('');
    const [mode, setMode] = useState(false);
    const [modIdx, setModIdx] = useState('');
    const [commentnum, setCommentnum] = useState(0);
    const [postcommentN, setpostCommentN] = useState(0);
    const [user, setUser] = useState();

    const getUser = useCallback(() => {
        Axios.get("http://localhost:8000/login").then((res) => {
            if(res.data.loggedIn === true) {
                setUser(res.data.user[0].id);
            }
        });
    }, []);

    const loadComment = useCallback( async () => {
        const idx = post.idx;
        if (post.name === "qna") {
            Axios.post('http://localhost:8000/board/getqna_c', {
                idx: idx
            }).then((response) => {
                setComment(response.data);
                Prism();
            })
            Axios.post('http://localhost:8000/board/getqna_total', {
                idx: idx
            }).then((response) => {
                 setCommentnum(response.data[0].Total);
            })
        } else if (post.name === "talk") {
            Axios.post('http://localhost:8000/board/gettalk_c', {
                idx: idx
            }).then((response) => {
                setComment(response.data);
                Prism();
            })
            Axios.post('http://localhost:8000/board/gettalk_total', {
                idx: idx
            }).then((response) => {
                 setCommentnum(response.data[0].Total);
            })
        }
    }, [post.idx, post.name]);

    useEffect(() => {
    	if (post.name === "qna") {
	  		Axios.post('http://localhost:8000/board/getqHit',{
	         idx: post.idx,
	         hit: post.hit+1
	      	}).then((response) => {})
        } else if (post.name === "talk") {
			Axios.post('http://localhost:8000/board/gettHit',{
	         idx: post.idx,
	         hit: post.hit+1
	      	}).then((response) => {})
		}
        setpostCommentN(post.commentN);
	}, []);
    
    useEffect(() => {
        getUser();
        Prism();
        if (props.location.state !== undefined) {
            localStorage.setItem("prev", JSON.stringify(props.location.state));
        }

        loadComment();
    }, [getUser, loadComment, props.location.state])


    const delBtn = (e) => {
        if (window.confirm("삭제하시겠습니까?")) {
            const idx = e.target.getAttribute('post-idx');
            if (post.name === "qna") {
                Axios.post('http://localhost:8000/board/deleteqna', {
                    idx: idx
                }).then(() => {
                    props.history.push("/qna")
                    alert("삭제 되었습니다!");
                })
            } else if (post.name === "talk") {
                Axios.post('http://localhost:8000/board/deletetalk', {
                    idx: idx
                }).then(() => {
                    props.history.push("/talk")
                    alert("삭제 되었습니다!");
                })
            }
        }
    }

    const delBtn_c = (e) => {
        if (window.confirm("삭제하시겠습니까?")) {
            const idx = e.target.getAttribute('comment-idx');
            if (post.name === "qna") {
                Axios.post('http://localhost:8000/board/deleteqna_c', { idx: idx })
                Axios.post('http://localhost:8000/board/deleteqna_cN', {
                   idx: post.idx,
                   commentN: (postcommentN-1)
               }).then((response) => { loadComment(); })
            } else if (post.name === "talk") {
                Axios.post('http://localhost:8000/board/deletetalk_c', { idx: idx })
                Axios.post('http://localhost:8000/board/deletetalk_cN', {
                   idx: post.idx,
                   commentN: (postcommentN-1)
               }).then((response) => { loadComment(); })
         	alert("삭제 되었습니다!");
            }
            setpostCommentN(postcommentN-1);
		}
    }

    const modBtn_c = (e) => {
        setMode(true);
        setMod(e.target.getAttribute('comment-contents'));
        setModIdx(e.target.getAttribute('comment-idx'));
    }

    const updateBtn_c = (e) => {
        if (window.confirm("수정하시겠습니까?")) {
            const idx = modIdx;
            if (post.name === "qna") {
                Axios.post('http://localhost:8000/board/updateqna_c', {
                    idx: idx,
                    contents: mod
                }).then(() => { loadComment(); })
            } else if (post.name === "talk") {
                Axios.post('http://localhost:8000/board/updatetalk_c', {
                    idx: idx,
                    contents: mod
                }).then(() => { loadComment(); })
            }
            alert("수정 되었습니다!");
        }
        setMod('');
        setMode(false);
    }

    const handleCkeditorState = (event, editor) => {
        const data = editor.getData();
        setMod(data);
    }

    const onSubmitHandler = (event) => {
        if(mod.length !== 0){
            setCommentnum(post.commentN+1);
            if (post.name === "qna") {
                Axios.post('http://localhost:8000/board/postqna', {
                    bid: post.idx,
                    writer: user,
                    contents:mod,
                    img: null,
                    good: 8,
                    commentN: (postcommentN+1)
                }).then(() => {
                    loadComment();
                })
                .catch((error) => { console.log(error) });
            } else {
                Axios.post('http://localhost:8000/board/posttalk', {
                    bid: post.idx,
                    writer: user,
                    contents:mod,
                    img: null,
                    good: 8,
                    commentN: (postcommentN+1)
                }).then(() => {
                    loadComment();
                })
                .catch((error) => { console.log(error) });
            }
            alert("작성 되었습니다.");
            setpostCommentN(postcommentN+1);
            setMod('');
            loadComment();     
        }else{
            alert("댓글을 입력해주세요.");
        }
    }

    const onptbHandler = (event) => {
        if (post.name === "talk")
            props.history.push("/talk")
        else
            props.history.push("/qna")
    }

    return (
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
                        {post.hit+1} times
                    </div>
                    {(props.id === post.writer) && //로그인 한 사람이 글 작성자라면 글 삭제 및 수정 가능
                    <div className="writer">
                        <Link
                        to={{
                           pathname : `/${props.match.params.name}/modify/${post.idx}`,
                           state: {
                                key : post.idx,
                                idx : post.idx,
                                title : post.title,
                                contents : post.contents,
                                tag : post.tag,
                                category : post.category,
                                name : post.name
                            }
                        }}>
                        <button className="modifyBtn"> 수정 </button></Link>
                        <button className="deleteBtn" onClick={delBtn} post-idx={post.idx}> 삭제 </button>
                    </div>}
                </div>
                <br/>
                <hr />
                <div className="question-body">
                    <div className="selctContents" dangerouslySetInnerHTML={ {__html: post.contents} }></div>
                    <div className="user-info">
                        <span>asked {post.rdate} {post.writer}</span>
                    </div>               
                </div>
                <hr/>

                <p className="bold">{commentnum}개의 답변</p>
                {comment.map(element =>(
                    <div className="question-answer" key={element.idx}>
                        <div className="selctContents" dangerouslySetInnerHTML={ {__html: element.contents}}></div>                    
                        <div className="user-info"> 
                            <span>answered {element.cdate} {element.writer}</span>
                            {(props.id === post.writer)&&(props.id !== element.writer) && //로그인 한 사람이 글 작성자라면 댓글 삭제만 가능
                                <button className="deleteBtn" onClick={delBtn_c} comment-idx={element.idx}> 삭제 </button>}
                            {(props.id === element.writer) && //로그인 한 사람이 댓글 작성자라면 댓글 삭제 및 수정 가능
                            <div>
                                <button className="modifyBtn" onClick={modBtn_c} comment-contents={element.contents} comment-idx={element.idx}> 수정 </button>
                                <button className="deleteBtn" onClick={delBtn_c} comment-idx={element.idx}> 삭제 </button>
                            </div>}
                        </div>   
                    </div>
                ))}

                <p className="bold">댓글작성</p>
                {props.id ?
                <CKEditor
                    editor={ Editor }
                    config={ editorConfiguration }
                    data= {mod}
                    onChange={ handleCkeditorState }
                /> : 
                <CKEditor
                    editor={ Editor }
                    config={ editorConfiguration }
                    data= {"로그인 후 이용해주세요"}
                />}
                { mode? <button className="modify-button" onClick={updateBtn_c}>수정</button> : props.id &&<button className="submit-button" onClick={onSubmitHandler}>작성</button> }
                <button className="toboard" onClick={onptbHandler}>목록으로</button> 
            </div>
        </div>
    );
}

export default Post;