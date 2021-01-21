import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";
import Axios from "axios";

function Header(props) {
	const [role, setRole] = useState(false);

	Axios.defaults.withCredentials = true;

	const handleClick = (req, res) => {
		alert("로그아웃 되었습니다");
		Axios.get("http://localhost:8000/logout").then(() => {
			props.history.push("/");
			setRole(false);
		});
	}

	useEffect(() => {
		Axios.get("http://localhost:8000/login").then((response) => {
			if (response.data.loggedIn == true) {
				setRole(true);
			}
		});
	}, [role]);

	return (
		<div className="box">
		<div className="head">
		{
			role ? (<div className="Signout" onClick={handleClick}>Signout</div>) : 
			(
				<div className="Signin">
				<Link to="/signup">Signup</Link>
				<Link to="/login">Signin</Link>
				</div>
				)
		}
		</div>
		</div>
		);
}

export default Header; 

