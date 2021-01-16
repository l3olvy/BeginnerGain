import React, {useState} from "react";
import "../css/Components.css";

//Formik, Yup 사용시 좀더 다이나믹,, 나중에,,.......

function IdPw() {

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
		<div>
			<form>
				<h3>아이디 찾기</h3>
				<label>성명</label>
				<input className="Name-input" type='text' placeholder='성명' value={Name} onChange={onNameHandler} name='name' />

				<label>이메일</label>
				<input className="Email-input" type='email' placeholder='이메일' value={Email}  onChange={onEmailHandler} name='email'/>

				<button className="get-id"> 찾기</button>
				<hr/>
				<h3>비밀번호 찾기</h3>
				<label>아이디</label>
				<input className="ID-input" type='text' placeholder='아이디' value={ID} onChange={onIDHandler} name='id'/>

				<label>성명</label>
				<input className="Name-input" type='text' placeholder='성명' value={Name} onChange={onNameHandler} name='name' />

				<label>이메일</label>
				<input className="Email-input" type='email' placeholder='이메일' value={Email}  onChange={onEmailHandler} name='email'/>

				<button className="get-pw"> 찾기</button>

			</form>
		</div>
    </div>
  );
}

export default IdPw;