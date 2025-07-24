import React from "react";

import { Link } from "react-router-dom";

const PostsNavbar = () => (
  <div className="border-b border-gray-200 bg-white px-6 py-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          to="/posts/new"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 4v16m8-8H4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Add New Post
        </Link>
      </div>
    </div>
  </div>
);

export default PostsNavbar;
