import React from 'react';
import '../css/Components.css';
import Ckeditor from "./Ckeditor";
import Axios from 'axios';
import ReactHtmlParser from 'node-html-parser';

class Post extends React.Component {
	state = {
		state: this.props.location.state ? this.props.location.state : JSON.parse(localStorage.getItem('object')),
		comment: []
	}

	componentDidMount() {
		if(this.props.location.state!==undefined)
			localStorage.setItem("object", JSON.stringify(this.props.location.state));
		else
			this.state.state = JSON.parse(localStorage.getItem('object'));
		this.loadComment();
	}

	loadComment = async () => {
		const idx = this.state.state.idx;
		if(this.state.state.name === "QNA"){
			Axios.post('http://localhost:8000/board/getqna_c', {
				idx: idx
			}).then((response)=>{
				this.setState({comment:response.data});
			})
		}
		else if(this.state.state.name === "TALK"){
			Axios.post('http://localhost:8000/board/gettalk_c', {
				idx: idx
			}).then((response)=>{
				this.setState({comment:response.data});
			})
		}
	}

	render(){
		const { state } = this.state;
		const {comment} = this.state;
		const delBtn = (e) => {
			if(window.confirm("삭제하시겠습니까?")){
				const idx = e.target.getAttribute('data-idx');
				if(state.name === "QNA"){
					Axios.post('http://localhost:8000/board/deleteqna', {
						idx : idx
					}).then(() => {
						this.props.history.push("/qna")
						alert("삭제 되었습니다!");
					})
				}
				else if(state.name === "TALK"){
					Axios.post('http://localhost:8000/board/deletetalk', {
						idx : idx
					}).then(() => {
						this.props.history.push("/talk")
						alert("삭제 되었습니다!");
					})
				}
			}
		}
		return (
			<div className="Post">
			<div className='form-wrapper'>
			<div className="question-header">
			<p className="bolder">{state.title}</p>
			</div>
			<div className="grid">
			<div>
			<span>Asked</span>
			<time>{state.rdate}</time>
			</div>
			<div>
			<span>Viewed</span>
			{state.hit} times
			</div>
			<div className="writer">
			<button className="modifyBtn"> 수정 </button>
			<button className="deleteBtn" onClick={delBtn} data-idx={state.idx} data-name={state.name}> 삭제 </button>
			</div>
			</div>
			<br/>
			<hr />
			<div className="question-body">
			<div className="selctContents" dangerouslySetInnerHTML={ {__html: state.contents} }></div>
			<div className="user-info">
			asked <span>{state.rdate}</span>
			<span>{state.writer}</span>
			</div>               
			</div>
			<br/>
			<hr/>
			
			<p className="bold">2개의 답변</p>
			{comment.map(element =>(

				<div className="question-answer">
				<p>{element.contents}</p>                    
				<div className="user-info">   
				<button className="modifyBtn"> 수정 </button>
				<button className="deleteBtn"> 삭제 </button>
				answered <span>{element.cdate}</span>
				<span>{element.writer}</span>
				</div>   
				</div>
				))}
			
			<p className="bold">답변</p>
			<Ckeditor />
			<button className="submit-button">작성</button>
			</div>
			</div>
			);
	}
}

export default Post; 