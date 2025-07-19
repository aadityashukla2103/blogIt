import axios from "axios";

const list = () => axios.get("posts");
const show = slug => axios.get(`posts/${slug}`);
const create = data => axios.post("posts", data);

const postsApi = { list, show, create };

export default postsApi;
