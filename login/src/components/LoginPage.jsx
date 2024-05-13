import React, {useState, useContext, useEffect} from "react";
import axios from "axios";
import { UserContext} from "../context/UserContext";
import { useNavigate } from "react-router-dom";

let id = "";
let secret = "";

function LoginPage() {
    const {setCurrentUser, isLoggedIn, setLoggedIn} = useContext(UserContext);
    const [auth, setAuth] = useState(false);
    const [authcode, setAuthCode] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [user_instance, setInstance] = useState("");
    let navigate = useNavigate();

    useEffect(() => {
        if(isLoggedIn){
            navigate("/home");
        }
    }, [isLoggedIn, navigate]);

    async function handleSubmit(event){
        event.preventDefault();
        const [acc_name, instance] = username.split("@");
        setName(acc_name);
        setInstance(instance);

        const register_app = await axios.post(`https://${instance}/api/v1/apps`, {
            client_name: acc_name,
            redirect_uris: "urn:ietf:wg:oauth:2.0:oob",
            scopes: "read write push",
        });
        //console.log(register_app.data);
        const client = register_app.data;
        id = client.client_id;
        secret = client.client_secret;

        if(client.client_id){
            window.open(`https://${instance}/oauth/authorize?client_id=${client.client_id}&scope=read+write+push&redirect_uri=urn:ietf:wg:oauth:2.0:oob&response_type=code`,
            '_blank', 'noopener,noreferrer')
            setAuth(true);
        }
    }

    async function handleAuth(event){
        event.preventDefault();

        const authorize = await axios.post(`https://${user_instance}/oauth/token`, {
            client_id: id,
            client_secret: secret,
            redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
            grant_type: "authorization_code",
            code: authcode,
            scope: "read write push",
        });

        let token = authorize.data.access_token;

        const verify = await axios.get(`https://${user_instance}/api/v1/accounts/verify_credentials`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        //console.log(verify.data);

        const user = {
            name,
            instance: user_instance,
            id: verify.data.id,
            token,
            avatar: verify.data.avatar,
        }
        setCurrentUser(user);
        setLoggedIn(true);

        if(verify.data.username === name){
            navigate("/home");
        }
    }

    return(
        <div>
        {auth? 
            <form action="" onSubmit={handleAuth}>
                <label htmlFor="code">Authorization Code</label>
                <input value={authcode} onChange={(event) => setAuthCode(event.target.value)} id="code" type="text" className="form-control" />
                <button type="submit">submit</button>
            </form>
            :
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input value={username} onChange={(event) => setUsername(event.target.value)} id="name" placeholder="Name" type="text" className="form-control" />
                <button type="submit">submit</button>
            </form>
            }

        </div>
    );
}

export default LoginPage;