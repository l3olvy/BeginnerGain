import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./Menu.css";
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
    	
    	<form style={{ display: 'flex', flexDirection: 'column'}}
    		  onSubmit={onSubmitHandler}
    	>
        <label style={{
            fontSize: '20px',
            margin: '10px 0px 10px 10px'
        }}> 로그인</label>
    		<label style={{
    			padding: '5px'
    		}}>아이디</label>
        	  <input className="ID-input"
        		type='text'
        		placeholder='아이디'
        		value={ID} onChange={onIDHandler} //??
        		name='id'
        		style={{
    			padding: '10px',
    			margin: '5px'
    		  }}/>
      		  <label style={{
    			padding: '5px'
    		  }}>비밀번호</label>
        	  <input className="PW-input"
        		type='text'
        		placeholder='비밀번호'
        		value={PW} onChange={onPWHandler}
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
      		<button style={{
    				padding: '7px',
    				margin: '5px 2px',
    				backgroundColor: '#0066CC',
    				color: '#ffffff',
    				borderWidth: '0px',
    				borderRadius:'3px'
    		  }}> 로그인</button>
    		  <Link to="/signup">
      			<button style={{
    				padding: '7px',
    				margin: '5px 2px',
    				backgroundColor: '#0066CC',
    				color: '#ffffff',
    				borderWidth: '0px',
    				borderRadius:'3px',
    			}}> 회원가입</button>
    		  </Link>

      		</label>

      	</form>

    </div>
  );
}

export default Login;
