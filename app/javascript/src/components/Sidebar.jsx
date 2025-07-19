import React from "react";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isActive = path => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-16 flex-col justify-between bg-gray-800 md:flex">
      {/* Top: Logo */}
      <div className="mt-6 flex flex-col items-center">
        <Link className="mb-8" to="/">
          <span className="block flex h-10 w-10 items-center justify-center rounded-lg bg-black text-2xl font-bold text-white">
            B
          </span>
        </Link>
        <nav className="mt-8 flex flex-col space-y-6">
          <Link
            title="Home"
            to="/"
            className={`group flex flex-col items-center ${
              isActive("/") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <svg
              className="mb-1 h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v6a2 2 0 002 2h4a2 2 0 002-2v-6m-6 0h6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link
            title="Posts"
            to="/posts"
            className={`group flex flex-col items-center ${
              isActive("/posts")
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <svg
              className="mb-1 h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h3.28a2 2 0 001.42-.59l1.3-1.3a2 2 0 012.83 0l1.3 1.3A2 2 0 0015.72 5H19a2 2 0 012 2v12a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">Posts</span>
          </Link>
          <Link
            title="New Post"
            to="/posts/new"
            className={`group flex flex-col items-center ${
              isActive("/posts/new")
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <svg
              className="mb-1 h-6 w-6"
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
            <span className="text-xs">New</span>
          </Link>
          <Link
            title="About"
            to="/about"
            className={`group flex flex-col items-center ${
              isActive("/about")
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <svg
              className="mb-1 h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs">About</span>
          </Link>
        </nav>
      </div>
      {/* Bottom: User avatar */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
          <span aria-label="User" role="img">
            👤
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
