import React, {useState} from "react";
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
		
		Axios.post('http://localhost:8000/member/login',
		{
		  id: id,
		  pw: pw
		}).then((response) => {
			if(response.data === "fail") {
				alert("비밀번호가 일치하지 않습니다.");
				props.history.push("/login");
			} else if(response.data === "undefined") {
				alert("존재하지 않는 유저 입니다.");
				props.history.push("/login");
			} else if(response.data === "success") {
				alert("환영합니다!");
				props.history.push("/");
			}
		});
	}

	return (
	<div className="container">
	  <div>
	    <form onSubmit={onSubmitHandler} method="post">
	    <h3>로그인</h3>
	    <label htmlFor="userid">아이디</label>
			<input className="ID-input" type='text' placeholder='아이디' name="username" value={id} onChange={onIDHandler} id='userid'/>
			<label htmlFor='password'>비밀번호</label>
			<input className="PW-input" type='password'placeholder='비밀번호' value={pw} onChange={onPWHandler} name='password' id='password' />
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
