import axios from "axios";

const ports = {
    1: 3000,
    2: 5000,
}

const selectedServer = localStorage.getItem("server");
const port = ports[selectedServer];

if(!selectedServer){
    localStorage.setItem("server", 1);
    window.location.reload(false);
}
else if(!(selectedServer in ports)){
    alert("Invalid Server Selected. Redirecting to Default Server");
    localStorage.setItem("server", 1);
    window.location.reload(false);
    
}

//created a new instance of axios so that any changes in the base url can be done here
export default axios.create({
    baseURL: `http://localhost:${port}/api/v1`,
});