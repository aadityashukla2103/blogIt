import axios from "axios";

const list = () => axios.get("categories");

const create = name => axios.post("categories", { name });

export default { create, list };
