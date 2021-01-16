import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../css/Components.css";
import Axios from 'axios';

function Login(props) {

	const [id,setID] = useState("");
	const [pw,setPW] = useState("");

	const onIDHandler = (event) => {
		setID(event.currentTarget.value)
	}
	const onPWHandler = (event) => {
		setPW (event.currentTarget.value)
	}

	const onSubmitHandler = (event) => {
		event.preventDefault();
		
		console.log(id);
		Axios.post('http://localhost:8000/member/login',
		{
		  id: id,
		  pw: pw
		}).then((response) => {
			console.log(response);
		  //alert("등록 완료");

		});
	}

	return (
	<div className="container">
	  <div>
	    <form onSubmit={onSubmitHandler} method="post">
	    <h3>로그인</h3>
	    <label htmlFor="id">아이디</label>
			<input className="ID-input" type='text' placeholder='아이디' name="username" value={id} onChange={onIDHandler} id='id'/>
			<label htmlFor='pw'>비밀번호</label>
			<input className="PW-input" type='password'placeholder='비밀번호' value={pw} onChange={onPWHandler} name='password' id='pw' />
			<button className="signBtn" type="submit">로그인</button>
			<label id="logBtnBox">
				<Link to="/signup" className="signBtns">회원가입</Link>
				<Link to="/idpw" className="signBtns">아이디/비밀번호 찾기</Link>
			</label>
	    </form>
	  </div>
	</div>
	);
}

export default Login;
