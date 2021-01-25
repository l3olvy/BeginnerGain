import React, { useState, useEffect, useCallback } from 'react';
import '../css/Components.css';
import Axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Link } from "react-router-dom";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

const editorConfiguration = {
    simpleUpload: { uploadUrl: '/upload'},
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo']
};

function Post(props) {
    const [post, setPost] = useState(props.location.state ? props.location.state : JSON.parse(localStorage.getItem('prev')));
    const [comment, setComment] = useState([]);
    const [mod, setMod] = useState('');
    const [mode, setMode] = useState(false);
    const [modIdx, setModIdx] = useState('');
    const [commentnum, setCommentnum] = useState(0);

    const loadComment = useCallback( async () => {
        const idx = post.idx;
        if (post.name === "QNA") {
            Axios.post('http://localhost:8000/board/getqna_c', {
                idx: idx
            }).then((response) => {
                setComment(response.data);
                Prism.highlightAll();
            })
            Axios.post('http://localhost:8000/board/getqna_total', {
                idx: idx
            }).then((response) => {
              	setCommentnum(response.data[0].Total);
            })
        } else if (post.name === "TALK") {
            Axios.post('http://localhost:8000/board/gettalk_c', {
                idx: idx
            }).then((response) => {
                setComment(response.data);
                Prism.highlightAll();
            })
            Axios.post('http://localhost:8000/board/gettalk_total', {
                idx: idx
            }).then((response) => {
              	setCommentnum(response.data[0].Total);
            })
        }
    }, [post.idx, post.name]);

    useEffect(() => {
        Prism.highlightAll();
        if (props.location.state !== undefined) {
            localStorage.setItem("prev", JSON.stringify(props.location.state));
        }
        loadComment();
    }, [loadComment, props.location.state])


    const delBtn = (e) => {
        if (window.confirm("삭제하시겠습니까?")) {
            const idx = e.target.getAttribute('post-idx');
            if (post.name === "QNA") {
                Axios.post('http://localhost:8000/board/deleteqna', {
                    idx: idx
                }).then(() => {
                    props.history.push("/qna")
                    alert("삭제 되었습니다!");
                })
            } else if (post.name === "TALK") {
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
            if (post.name === "QNA") {
                Axios.post('http://localhost:8000/board/deleteqna_c', {
                    idx: idx                   
                }).then(() => { alert("삭제 되었습니다!"); })
                Axios.post('http://localhost:8000/board/deleteqna_cN', {
                	idx: post.idx,
                    commentN: (post.commentN-1)
            	}).then((response) => { loadComment(); })

            } else if (post.name === "TALK") {
                Axios.post('http://localhost:8000/board/deletetalk_c', {
                    idx: idx                   
                }).then(() => { alert("삭제 되었습니다!"); })
                Axios.post('http://localhost:8000/board/deletetalk_cN', {
                	idx: post.idx,
                    commentN: (post.commentN-1)
            	}).then((response) => { loadComment(); })
            }
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
            if (post.name === "QNA") {
                Axios.post('http://localhost:8000/board/updateqna_c', {
                    idx: idx,
                    contents: mod
                }).then(() => {
                    alert("수정 되었습니다!");
                })
            } else if (post.name === "TALK") {
                Axios.post('http://localhost:8000/board/updatetalk_c', {
                    idx: idx,
                    contents: mod
                }).then(() => {
                    alert("수정 되었습니다!");
                })
            }
        }
        setMod('');
        setMode(false);
        loadComment();
    }

    const handleCkeditorState = (event, editor) => {
        const data = editor.getData();
        setMod(data);
    }

    const onSubmitHandler = (event) => {
        if (post.name === "QNA") {
            Axios.post('http://localhost:8000/board/postqna', {
                bid: post.idx,
                writer: "writer",
                contents:mod,
                img: null,
                good: 8,
                commentN: (post.commentN+1)
            }).then(() => {
                alert("작성 되었습니다.");
                loadComment();
            })
            .catch((error) => { console.log(error) });
        } else {
            Axios.post('http://localhost:8000/board/posttalk', {
                bid: post.idx,
                writer: "writer",
                contents:mod,
                img: null,
                good: 8,
                commentN: (post.commentN+1)
            }).then(() => {
                alert("작성 되었습니다.");
                loadComment();
            })
            .catch((error) => { console.log(error) });
        }
        setMod('');
        loadComment();
    }

    const onptbHandler = (event) => {
        if (post.name === "TALK")
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
                        {post.hit} times
                    </div>
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

                <p className="bold">{commentnum}개의 답변</p>
                {comment.map(element =>(
                    <div className="question-answer">
                        <p className="selctContents" dangerouslySetInnerHTML={ {__html: element.contents}}></p>                    
                        <div className="user-info">   
                            <button className="modifyBtn" onClick={modBtn_c} comment-contents={element.contents} comment-idx={element.idx}> 수정 </button>
                            <button className="deleteBtn" onClick={delBtn_c} comment-idx={element.idx}> 삭제 </button>
                            answered <span>{element.cdate}</span>
                            <span>{element.writer}</span>
                        </div>   
                    </div>
                ))}

                <p className="bold">댓글작성</p>
                <CKEditor
                    editor={ Editor }
                    config={ editorConfiguration }
                    data= {mod}
                    onChange={ handleCkeditorState }
                />
                { mode? <button className="modify-button" onClick={updateBtn_c}>수정</button> : <button className="submit-button" onClick={onSubmitHandler}>작성</button> }
                <button className="toboard" onClick={onptbHandler}>목록으로</button> 
            </div>
        </div>
    );
}

export default Post;
