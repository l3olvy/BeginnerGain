import React from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";

function Header() {
	return (
		<div className="box">
			<div className="head">
				<div className="Signin">
					<Link to="/signup">Signup</Link>
					<Link to="/login">Signin</Link>
				</div>
				<div className="Signout">
					Signout
				</div>
			</div>
		</div>
	);
}

export default Header; 

