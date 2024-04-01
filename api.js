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
app.use(async (req, res, next) => {
    try {
        const get_id = await axios.get(`https://${instance}/api/v1/accounts/lookup?acct=${acc_name}`);
        id = get_id.data.id;
        //console.log(id);
        next();
    } catch (error) {
        console.log(error);
    }
})

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
app.get("/api/v1/timelines/home", async (req, res) => {
    try {
        const response = await axios.get(`https://${instance}/api/v1/timelines/home`, {
            headers: {
                Authorization: `Bearer ${token}`
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

function resolve(username){
    
    // console.log(acc_name);
    // console.log(instance);
}
//resolve("dharunth@mastodon.social");

/* NOTES
1. way to know which user is logged on to load respective timeline based on username '@name@instance'
2. get timeline without using bearer token which requires user to create new app and share the token
*/

//step 1 - make it dynamic
//step 2 - login page - redirect to mastodon(refer to soapbox/vikalp)
//step 3 - make a new post/edit post