import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import { either, isEmpty, isNil } from "ramda";

import PostsNavbar from "./PostsNavbar";

import Pagination from "../Pagination";
import PostCard from "../PostCard";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [pagy, setPagy] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await postsApi.list(pageNum);
      setPosts(data.posts);
      setPagy(data.pagy);
      setPage(pageNum);
    } catch {
      // Error handling for fetching posts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line
  }, []);

  const handlePageChange = newPage => {
    if (newPage !== page && newPage > 0 && (!pagy || newPage <= pagy.pages)) {
      fetchPosts(newPage);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (either(isEmpty, isNil)(posts)) {
    return (
      <div className="w-full bg-white">
        <PostsNavbar />
        <div className="px-6 py-8 text-center text-gray-600">
          <p className="mb-4 text-lg">No blog posts found!</p>
          <p className="text-sm">Create your first post to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <PostsNavbar />
      <div className="px-6 py-8">
        {posts.map(post => (
          <PostCard key={post.id} post={post} variant="list" />
        ))}
        {pagy && pagy.pages > 1 && (
          <div className="mt-8 flex items-center justify-end space-x-2">
            <Pagination
              currentPage={page}
              pagy={pagy}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
