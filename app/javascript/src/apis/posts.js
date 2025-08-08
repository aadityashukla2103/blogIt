import axios from "axios";

const list = (page = 1, items = 5, categoryIds = [], status) => {
  const params = new URLSearchParams({ page, items });
  if (categoryIds && categoryIds.length > 0) {
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

const updateAll = ({ ids, status }) =>
  axios.put("/posts/bulk_update", { ids, status });

const deleteAll = ids =>
  axios.delete("/posts/bulk_destroy", {
    data: { ids },
  });

const postsApi = { list, show, create, update, destroy, updateAll, deleteAll };

export default postsApi;
