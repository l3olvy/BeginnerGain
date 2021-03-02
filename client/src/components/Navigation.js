import React from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";

function Navigation() {
	return (
		<div className="box2">
			<div className="nav">
				<Link to="/">Home</Link>
				<Link to="/news">News</Link>
				<Link to="/forum">Forum</Link>
				<Link to="/hire">COMPILER</Link>
				<Link to="/qna">Qna</Link>
				<Link to="/talk">Talk</Link>
				<Link to="/chat">Chat</Link>
			</div>
		</div>
	);
}

export default Navigation; 