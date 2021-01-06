import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css";

function Navigation() {
	return (
		<div className="nav">
			<Link to="/">Home</Link>
			<Link to="/news">News</Link>
			<Link to="/forum">Forum</Link>
			<Link to="/hire">Hire</Link>
			<Link to="/qna">Qna</Link>
			<Link to="/talk">Talk</Link>
			<Link to="/chat">Chat</Link>
		</div>
	);
}

export default Navigation; 