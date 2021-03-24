import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";
import IdPw from "../routes/IdPw";
import Home from "../routes/Home";
import News from "../routes/News";
import Compile from "../routes/Compile";
import Qna from "../routes/Qna";
import Talk from "../routes/Talk";
import Chat from "../routes/Chat";
import Writing from "../components/Writing";
import Post from "../components/Post";
import "../css/Body.css";
import Board from "./Board";
import PublicRoute from "../lib/PublicRoute"
import PrivateRoute from "../lib/PrivateRoute"
import NotFound from "./NotFound";
import Axios from 'axios';
function Body() {

 	const [isLogin, setIsLogin] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
       Axios.get("http://localhost:8000/login").then((res) => {
            setIsLogin(res.data.loggedIn);
            if(res.data.loggedIn === true)
                setId(res.data.user[0].id);
        });
    }, [isLogin, id]);

    return (
        <div className="body">
        
        <Switch>
       		<Route component={Home} path="/" exact={true} />
        	<PublicRoute restricted component={Login} isLogin= {isLogin} id = {id} path="/login" exact={true}/>
        	<PublicRoute restricted component={SignUp} isLogin= {isLogin} id = {id} path="/signup" exact={true}/>
        	<PublicRoute restricted component={IdPw} isLogin= {isLogin} id = {id} path="/idpw" exact={true}/>
			<Route component={News} path="/news" exact={true}/>
			<Route component={Compile} path="/compiler" exact={true}/> 
			<Route component={Qna} path="/qna" exact={true} /> 
			<Route component={Talk} path="/talk" exact={true} />
			<PrivateRoute component={Writing} path="/:name/writing" isLogin= {isLogin} exact={true}/>
			<PrivateRoute component={Writing} path="/:name/modify/:idx" isLogin= {isLogin} exact={true}/>
			<PrivateRoute component={Chat} path="/chat" isLogin= {isLogin} exact={true}/> 
			<PublicRoute component={Post} path="/:name/post/:idx" isLogin= {isLogin} id = {id} exact={true}/>
			<Route component={Board} path="/qna/search/:kind/:q" exact={true}/> 
			<Route component={Board} path="/talk/search/:kind/:q" exact={true}/>
			<Route component={NotFound} path="/notfound" />
			<Route component={NotFound}>
				<Redirect to="/notfound" />
			</Route>
			</Switch>
		</div>
    );
}

export default Body;