import React, { useState, useEffect, useCallback } from "react";
import '../css/Components.css';
import "../css/Menu.css";
import Axios from 'axios';
import socketIOClient from "socket.io-client";

const socket = socketIOClient.connect("/");

function Chat(props) {
  const [name, setName] = React.useState('');

  const [inputMessage, setInputMessage] = useState(''); // 입력값을 저장하는 상태값
  const [chatMonitor, setChatMonitor] = useState([]);
  
    const [user, setUser] = useState();
  const [recentChat, setRecentChat] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit('message', { name: name, message: inputMessage });
    //socket.emit('message', { inputMessage });
      //setInputMessage({ ...inputMessage, content: ''});
      setInputMessage("");
  };

  const getUser = useCallback(() => {
    Axios.get("/login").then((res) => {
      if(res.data.loggedIn === true) {
        setUser(res.data.user[0].id);
      }
    });

  }, []);

  useEffect(() => {
    getUser();        
  }, [getUser]);


  useEffect(() => {
    socket.on('upload', (data) => {
      setRecentChat(data);
    });
  }, []);

  useEffect(() => {
    Object.keys(recentChat).length > 0 && setChatMonitor([...chatMonitor, recentChat]);
    //recentChat.length > 0 && setChatMonitor([...chatMonitor, recentChat]);
    setRecentChat('');
  }, [recentChat]);

   return (
      <div className="menu__container" >            
      <h2>Chatting</h2>       
       <section className="chat-list">
            {chatMonitor.map((item: Message, i: number) =>
            <div key={i} className="message">
              <p className="username">{item.name}</p>
              <p className="message-text">{item.message}</p>
            </div>
            )}
         </section>
      <form className="chat-form" onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}>
        <div className="chat-inputs">
          <input type="text" autoComplete="off" onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} value={name} placeholder="유저이름" />
          <input type="text" autoComplete="off" onChange={(e: ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)} value={inputMessage} placeholder="메세지입력하기" />
          <button type="submit">입력하기</button>
        </div>
      </form>
      </div>
   );
};

export default Chat;

   