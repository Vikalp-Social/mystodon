import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000
const token = process.env.TOKEN
var instance = "mastodon.social";
var acc_name = "dharunth";
var id = '';

app.use(cors());
app.use(bodyParser.json());

//can have a useEffect to send the username of the logged in user to resolve their 
// app.use((req, res, next) => {
//     const username = req.body.username
//     const [acc_name, instance] = username.split("@");
//     next();
// });

//middleware to get logged in user id
// app.use(async (req, res, next) => {
//     try {
//         const get_id = await axios.get(`https://${instance}/api/v1/accounts/lookup?acct=${name}`);
//         id = get_id.data.id;
//         //console.log(id);
//         next();
//     } catch (error) {
//         console.log(error);
//     }
// })

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
        console.log(error);
    }
});

//edit user profile
app.put("/api/v1/accounts", async (req, res) => {
    console.log(req.body);
    const response = await axios.patch(`https://${req.body.instance}/api/v1/accounts/update_credentials`, {
        display_name: req.body.display_name,
        note: req.body.note,
    }, 
    {
        headers: {
            Authorization: `Bearer ${req.body.token}`
        }
    });
});

//post a status
app.post("/api/v1/statuses", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/statuses`, {status: req.body.message}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
    }
});

//edit a status
app.put("/api/v1/statuses/:id", async (req, res) => {
    try {
        const response = await axios.put(`https://${req.body.instance}/api/v1/statuses/${req.params.id}`, {status: req.body.text}, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
    }
});

//delete a status
app.post("/api/v1/statuses/:id", async (req, res) => {
    try {
        const response = await axios.delete(`https://${req.body.instance}/api/v1/statuses/${req.params.id}`, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
    }
});

//fetch home timeline 
app.post("/api/v1/timelines/home", async (req, res) => {
    //console.log(req.body);
    try {
        const response = await axios.get(`https://${req.body.instance}/api/v1/timelines/home?limit=30`, {
            headers: {
                Authorization: `Bearer ${req.body.token}`
        }});
        res.status(200).json({
            status: "Success",
            count: response.data.count,
            data: {
                timeline: response.data,
            }
        });
        //console.log(response.data);
    } catch (error) {
        console.log(error);
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
