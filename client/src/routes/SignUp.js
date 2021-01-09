import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./Menu.css";

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
    	<form style={{
    		display: 'flex', flexDirection: 'column'
    	}}>
        <label style={{
            fontSize: '20px',
            margin: '10px 0px 10px 10px'
        }}> 회원가입</label>
    		<label style={{
    			padding: '5px'
    		}}>성명</label>
        	<input className="Name-input"
        		type='text'
        		placeholder='성명'
        		value={Name} 
        		onChange={onNameHandler}
        		name='name'
        		style={{
    			padding: '10px',
    			margin: '5px'
    		}}
        	/>
      		
      		<label style={{
    			padding: '5px'
    		}}>이메일</label>
        	<input className="Email-input"
        		type='email'
        		placeholder='이메일'
        		value={Email} 
        		onChange={onEmailHandler}
        		name='email'
        		style={{
    			padding: '10px',
    			margin: '5px'
    		}}
        	/>

       		<label style={{
    			padding: '5px'
    		}}>아이디</label>
        	<input className="ID-input"
        		type='text'
        		placeholder='아이디'
        		value={ID}
        		onChange={onIDHandler}
        		name='id'
        		style={{
    			padding: '10px',
    			margin: '5px'
    		}}
        	/>
      
      		<label style={{
    			padding: '5px'
    		}}>비밀번호</label>
        	<input className="PW-input"
        		type='text'
        		placeholder='비밀번호'
        		value={PW}
        		onChange={onPWHandler}
        		name='pw'
        		style={{
    			padding: '10px',
    			margin: '5px'
    		}}/>

       		<label style={{
     			//display: 'flex', flexDirection: 'row'
     			float: 'right', 
     			padding: '2px'
     		  }}>
     		  <Link to="/login">
      			<button style={{
    			padding: '8px',
    			margin: '5px 2px',
    			backgroundColor: '#0066CC',
    			color: '#ffffff',
    			borderWidth: '0px',
    			borderRadius:'3px'
    		  }}> 로그인</button>
    		  </Link>
      		  <button style={{
    			padding: '8px',
    			margin: '10px 2px',
    			backgroundColor: '#0066CC',
    			color: '#ffffff',
    			borderWidth: '0px',
    			borderRadius:'3px'
    		}}>등록</button>
		
			{/*등록 성공시 로그인페이지로?*/}
      		
			</label>
    	</form>
    </div>
  );
}

export default SignUp;