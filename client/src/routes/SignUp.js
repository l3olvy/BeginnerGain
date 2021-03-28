import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Components.css";
import Axios from 'axios';


function SignUp(props) {
	const [Name,setName] = useState("");
	const [Email,setEmail] = useState("");
	const [Id,setID] = useState("");
	const [Pw,setPW] = useState("");
	const [check, setCheck] = useState(false);
	const onNameHandler = (event) => {setName (event.currentTarget.value)}
	const onEmailHandler = (event) => {setEmail (event.currentTarget.value)}
	const onIDHandler = (event) => {setID (event.currentTarget.value)}
	const onPWHandler = (event) => {setPW (event.currentTarget.value)}
	const [checkMsg, setCheckMsg] = useState("");

	const onSubmitHandler = (event) => {
		event.preventDefault();

		if(check === false) {
			alert("아이디 중복 체크를 해주세요!");
		} else {
			Axios.post('/member/join',
			{
				id: Id,
				pw: Pw,
				email : Email,
				name : Name
			}).then((res) => {
				alert("가입 되었습니다.");
				props.history.push("/login");
			})
		}
	}

	const checkId = (event) => {
		if(Id == "") alert("아이디를 입력하세요");
		else {
			Axios.post('/member/idCheck',
			{
				id : Id
			}).then((res) => {
				if(res.data === "exist") {
					setCheckMsg("이미 존재하는 아이디 입니다. 다른 아이디를 입력해주세요.");
				} else {
					setCheckMsg("사용 가능한 아이디 입니다.");
					setCheck(true);
				}
			})
		}
	}

	return (
		<div className="container">
			<div className="joinBox">
				<form method="post" onSubmit={onSubmitHandler}>
					<h3>회원가입</h3>
					<label>성명</label>
					<input className="Name-input" type='text' placeholder='성명' value={Name} id="name" onChange={onNameHandler} name='name' required />

					<label>이메일</label>
					<input className="Email-input" type='email' placeholder='이메일' value={Email}  onChange={onEmailHandler} name='email' required />

					<label>아이디</label>
					<ul>
						<li><input className="ID-input" type='text' placeholder='아이디' value={Id} onChange={onIDHandler} name='id' required /></li>
						<li><button type="button" id="check" onClick={checkId}>중복체크</button></li>
					</ul>
					<span>{ (checkMsg !== "") && (checkMsg) }</span>

					<label>비밀번호</label>
					<input className="PW-input" type='password' placeholder='비밀번호' value={Pw} onChange={onPWHandler} name='pw' required />

					<label>
						<button className="joinBtn" type="submit">등록</button>
						<Link to="/login">
							<button className="joinBtn"> 로그인</button>
						</Link>
					</label>
				</form>
			</div>
		</div>
	);
}

export default SignUp;