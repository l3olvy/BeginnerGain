import React from "react";
import { Route } from "react-router-dom";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";
import IdPw from "../routes/IdPw";
import Home from "../routes/Home";
import News from "../routes/News";
import Forum from "../routes/Forum";
import Hire from "../routes/Hire";
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
function Body() {
    return (
        <div className="body">
        	<PublicRoute restricted component={Login} path="/login" />
        	<PublicRoute restricted component={SignUp} path="/signup" />
        	<PublicRoute restricted component={IdPw} path="/idpw" />
			<Route component={Home} path="/" exact={true} />
			<Route component={News} path="/news" />
			<Route component={Forum} path="/forum" />
			<Route component={Hire} path="/hire" /> 
			<Route component={Qna} path="/qna" exact={true} /> 
			<Route component={Talk} path="/talk" exact={true} /> 
			<PrivateRoute component={Chat} path="/chat" />
			<PublicRoute component={Post} path="/:name/post/:idx" />
			<PrivateRoute component={Writing} path="/:name/writing" />
			<PrivateRoute component={Writing} path="/:name/modify/:idx" />
			<Route component={Board} path="/qna/search/:kind/:q" /> 
			<Route component={Board} path="/talk/search/:kind/:q" />
			{/*<Route component={NotFound} path="/*" />*/}
		</div>
    );
}

export default Body;