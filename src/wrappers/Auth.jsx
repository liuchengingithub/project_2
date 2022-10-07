import React from "react";
import { Redirect, useLocation } from "umi";
const Auth = (props) => {
    const location = useLocation()

    const isLogin = localStorage.getItem('token')
    const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
    // console.log(rights)
    rights.checked.push('/')
    if(isLogin){
        if(rights.checked.includes(location.pathname)){
            return <div>{props.children}</div>
        }
        return <Redirect to='/404' />
    }
    return <Redirect to='/login' />
}

export default Auth;