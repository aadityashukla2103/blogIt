import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import { either, isEmpty, isNil } from "ramda";

import PostsNavbar from "./PostsNavbar";

import PostCard from "../PostCard";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await postsApi.list();
      setPosts(data.posts);
    } catch {
      // Error handling for fetching posts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
      </div>
    </div>
  );
};

export default PostsList;
