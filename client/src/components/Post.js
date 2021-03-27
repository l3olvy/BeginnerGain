import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../css/Post.css';
import Axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { Link } from "react-router-dom";
import Prism from "../lib/PrismImport";
import NotFound from "./NotFound";

const editorConfiguration = {
    simpleUpload: { uploadUrl: '/upload'},
    toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockquote', 'code', 'imageupload', 'codeblock', '|', 'numberedlist', 'bulletedlist', 'horizontalline', '|', 'undo', 'redo']
};

function Post(props) {
    const [post, setPost] = useState([]);
    const name = props.match.params.name;
    const [user, setUser] = useState();
    const [idx, setIdx] = useState(props.match.params.idx);
    const [mod, setMod] = useState('');
    const [modIdx, setModIdx] = useState('');
    const [mode, setMode] = useState(false);
    const [comment, setComment] = useState([]);
    const [commentnum, setCommentnum] = useState(0);
    const [postcommentN, setpostCommentN] = useState(0);
    const [tags, setTags] = useState([]);

    const mounted = useRef(false);

    const loadComment = useCallback( async () => {
        Axios.post('/board/get_total', {
            idx: idx,
            name : name
        }).then((response) => {
            setCommentnum(response.data[0].Total);
        })

        Axios.post('/board/get_c', {
            idx: idx,
            name : name
        }).then((response) => {
            setComment(response.data);
            Prism();
        })
    }, []);

    const getUser = async (e) => {
        await Axios.get("/member/session").then((res) => {
            if(res.data !== "fail") setUser(res.data.id);
        });
    }


    useEffect(() => {
        Prism();
        getUser();
        if(post.tag)
            setTags(post.tag.split(' '));
        else if(post.category)
            setTags(post.category.split(' '));

        setpostCommentN(post.commentN);
        loadComment();
    }, [getUser, loadComment, post.commentN, post]);

    useEffect(() => {
        hitUpdate();
        setIdx(props.match.params.idx);  

        if(isNaN(idx) === false && (name === 'qna' || name === 'talk')){
            Axios.post('/board/getPost', {
                idx: idx,
                name : name
            }).then((res) => {
                if(res.data.length !== 0)
                    setPost(res.data[0]);   
                else
                    props.history.push("/notfound"); 
            });
        }
        else
            props.history.push("/notfound");   
    }, []);


    useEffect(() => {
        if(!mounted.currnet) {
            mounted.currnet = true;
        } else {
            getUser();
        }
    }, [user]);

    const delBtn_c = (e) => {
        if (window.confirm("삭제하시겠습니까?")) {
            const didx = e.target.getAttribute('comment-idx');

            Axios.post('/board/delete_c', { idx: didx, name : name });

            Axios.post('/board/delete_cN', {
                idx: idx,
                name : name,
                commentN: (postcommentN-1)
            }).then((response) => { loadComment(); })

            alert("삭제 되었습니다!");            
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
            const midx = modIdx;
            
            Axios.post('/board/update_c', {
                idx: midx,
                contents: mod,
                name : name
            }).then(() => { loadComment(); })

            alert("수정 되었습니다!");
        }
        setMod('');
        setMode(false);
    }

    const onSubmitHandler = (event) => {
        if(mod.length !== 0) {
            setCommentnum(post.commentN+1);
            
            Axios.post('/board/postqna', {
                bid: idx,
                writer: user,
                name : name,
                contents:mod,
                commentN: (postcommentN+1)
            }).then(() => {
                loadComment();
            })
            .catch((error) => { console.log(error) });

            alert("작성 되었습니다.");
            setpostCommentN(postcommentN+1);
            setMod('');
            loadComment();     
        }else{
            alert("댓글을 입력해주세요.");
        }
    }
    
    const onptbHandler = (event) => {
        if (name === "talk")
            props.history.push("/talk")
        else
            props.history.push("/qna")
    }

    const handleCkeditorState = (event, editor) => {
        const data = editor.getData();
        setMod(data);
    }

    const hitUpdate = () => {
        Axios.post('/board/getHit',{
           idx: idx,
           name: name
       }).then((response) => {})
    }

    const delBtn = (e) => {
        if (window.confirm("삭제하시겠습니까?")) {
            const didx = e.target.getAttribute('post-idx');

            Axios.post('/board/deletepost', {
                idx: didx,
                name : name
            }).then(() => {
                if(name === "qna") props.history.push("/qna");
                else props.history.push("/talk");
                alert("삭제 되었습니다!");
            })
        }
    }

    return (
        <div className="Post">
            {
            // data setup 됐을 때 자연스럽게 불러주려고 이렇게 했음 css 수정 필요할 듯
            !Array.isArray(post) && 
            <div className="post_container">
                <div className="post_header">
                    <div className="bolder">{post.title}</div>
                    
                    <div className="grid">
                        <div className="left">
                            {post.writer} &nbsp;|&nbsp; <time>{post.rdate}</time> &nbsp;|&nbsp; {post.hit} Views
                        </div>
                    
                        { // tag 불러와서 저장해서 넘기세요 writing으로 수정해야하니까
                        (props.id === post.writer) && //로그인 한 사람이 글 작성자라면 글 삭제 및 수정 가능
                        <div className="right">
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
                                    name : name
                                }
                            }}>
                            <button className="modifyBtn">수정</button></Link> /
                            <button className="deleteBtn" onClick={delBtn} post-idx={post.idx}>삭제</button>
                        </div>}
                    </div>
                </div>
        
                <div className="post_body">
                    <div className="post_contents" dangerouslySetInnerHTML={ {__html: post.contents} }></div>
                    <div className="post_tags">
                        <span className="bold">태그 :</span>
                        {tags && (
                            <span>
                                {(tags[0] !== 'undefined') && 
                                <Link to={`/${name}/search/tag/${tags[0]}`}>{tags[0]}</Link>}
                                {(tags[1] !== 'undefined') && 
                                <Link to={`/${name}/search/tag/${tags[1]}`}>{tags[1]}</Link>}
                                {(tags[2] !== 'undefined') && 
                                <Link to={`/${name}/search/tag/${tags[2]}`}>{tags[2]}</Link>}
                            </span>
                        )}
                    </div>

                    <div className="post_comments">
                        <p className="bold">{commentnum}개의 답변</p>
                        {
                            comment.map(element =>(
                                <div className="answer" key={element.idx}>
                                    <div className="comments_info"> 
                                         <span className="comment_writer">{element.writer}</span><span className="comment_date"> &nbsp;|&nbsp; {element.cdate}</span>
                                        {(props.id === post.writer)&&(props.id !== element.writer) && //로그인 한 사람이 글 작성자라면 댓글 삭제만 가능
                                            <button className="deleteBtn" onClick={delBtn_c} comment-idx={element.idx}> 삭제 </button>}
                                        {(props.id === element.writer) && //로그인 한 사람이 댓글 작성자라면 댓글 삭제 및 수정 가능
                                        <div className="right">
                                            <button className="modifyBtn" onClick={modBtn_c} comment-contents={element.contents} comment-idx={element.idx}> 수정 </button> /
                                            <button className="deleteBtn" onClick={delBtn_c} comment-idx={element.idx}> 삭제 </button>
                                        </div>}

                                    </div>  
                                    <div dangerouslySetInnerHTML={{__html: element.contents}}></div>                    
                                     
                                </div>
                            ))
                        }

                        <p className="bold">댓글작성</p>
                        <div className="post_input">
                            { props.id ?
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
                                />
                            }
                        </div>
                        <button className="toboard" onClick={onptbHandler}>목록으로</button>
                        { mode? <button className="modify-button" onClick={updateBtn_c}>수정</button> : props.id &&<button className="submit-button" onClick={onSubmitHandler}>작성</button> }

                    </div>             
                </div>
            </div>
            }
        </div>
    );
}

export default Post;