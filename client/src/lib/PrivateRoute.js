import React, { useState, useEffect } from 'react';
import { Route, Redirect } from "react-router-dom";
import Axios from 'axios';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const [isLogin, setIsLogin] = useState('');

    useEffect(() => {
       Axios.get("/member/session").then((res) => {
            setIsLogin(res.data.loggedIn);
        });
    }, [isLogin]);
    return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
        <Route
            {...rest}
            render={(props) => (isLogin ? <Component {...props} /> : (alert("로그인 후 이용 가능 합니다!"),<Redirect to="/login" />))}
        />
    );
}

export default PrivateRoute;