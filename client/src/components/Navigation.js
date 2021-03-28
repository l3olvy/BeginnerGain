import React from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";

function Navigation() {
	return (
		<div className="box2">
			<div className="nav">
				<Link to="/chat">Chat</Link>
				<Link to="/talk">Talk</Link>
				<Link to="/qna">Qna</Link>
				<Link to="/compiler">Compiler</Link>
				<Link to="/news">News</Link>
				<Link to="/">INTRO</Link>
				<div><Link to="/"><img src="/img/logo.PNG" alt="img"/></Link></div>
			</div>
		</div>
	);
}

export default Navigation; 