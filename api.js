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
app.get("/api/v1/account", async (req, res) => {
    try {
        const response = await axios.get(`https://${instance}/api/v1/accounts/${id}`);
        res.status(200).json({
            status: "Success",
            count: response.data.count,
            data: {
                account: response.data,
            }
        });
        //console.log(response.data);
    } catch (error) {
        console.log(error);
    }
})

//fetch user statuses
app.get("/api/v1/statuses", async (req, res) => {
    try {
        const response = await axios.get(`https://${instance}/api/v1/accounts/${id}/statuses`);
        res.status(200).json({
            status: "Success",
            count: response.data.count,
            data: {
                statuses: response.data,
            }
        });
        //console.log(response.data);
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

//fetch public timeline from instance
app.get("/api/v1/timelines/public", async (req, res) => {
    try {
        const response = await axios.get(`https://${instance}/api/v1/timelines/public`);
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
