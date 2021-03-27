import React, {useState} from "react";
import "../css/Components.css";
import Axios from 'axios';

function IdPw() {

	const [Name,setName] = useState("")
	const [Email,setEmail] = useState("")
	const [ID,setID] = useState("")
	const [PW,setPW] = useState("")
	const [checknum,setChecknum] = useState(Math.floor(Math.random() * (899999)) + 100000);
	const [userchecknum,setuserChecknum] = useState(0);
	const [mode,setMode] = useState(false)
	const onNameHandler = (event) => { setName (event.currentTarget.value) }
	const onEmailHandler = (event) => { setEmail (event.currentTarget.value) }
	const onIDHandler = (event) => { setID (event.currentTarget.value) }
	const onPWHandler = (event) => { setPW (event.currentTarget.value) }
	const onchecknumHandler =  (event) => { setuserChecknum (event.currentTarget.value) }

	const checkID = (e) => {
		Axios.post('http://localhost:8000/checkidemail', {
                name: Name,
                email: Email
        }).then((res) => {
			if(res.data === "exist") {
				alert("이메일을 보내는 중입니다.");
				sendID();
			} else if (res.data === "noname") {
				alert("등록되지 않은 이름입니다.");
			} else if (res.data === "noemail") {
				alert("이메일이 일치하지 않습니다.");
			}
		});
	}
	const sendID = () => {
		Axios.post('http://localhost:8000/sendID', {
                name: Name,
                email: Email
        }).then((res) => {
			if(res.data === "good") {
				alert("이메일로 아이디 보냄.");
			}
		});
	}

	const checkPW = (e) => {
		Axios.post('http://localhost:8000/checkpwemail', {
                name: Name,
                id:ID,
                email: Email
        }).then((res) => {
			if(res.data === "exist") {
				alert("확인되었습니다.");
				changePW();
			} else if (res.data === "noname") {
				alert("등록되지 않은 아이디 또는 이름 입니다.");
			} else if (res.data === "noemail") {
				alert("이메일이 일치하지 않습니다.");
			} 
		});
	}

	const changePW = () => {
		console.log('changePW');//100000~999999
		Axios.post('http://localhost:8000/changePW', {
                name: Name,
                checknum:checknum,
                email: Email
        }).then((res) => {
			if(res.data === "good") {
				alert("인증 이메일 보냄.");
				setMode(true);
			}
		});
	}


	return (
		<div className="container">
			<div>
				<form>
					<h3>아이디 찾기</h3>
					<label>성명</label>
					<input className="Name-input" type='text' placeholder='성명' value={Name} onChange={onNameHandler} name='name' />

					<label>이메일</label>
					<input className="Email-input" type='email' placeholder='이메일' value={Email}  onChange={onEmailHandler} name='email'/>
					<button className="get-id" onClick={checkID}> 찾기</button>

					<hr/>
					
					<h3>비밀번호 찾기</h3>
					<label>아이디</label>
					<input className="ID-input" type='text' placeholder='아이디' value={ID} onChange={onIDHandler} name='id'/>

					<label>성명</label>
					<input className="Name-input" type='text' placeholder='성명' value={Name} onChange={onNameHandler} name='name' />

					<label>이메일</label>
					<input className="Email-input" type='email' placeholder='이메일' value={Email}  onChange={onEmailHandler} name='email'/>

					<button className="get-pw" onClick={checkPW}> 찾기</button>
				</form>
				{ (mode)&& 
					<form>
						<h3>비밀번호 변경</h3>
						<label>인증번호 입력</label>
						<input className="checknum-input" type='text' placeholder='인증번호' onChange={onchecknumHandler} name='name' />
					</form>
				} 
			</div>
		</div>
	);
}

export default IdPw;