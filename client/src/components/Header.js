import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
	return (
		<div className="head">
			<Link to="/signup">signup</Link>
			<Link to="/login">login</Link>
		</div>
	);
}

export default Header; 

