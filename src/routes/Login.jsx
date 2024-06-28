import React, { useEffect } from "react";
import LoginPage from "../components/LoginPage";

// Login page
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