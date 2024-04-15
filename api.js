import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000
const token = process.env.TOKEN

app.use(cors());
app.use(bodyParser.json());

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
    } catch (error) {
        console.log(error);
    }
});

//search 
app.post("/api/v1/search", async (req, res) => {
    try {
        const response = await axios.get(`https://${req.body.instance}/api/v2/search`, {
            params: {q: req.body.q},
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
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
        console.log(error);
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
        console.log(error);
    }
});

//post a status
app.post("/api/v1/statuses", async (req, res) => {
    try {
        const response = await axios.post(`https://${req.body.instance}/api/v1/statuses`, {
            status: req.body.message,
            in_reply_to_id: req.body.reply_id,
        }, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
            },
        });
        res.status(200).json(response.data);
    } catch (error) {
        console.log(error);
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
