import axios from "axios";

//created a new instance of axios so that any changes in the base url can be done here
export default axios.create({
    baseURL: "http://localhost:3000/api/v1",
});