import React, { useState, useEffect } from 'react';
import { Route, Redirect } from "react-router-dom";
import Axios from 'axios';

const PublicRoute = ({ component: Component, restricted, isLogin: isLogin, id: id, ...rest }) => {
    return (
        <Route
          {...rest}
          render={(props) => (isLogin && restricted ? <Redirect to="/" /> : <Component {...props} id={id}/>)}
        />
    );
}

export default PublicRoute;