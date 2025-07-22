import axios from "axios";

const list = (page = 1, items = 5) =>
  axios.get(`posts?page=${page}&items=${items}`);
const show = slug => axios.get(`posts/${slug}`);
const create = data => axios.post("posts", data);

const postsApi = { list, show, create };

export default postsApi;
