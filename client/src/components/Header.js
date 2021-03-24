import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/Main.css";
import Axios from "axios";

function Header(props) {
    const [id, setId] = useState("");
    const mounted = useRef(false);

    const logout = async () => {
        await Axios.get("/member/logout").then((res) => {
            alert("로그아웃 되었습니다!");
            setId("");
            window.location.replace("/");
        });
    }

    const getUser = async (e) => {
        await Axios.get("/member/session").then((res) => {
            if(res.data !== "fail") setId(res.data.id);
        });
    }

    useEffect(() => {
        getUser();
    }, [])

    useEffect(() => {
        if(!mounted.currnet) {
            mounted.currnet = true;
        } else {
            getUser();
        }
    }, [id]);

    return (
        <div className="box">
			<div className="head">
			{
				(id === undefined || id === "" || id === null) ? (
                    <div className="Signin">
                        <Link to="/signup">Signup</Link>
                        <Link to="/login">Signin</Link>
                    </div> 
                    ) : ( <div className="Signout" onClick={logout}>Signout</div> )
			}
			</div>
		</div>
    );
}

export default Header;