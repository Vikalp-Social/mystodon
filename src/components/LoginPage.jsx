import React, {useState, useContext, useEffect} from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import APIClient from "../apis/APIClient";
import { useErrors } from "../context/ErrorContext";
import { UserContext} from "../context/UserContext";
import "../styles/login.css";

let id = "";
let secret = "";

function LoginPage() {
    const {setCurrentUser, isLoggedIn, setLoggedIn} = useContext(UserContext);
    const { setError} = useErrors();
    const [instance, setInstance] = useState("");
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        if(localStorage.getItem("server") === null){
            localStorage.setItem("server", 1);
        }

        if(isLoggedIn){
            navigate(`${paths.home}`);
        }
        else {
            setLoading(false);
        }
        
        // Check if the user is coming back from the auth page
        if(window.location.pathname === '/auth/'){
            const [q, c] = window.location.search.split("=");
            handleAuth(localStorage.getItem("id"), localStorage.getItem("secret"), c, localStorage.getItem("instance"));
        }
    }, [isLoggedIn]);

    //function to handle the submit of the form and register the user application
    async function handleSubmit(event){
        event.preventDefault();
        localStorage.setItem("instance", instance);

        try {
            const register_app = await APIClient.post(`/register`, {
                instance: instance,
            });
            // Save the client id and secret in the local storage so that the data isn't lost on reload
            localStorage.setItem("id", register_app.data.client_id);
            localStorage.setItem("secret", register_app.data.client_secret);
            window.location.href = (`https://${instance}/oauth/authorize?client_id=${register_app.data.client_id}&scope=read+write+push&redirect_uri=https%3A%2F%2Fsrg.social/auth/&response_type=code`)
        } catch (error) {
            console.log(error);
            //setError(error.response.data);
        }

        
    }

    //function to handle the authentication of the user
    async function handleAuth(id, secret, code, user_instance){
        setLoading(true);
        try {
            const authorize = await APIClient.post(`/auth`, {
                instance: user_instance,
                id: id,
                secret: secret,
                code: code,
            });
            console.log(authorize)
            const user = {
                name: authorize.data.account.display_name,
                username: authorize.data.account.username,
                instance: user_instance,
                id: authorize.data.account.id,
                token: authorize.data.token,
                avatar: authorize.data.account.avatar,
            }
            console.log(user)
            // Set the current user in the context
            setCurrentUser(user);
            localStorage.removeItem("id");
            localStorage.removeItem("secret");
            localStorage.setItem('selectedTheme', "dark");
            setLoggedIn(true);
            setLoading(false);
        } catch (error) {
            setError(error)
        }
    }

    return(
        <>
        {loading ? <div className="load-container"><div className="loader"></div></div> : <div className="login">
            <div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="login-form">
                        <div><label htmlFor="name">Enter your Mastodon/Pleroma Instance URL below</label></div>
                        <div><input value={instance} onChange={(event) => setInstance(event.target.value)} id="name" placeholder="example.com" type="text" className="form-control" /></div>
                        <div><button className="my-button" type="submit">Log In</button></div>
                    </div>
                </form>
                <div>
                    <ul className="list-disc">
                        <li className="text-xl">Vikalp is just a frontend</li>
                        <li className="text-xl">Everything runs in your browser</li>
                        <li className="text-xl">We do not store any information about you</li>
                    </ul>
                </div>
            </div>
        </div>}
        </>
    );
}

export default LoginPage;