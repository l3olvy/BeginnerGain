import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";
import Axios from "axios";

function Header(props) {
    const [role, setRole] = useState(false);

    Axios.defaults.withCredentials = true;

    const handleClick = async () => {
        await Axios.get("http://localhost:8000/logout").then((res) => {
            alert("로그아웃 되었습니다");    
            setRole(false);
            window.location.replace("/");
        });
    }

    const getUser = async () => {
        await Axios.get("http://localhost:8000/login").then((res) => {
            if(res.data.loggedIn === true) {
                setRole(true);
            }
        });
    }

    useEffect(() => {
       getUser();
    }, []);

    return (
        <div className="box">
			<div className="head">
			{
				(role) ? (<div className="Signout" onClick={handleClick}>Signout</div>) : 
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