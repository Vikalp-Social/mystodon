import React, {useState} from "react";
import axios from "axios";

let id = "";
let secret = "";

function LoginPage() {
    const [auth, setAuth] = useState(false);
    const [authcode, setAuthCode] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [user_instance, setInstance] = useState("");

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

        //console.log(user_instance);

        const authorize = await axios.post(`https://${user_instance}/oauth/token`, {
            client_id: id,
            client_secret: secret,
            redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
            grant_type: "authorization_code",
            code: authcode,
            scope: "read write push",
        });

        //console.log(authorize.data);
        let token = authorize.data.access_token;

        const verify = await axios.get(`https://${user_instance}/api/v1/accounts/verify_credentials`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        // console.log(verify.data);

        if(verify.data.username === name){
            const response = await axios.post("http://localhost:3000/api/v1/timelines/home", {token});

            // setData(response.data);
            console.log(response.data);
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