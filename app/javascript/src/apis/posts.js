import axios from "axios";

const list = () => axios.get("posts");
const show = slug => axios.get(`posts/${slug}`);

const postsApi = { list, show };

export default postsApi;
