import React, { useState, useEffect } from 'react';
import { Route, Redirect } from "react-router-dom";
import Axios from 'axios';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
    const [isLogin, setIsLogin] = useState('');
    const [id, setId] = useState('');

    useEffect(() => {
       Axios.get("/member/session").then((res) => {
            setIsLogin(res.data.loggedIn);
            if(res.data.loggedIn === true) {
                setId(res.data.id);
            }
        });
    }, [isLogin, id]);
    return (
        <Route
          {...rest}
          render={(props) => (isLogin && restricted ? <Redirect to="/" /> : <Component {...props} id={id}/>)}
        />
    );
}

export default PublicRoute;