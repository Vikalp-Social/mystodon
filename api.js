import "dotenv/config";
import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000
const ref = new Date(1/1/1970);

app.use(cors());
app.use(bodyParser.json());

function score(date, likes, boosts){
    const d = new Date(date);
    const t = Math.floor(Math.abs(ref - d) / 1000);
    const x = likes + 2 * boosts;
    const y = x > 0 ? 1 : 0;
    const z = x >= 1 ? x : 1;
    return Math.log10(z) + (y * t / 45000);
}

function hotRanking(data){
    const statuses = data.map(status => {
        const s = status.reblog ? status.reblog : status;
        return {...status, score: score(s.created_at, s.favourites_count, s.reblogs_count)}
        
    });
    return statuses.sort((a, b) => b.score - a.score);
}

//register app
app.post("/api/v1/register", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/apps`, {
            client_name: "Vikalp",
            redirect_uris: "http://localhost:3001/auth",
            scopes: "read write push",
            website: "http://localhost:3001"
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log("sent");
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Instance not found",
                status: 404,
                statusText: "Not Found",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
})

//authenticate user
app.post("/api/v1/auth", async(req, res) => {
    console.log(req.body);
    try {
        const response = await axios.post(`https://${req.body.instance}/oauth/token`, {
            client_id: req.body.id,
            client_secret: req.body.secret,
            redirect_uri: "http://localhost:3001/auth",
            grant_type: "authorization_code",
            code: req.body.code,
            scope: "read write push",
        });
        const verify = await axios.get(`https://${req.body.instance}/api/v1/accounts/verify_credentials`, {
            headers: {
                Authorization: `Bearer ${response.data.access_token}`,
            }
        });
        res.status(200).json({account: verify.data, token: response.data.access_token});
        console.log(verify.data);
    } catch (error) {
        console.log(error);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
})

//fetch user account data
app.post("/api/v1/accounts/:id", async (req, res) => {
    try {
        const account = await axios.get(`https://${req.body.instance}/api/v1/accounts/${req.params.id}`);
        const statuses = await axios.get(`https://${req.body.instance}/api/v1/accounts/${req.params.id}/statuses`);
        res.status(200).json({
            status: "Success",
            account: account.data,
            statuses: {
                count: statuses.data.length,
                list: statuses.data,
            },
        });
        //console.log(response.data);
    } catch (error) {
        //console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//edit user profile
app.put("/api/v1/accounts", async (req, res) => {
    //console.log(req.body);
    try {
        const response = await axios.patch(`https://${req.body.instance}/api/v1/accounts/update_credentials`, {
            display_name: req.body.display_name,
            note: req.body.note,
        }, 
        {
            headers: {
                Authorization: `Bearer ${req.body.token}`
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//search 
app.post("/api/v1/search", async (req, res) => {
    //console.log(req.body);
    try {
        const response = await axios.get(`https://${req.body.instance}/api/v2/search`, {
            params: {
                q: req.body.q,
                //max_id: req.body.max_id,
            },
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        //console.log(response.data.statuses.length)
        res.json({
            accounts: response.data.accounts,
            statuses: hotRanking(response.data.statuses),
            hashtags: response.data.hashtags,
            //max_id: response.data.statuses[response.data.statuses.length - 1].id,
        });
    } catch (error) {
        console.log(error);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//follow a user
app.post("/api/v1/accounts/:id/follow", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/accounts/${req.params.id}/follow`, {}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//follow a tag
app.post("/api/v1/tags/:name/follow", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/tags/${req.params.name}/follow`, {}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//unfollow a user
app.post("/api/v1/accounts/:id/unfollow", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/accounts/${req.params.id}/unfollow`, {}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//unfollow a tag
app.post("/api/v1/tags/:name/unfollow", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/tags/${req.params.name}/unfollow`, {}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//post a status
app.post("/api/v1/statuses", async (req, res) => {
    //console.log(req.body)
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/statuses`, {
            status: req.body.message,
            media_ids: req.body.media_ids,
            in_reply_to_id: req.body.reply_id,
        }, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//edit a status
app.put("/api/v1/statuses/:id", async (req, res) => {
    console.log(req.body)
    try {
        const response = await axios.put(`https://${req.body.instance}/api/v1/statuses/${req.params.id}`, {status: req.body.text}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
})

//favorite or unfavourite a status
app.post("/api/v1/statuses/:id/favourite", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/statuses/${req.params.id}/${req.body.prefix}favourite`, {}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//boost or unboost a status
app.post("/api/v1/statuses/:id/boost", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/statuses/${req.params.id}/${req.body.prefix}reblog`, {}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//fetch a status
app.post("/api/v1/statuses/:id", async (req, res) => {
    try {
        const status = await axios.get(`https://${req.body.instance}/api/v1/statuses/${req.params.id}`, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        const replies = await axios.get(`https://${req.body.instance}/api/v1/statuses/${req.params.id}/context`, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json({
            status: status.data,
            replies: replies.data.descendants,
        });
    } catch (error) {
        //console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

//fetch tag timeline
app.post("/api/v1/timelines/tag/:name", async (req, res) => {
    try {
        const response = await axios.get(`https://${req.body.instance}/api/v1/timelines/tag/${req.params.name}?limit=30`, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
            params: {
                max_id: req.body.max_id,
            },
        });
        res.json({
            data: hotRanking(response.data),
            max_id: response.data[response.data.length - 1].id,
        });
    } catch (error) {
        console.log(error.response.data);;
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
})

//fetch home timeline 
app.post("/api/v1/timelines/home", async (req, res) => {
    //console.log(req.body);
    try {
        const response = await axios.get(`https://${req.body.instance}/api/v1/timelines/home?limit=30`, {
            headers: {
                Authorization: `Bearer ${req.body.token}`
            },
            params: {
                max_id: req.body.max_id,
            },
        });
        res.json({
            data: hotRanking(response.data),
            max_id: response.data[response.data.length - 1].id || '',
        })
        //res.json(response.data);
    } catch (error) {
        console.log(error)
        if(error.code === 'ENOTFOUND'){
            res.status(502).json({
                error: "Can't Establish a connection to the server",
                status: 502,
                statusText: "Bad Gateway",
            });
        } else {
            res.status(400).json({
                error: error.response.data.error,
                status: error.response.status,
                statusText: error.response.statusText,
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
