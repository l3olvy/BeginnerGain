import React, {useState} from "react";
import { Link } from "react-router-dom";
import "../css/Menu.css";

//Formik, Yup 사용시 좀더 다이나믹,, 나중에,,.......

function SignUp(props) {

  const [Name,setName] = useState("")
  const [Email,setEmail] = useState("")
  const [ID,setID] = useState("")
  const [PW,setPW] = useState("")
  const onNameHandler = (event) => {
  	setName (event.currentTarget.value)}
   const onEmailHandler = (event) => {
  	setEmail (event.currentTarget.value)}
  const onIDHandler = (event) => {
  	setID (event.currentTarget.value)}
   const onPWHandler = (event) => {
  	setPW (event.currentTarget.value)}


  return (
    <div className="container">
		<div className="joinBox">
			<form>
				<h3>회원가입</h3>
				<label>성명</label>
				<input className="Name-input" type='text' placeholder='성명' value={Name} onChange={onNameHandler} name='name' />

				<label>이메일</label>
				<input className="Email-input" type='email' placeholder='이메일' value={Email}  onChange={onEmailHandler} name='email'/>

				<label>아이디</label>
				<input className="ID-input" type='text' placeholder='아이디' value={ID} onChange={onIDHandler} name='id'/>

				<label>비밀번호</label>
				<input className="PW-input" type='text' placeholder='비밀번호' value={PW} onChange={onPWHandler} name='pw' />

				<label>
				<Link to="/login">
				    <button className="joinBtn"> 로그인</button>
				</Link>
					<button className="joinBtn">등록</button>
					{/*등록 성공시 로그인페이지로?*/}
				</label>
			</form>
		</div>
    </div>
  );
}

export default SignUp;