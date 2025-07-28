import axios from "axios";

const me = () => axios.get("/me");

const userApi = { me };

export default userApi;
