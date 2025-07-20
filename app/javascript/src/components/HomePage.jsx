import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import { either, isEmpty, isNil, take } from "ramda";
import { Link } from "react-router-dom";

import PostCard from "./PostCard";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await postsApi.list();
      // Take only the first 3 posts for the home page
      setPosts(take(3, data.posts));
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 px-6 py-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-gray-900">
          Welcome to BlogIt
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          Discover amazing stories, insights, and ideas from our community of
          writers. Start your reading journey today.
        </p>
        <Link
          className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          to="/posts"
        >
          Explore All Posts
        </Link>
      </div>
      {/* Featured Posts Section */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Featured Posts</h2>
          <Link
            className="font-semibold text-blue-600 hover:text-blue-700"
            to="/posts"
          >
            View All →
          </Link>
        </div>
        {either(isEmpty, isNil)(posts) ? (
          <div className="py-12 text-center text-gray-600">
            <p className="mb-4 text-lg">No blog posts found!</p>
            <p className="text-sm">Check back soon for new content.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} variant="featured" />
            ))}
          </div>
        )}
      </div>
      {/* About Section */}
      <div className="bg-white px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-gray-900">
            About BlogIt
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            BlogIt is a platform for sharing knowledge, stories, and insights.
            Whether you're a writer looking to share your thoughts or a reader
            seeking inspiration, you'll find your place here.
          </p>
          <Link
            className="inline-block rounded-lg border-2 border-blue-600 px-6 py-2 font-semibold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white"
            to="/about"
          >
            Learn More About Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
