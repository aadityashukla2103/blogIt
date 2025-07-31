import axios from "axios";

const list = (page = 1, items = 5, categoryIds = [], status) => {
  const params = new URLSearchParams({ page, items });
  if (categoryIds.length > 0) {
    categoryIds.forEach(id => params.append("category_ids[]", id));
  }

  if (status) {
    params.append("status", status);
  }

  return axios.get(`posts?${params.toString()}`);
};

const show = slug => axios.get(`posts/${slug}`);
const create = data => axios.post("posts", data);
const update = ({ slug, payload }) =>
  axios.put(`posts/${slug}`, { post: payload });

const destroy = slug => axios.delete(`posts/${slug}`);

const postsApi = { list, show, create, update, destroy };

export default postsApi;
