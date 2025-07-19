import React, { useState } from "react";

import postsApi from "apis/posts";
import { useHistory } from "react-router-dom";

const NewPost = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await postsApi.create(formData);
      history.push("/posts");
    } catch {
      // Error handling for creating post
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">New blog post</h1>
        <div className="w-full">
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-gray-900"
                  htmlFor="title"
                >
                  Title*
                </label>
                <input
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="title"
                  name="title"
                  placeholder="Enter title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    className="block text-sm font-semibold text-gray-900"
                    htmlFor="description"
                  >
                    Description*
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.description.length}/10000
                  </span>
                </div>
                <textarea
                  required
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="description"
                  name="description"
                  placeholder="Enter description"
                  rows="8"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  className="rounded-lg border border-gray-300 px-6 py-2 text-gray-900 transition-colors hover:bg-gray-50"
                  type="button"
                  onClick={() => history.push("/posts")}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-gray-900 px-6 py-2 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? "Creating..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
