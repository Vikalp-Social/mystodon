import axios from "axios";

const urls = {
    1: "https://tov7mk1km9.execute-api.eu-north-1.amazonaws.com/stage1",  // URL for server 1
    2: "https://sentiment.srg.social",    // URL for server 2
};

const selectedServer = localStorage.getItem("server");

if (!(selectedServer in urls)) {
    alert("Invalid Server Selected. Redirecting to Default Server");
    localStorage.setItem("server", 1);
    window.location.reload(false);
}

const baseURL = urls[selectedServer];

// Created a new instance of axios with the dynamically selected baseURL
export default axios.create({
    baseURL: `${baseURL}/api/v1/`,
});
