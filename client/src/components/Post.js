import React from 'react';
import '../css/Components.css';
//import { Link } from "react-router-dom";
import Ckeditor from "./Ckeditor";

function Post() {
	return (
		<div className="Post">
			<div className='form-wrapper'>
				<div className="question-header">
					<p className="bolder">졸업작품 없이 졸업하면 안 되나요?</p>
				</div>
				<div className="grid">
					<div>
						<span>Asked</span>
						<time>today</time>
					</div>
					<div>
						<span>Viewed</span>
						12 times
					</div>
				</div>
				<br/>
				<hr/>
				<div className="question-body">
					<p>그냥 졸업 시켜주면 안 되는 건가요?<br/>아무것도 안 하고 싶어요.<br/>
					그냥 졸업 시켜주면 안 되는 건가요?<br/>아무것도 안 하고 싶어요.<br/>
					그냥 졸업 시켜주면 안 되는 건가요?<br/>아무것도 안 하고 싶어요.<br/>
					그냥 졸업 시켜주면 안 되는 건가요?<br/>아무것도 안 하고 싶어요.<br/>
					그냥 졸업 시켜주면 안 되는 건가요?<br/>아무것도 안 하고 싶어요.<br/></p>
					<div class="user-info">
					    asked <span>20.01.09 15:15</span>
					        <span>김본</span>
					</div>					
				</div>
				<hr/>
				<p className="bold">2개의 답변</p>
				<div className="question-answer">
	                <p>네 안 됩니다!<br/>수고염^-^</p>	
					<div class="user-info">
					    answered <span>20.01.09 15:17</span>
					        <span>송고은</span>
					</div>	
	            </div>
	            <hr/>
	            <div className="question-answer">
	                <p>졸업은 해야죠..<br/>힘내셈 아자아자^^</p>
					<div class="user-info">
					    answered <span>20.01.09 15:20</span>
					        <span>임수빈</span>
					</div>	
	            </div>
	            <hr/>
	            <p className="bold">답변</p>
	            <Ckeditor />
	            <button className="submit-button">작성</button>
	        </div>
        </div>
	);
}

export default Post; 
