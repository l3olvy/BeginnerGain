import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../css/Components.css";
import Axios from 'axios';

function Login(props) {

  const [ID,setID] = useState("")
  const [PW,setPW] = useState("")

  const onIDHandler = (event) => {
  	setID (event.currentTarget.value)
  }
   const onPWHandler = (event) => {
  	setPW (event.currentTarget.value)
  }


	const onSubmitHandler = (event) => {
		event.preventDefault();
		console.log('ID', ID)
		console.log("PW", PW)
		Axios.post('http://localhost:8000/api/login',{
	  id: ID,
	  password: PW
	}).then(() => {
	  alert("등록 완료");
	  setID('');
	})
	}

     
  return (
    <div className="container">
      <div>
        <form onSubmit={onSubmitHandler}>
        <h3>로그인</h3>
        <label for="id">아이디</label>
			<input className="ID-input" type='text' placeholder='아이디' value={ID} onChange={onIDHandler} id='id'/>
			<label for='pw'>비밀번호</label>
			<input className="PW-input" type='text'placeholder='비밀번호' value={PW} onChange={onPWHandler} name='pw' id='pw' />
			<button className="signBtn">로그인</button>
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
