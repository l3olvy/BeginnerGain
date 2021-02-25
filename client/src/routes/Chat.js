import React, { useState, useEffect, useCallback } from "react";
import '../css/Components.css';
import "../css/Menu.css";
import Axios from 'axios';
import socketIOClient from "socket.io-client";

function Chat(props) {
	const [user, setUser] = useState();
	const [messageList, setMessageList] = React.useState([]);
	const [name, setName] = React.useState('');
	const [value, setValue] = React.useState('');
	const socket = socketIOClient('localhost:8000');
	const submit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		socket.emit('send message', { name: name, message: value });
		setValue("");
	};
 //    const onInputHandler = (e) => { setInput( e.currentTarget.value); }
   // const onChatHandler = (e) => {
      
   // }
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

    useEffect(() => {
		socket.on('receive message', (message: { name: string, message: string }) => {
			setMessageList(messageList => messageList.concat(message));
		})
    }, []);

   return (
      <div className="menu__container" >            
            <h2>Chatting</h2>       
         <section className="chat-list">
            {messageList.map((item: Message, i: number) =>
            <div key={i} className="message">
               <p className="username">{item.name.toUpperCase()}</p>
               <p className="message-text">{item.message}</p>
            </div>
            )}
         </section>
         <form className="chat-form" onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}>
            <div className="chat-inputs">
               <input type="text" autoComplete="off" onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} value={name} placeholder="유저이름" />
               <input type="text" autoComplete="off" onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)} value={value} placeholder="메세지입력하기" />
            </div>
            <button type="submit">입력하기</button>
         </form>
      </div>
   );
};

export default Chat;

   