import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/Components.css";
import Axios from 'axios';

function Login(props) {
	const [id,setID] = useState("");
	const [pw,setPW] = useState("");

	const [loginCheck, setLogin] = useState(false);
	
	const mounted = useRef(false);

	const getCheck = async (e) => {
		if((window.location.href).split("=").[1] === "fail") setLogin(true);
	}

	const getUser = async (e) => {
		await Axios.get("/member/session").then((res) => {
			if(res.data !== "fail") setID(res.data.id);
		});
	}

	useEffect(() => {
		getCheck();	
	}, [])

	useEffect(() => {
		getUser();
	}, [])

	useEffect(() => {
		if(!mounted.currnet) {
			mounted.currnet = true;
		} else {
			if(loginCheck) { 
				alert("아이디 또는 비밀번호가 일치하지 않습니다."); 
				setLogin(false);
				props.history.push("/login");
			}
		}
	}, [loginCheck]);

	useEffect(() => {
		if(!mounted.currnet) {
			mounted.currnet = true;
		} else {
			getUser();
		}
	}, [id]);


	// const onSubmitHandler = (event) => {

	// 	event.preventDefault();

	// 	Axios.post('/member/login', {
	// 		id: id,
	// 		pw: pw
	// 	}).then((response) => {
	// 		if(response.data === "fail") {
	// 			alert("비밀번호가 일치하지 않습니다.");
	// 			props.history.push("/login");
	// 			setID("");
	// 			setPW("");
	// 		} else if(response.data === "undefined") {
	// 			alert("존재하지 않는 유저 입니다.");
	// 			props.history.push("/login");
	// 			setID("");
	// 			setPW("");
	// 		} else if(response.data === "success") {
	// 			alert("환영합니다!");
	// 			window.location.replace("/")
	// 		}
	// 	});
	// }

	return (
		<div className="container">
			<div>
				<form action="/member/loginAf" method="post">
					<h3>로그인</h3>
					<label htmlFor="userid">아이디</label>
					<input className="ID-input" type='text' placeholder='아이디' name="id" id='userid' required />
					<label htmlFor='password'>비밀번호</label>
					<input className="PW-input" type='password' placeholder='비밀번호' name='pwd' id='password' required />
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
