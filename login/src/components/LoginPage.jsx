// import React, {useState, useContext, useEffect} from "react";
// import axios from "axios";
// import { UserContext} from "../context/UserContext";
// import { useNavigate } from "react-router-dom";

// let id = "";
// let secret = "";

// function LoginPage() {
//     const {setCurrentUser, isLoggedIn, setLoggedIn} = useContext(UserContext);
//     const [auth, setAuth] = useState(false);
//     const [authcode, setAuthCode] = useState("");
//     const [username, setUsername] = useState("");
//     const [name, setName] = useState("");
//     const [user_instance, setInstance] = useState("");
//     let navigate = useNavigate();

//     useEffect(() => {
//         if(isLoggedIn){
//             navigate("/home");
//         }
//     }, [isLoggedIn, navigate]);

//     async function handleSubmit(event){
//         event.preventDefault();
//         const [acc_name, instance] = username.split("@");
//         setName(acc_name);
//         setInstance(instance);

//         const register_app = await axios.post(`https://${instance}/api/v1/apps`, {
//             client_name: acc_name,
//             redirect_uris: "urn:ietf:wg:oauth:2.0:oob",
//             scopes: "read write push",
//         });
//         //console.log(register_app.data);
//         const client = register_app.data;
//         id = client.client_id;
//         secret = client.client_secret;

//         if(client.client_id){
//             window.open(`https://${instance}/oauth/authorize?client_id=${client.client_id}&scope=read+write+push&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code`,
//             '_blank', 'noopener,noreferrer')
//             setAuth(true);
//         }
//     }

//     async function handleAuth(event){
//         event.preventDefault();

//         const authorize = await axios.post(`https://${user_instance}/oauth/token`, {
//             client_id: id,
//             client_secret: secret,
//             redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
//             grant_type: "authorization_code",
//             code: authcode,
//             scope: "read write push",
//         });

//         let token = authorize.data.access_token;

//         const verify = await axios.get(`https://${user_instance}/api/v1/accounts/verify_credentials`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             }
//         });
//         //console.log(verify.data);

//         const user = {
//             name,
//             instance: user_instance,
//             id: verify.data.id,
//             token,
//             avatar: verify.data.avatar,
//         }
//         setCurrentUser(user);
//         setLoggedIn(true);

//         if(verify.data.username === name){
//             navigate("/home");
//         }
//     }

//     return(
//         <div className="login">
//             <div>
//                 {!auth ?
//                     <form action="" onSubmit={handleSubmit}>
//                         <div className="login-form">
//                             <div><label htmlFor="name">Enter your Mastodon/Pleroma Instance URL below</label></div>
//                             <div><input value={username} onChange={(event) => setUsername(event.target.value)} id="name" placeholder="example.com" type="text" className="form-control" required/></div>
//                             <div><button className="my-button"type="submit">Log In</button></div>
//                         </div>
//                     </form>
//                 :
//                     <form action="" onSubmit={handleAuth}>
//                         <div className="login-form">
//                             <div><label htmlFor="code">Enter the Authorization Code below</label></div>
//                             <div><input value={authcode} onChange={(event) => setAuthCode(event.target.value)} id="code" type="text" className="form-control" required/></div>
//                             <div><button type="submit">Submit</button></div>
//                         </div>
//                     </form>
//                 }
//                 <div>
//                     <ul className="list-disc">
//                         <li className="text-xl">Vikalp is just a frontend</li>
//                         <li className="text-xl">Everything runs in your browser</li>
//                         <li className="text-xl">We do not store any information about you</li>
//                     </ul>
//                 </div>
//             </div>
//         </div>

//     );
// }

// export default LoginPage;

import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import { UserContext} from "../context/UserContext";
import { useNavigate } from "react-router-dom";

let id = "";
let secret = "";
let code = "";

function LoginPage() {
    const {setCurrentUser, isLoggedIn, setLoggedIn} = useContext(UserContext);
    const [instance, setInstance] = useState("");
    const [name, setName] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn){
            navigate("/home");
        }
        
        if(window.location.pathname === '/auth'){
            const [q, c] = window.location.search.split("=");
            handleAuth(localStorage.getItem("id"), localStorage.getItem("secret"), c, localStorage.getItem("instance"));
        }
    }, [isLoggedIn]);

    async function handleSubmit(event){
        event.preventDefault();
        localStorage.setItem("instance", instance);

        const register_app = await axios.post(`https://${instance}/api/v1/apps`, {
            client_name: "Vikalp",
            redirect_uris: "http://localhost:3001/auth",
            scopes: "read write push",
            website: "http://localhost:3001"
        });
        //console.log(register_app.data);
        const client = register_app.data;
        id = client.client_id;
        secret = client.client_secret;
        localStorage.setItem("id", id);
        localStorage.setItem("secret", secret);

        if(client.client_id){
            //getAuthCode(instance, client);
            window.location.href = (`https://${instance}/oauth/authorize?client_id=${client.client_id}&scope=read+write+push&redirect_uri=http%3A%2F%2Flocalhost:3001/auth&response_type=code`)
        }
    }

    async function handleAuth(id, secret, code, user_instance){
        const authorize = await axios.post(`https://${user_instance}/oauth/token`, {
            client_id: id,
            client_secret: secret,
            redirect_uri: "http://localhost:3001/auth",
            grant_type: "authorization_code",
            code,
            scope: "read write push",
        });

        let token = authorize.data.access_token;

        const verify = await axios.get(`https://${user_instance}/api/v1/accounts/verify_credentials`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        const user = {
            name: verify.data.username,
            instance: user_instance,
            id: verify.data.id,
            token,
            avatar: verify.data.avatar,
        }
        setCurrentUser(user);
        setLoggedIn(true);
        localStorage.removeItem("id");
        localStorage.removeItem("secret");
    }

    return(
        <div className="login">
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
        </div>
    );
}

export default LoginPage;