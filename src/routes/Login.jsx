import React, { useEffect } from "react";
import LoginPage from "../components/LoginPage";
import "../index.css";
import "../styles/login.css";

// Login page
function Login(){
    useEffect(() => {
        document.title = "Login | Vikalp";
    }, []);

    return(
        <div className="main">
            <LoginPage />
        </div>
    );
}

export default Login;