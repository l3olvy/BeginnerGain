import React from "react";
import { HashRouter, Route } from "react-router-dom";
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

function Body() {
	return (
		<div className="body">
			<HashRouter>
				 <Route path="/login" component={Login} />
			     <Route path="/signup" component={SignUp} />
			     <Route path="/idpw" component={IdPw} />
			     <Route path="/" exact={true} component={Home} />
			     <Route path="/news" component={News} />
			     <Route path="/forum" component={Forum} />
			     <Route path="/hire" component={Hire} /> 
			     <Route path="/qna" exact={true} component={Qna} /> 
			     <Route path="/talk" component={Talk} /> 
			     <Route path="/chat" component={Chat} />
			     <Route path="/writing" component={Writing} />
			     <Route path="/post" component={Post} />
			     <Route path="/qna/:idx" component={Post} />
	      	</HashRouter>
		</div>
	);
}

export default Body; 
