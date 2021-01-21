import React, {useState} from "react";
import { Link } from "react-router-dom";
import "../css/Components.css";
import Axios from 'axios';


function SignUp(props) {

	const [Name,setName] = useState("");
	const [Email,setEmail] = useState("");
	const [Id,setID] = useState("");
	const [Pw,setPW] = useState("");
	const onNameHandler = (event) => {setName (event.currentTarget.value)}
	const onEmailHandler = (event) => {setEmail (event.currentTarget.value)}
	const onIDHandler = (event) => {setID (event.currentTarget.value)}
	const onPWHandler = (event) => {setPW (event.currentTarget.value)}

	const onSubmitHandler = (event) => {

		event.preventDefault();

		Axios.post('http://localhost:8000/join',
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

	return (
		<div className="container">
			<div className="joinBox">
				<form method="post" onSubmit={onSubmitHandler}>
					<h3>회원가입</h3>
					<label>성명</label>
					<input className="Name-input" type='text' placeholder='성명' value={Name} onChange={onNameHandler} name='name' />

					<label>이메일</label>
					<input className="Email-input" type='email' placeholder='이메일' value={Email}  onChange={onEmailHandler} name='email'/>

					<label>아이디</label>
					<input className="ID-input" type='text' placeholder='아이디' value={Id} onChange={onIDHandler} name='id'/>

					<label>비밀번호</label>
					<input className="PW-input" type='password' placeholder='비밀번호' value={Pw} onChange={onPWHandler} name='pw' />

					<label>
						<Link to="/login">
							<button className="joinBtn"> 로그인</button>
						</Link>
						<button className="joinBtn" type="submit">등록</button>
					</label>
				</form>
			</div>
		</div>
	);
}

export default SignUp;