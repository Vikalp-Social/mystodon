import React, { useEffect } from "react";
import LoginPage from "../components/LoginPage";
import Navbar from "../components/Navbar";

function Login(){
    useEffect(() => {
        document.title = "Login | Vikalp";
    }, [])

    return(
        <div className="main">
            <LoginPage />
        </div>
         
    );
}

export default Login;