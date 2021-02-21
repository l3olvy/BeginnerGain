import React, { useState, useEffect, useCallback } from "react";
import '../css/Components.css';
import "../css/Menu.css";
import Axios from 'axios';


function Chat(props) {
    const [user, setUser] = useState();
    const [input, setInput] = useState([]);
    const onInputHandler = (e) => { setInput( e.currentTarget.value); }
	const onChatHandler = (e) => {
		/*<script>
	      	var socket = io();
	      	$('#chat').on('submit', function(e){
	        	socket.emit('send message', $('#name').val(), $('#message').val());
		        $('#message').val("");
		        $("#message").focus();
		        e.preventDefault();
	      	});
	      	socket.on('receive message', function(msg){
	        	$('#chatLog').append(msg+'\n');
	        	$('#chatLog').scrollTop($('#chatLog')[0].scrollHeight);
	      	});
	      	socket.on('change name', function(name){
	        	$('#name').val(name);
	      	});
	    </script>*/
		console.log(input);
		console.log(user);
	}
	const getUser = useCallback(() => {
        Axios.get("http://localhost:8000/login").then((res) => {
            if(res.data.loggedIn === true) {
                setUser(res.data.user[0].id);
            }
        });
    }, []);

    useEffect(() => {
        getUser();        
    }, [getUser]);


	return (
		<div className="menu__container" >	      	
            <h2>Chatting</h2>		 
		    <textarea readOnly id="chatLog" style={{width: '500px', height: '200px', margin:'50px', marginBottom:'20px'}}></textarea>		    
		    <form id="chat" style={{marginLeft:'50px'}}>
			    <input readOnly id="name" value={user} type="text" style={{width:'150px'}}/>
			    <input onChange={onInputHandler} id="message" type="text" style={{width:'300px'}}/>
			    <button onClick={onChatHandler} style={{width: '50px', height: '20px'}}>chat</button>
		    </form>		    
		</div>
	);
};

export default Chat;

	
