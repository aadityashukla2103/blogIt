import React, { useState, useEffect, useCallback } from "react";

import postsApi from "apis/posts";
import { useParams, Link } from "react-router-dom";

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await postsApi.show(slug);
      setPost(data);
    } catch {
      setError("Post not found");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const formatDate = dateString =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="w-full px-4 md:px-8">
        <div className="mt-12 text-center">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-full px-4 md:px-8">
        <div className="mt-12 text-center text-gray-600">
          <h1 className="mb-4 text-2xl font-bold">Post Not Found</h1>
          <p className="mb-6">The post you're looking for doesn't exist.</p>
          <Link
            className="font-semibold text-blue-600 hover:text-blue-700"
            to="/posts"
          >
            ← Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8">
      <div className="mb-8 mt-12">
        <Link
          className="mb-6 inline-block font-semibold text-blue-600 hover:text-blue-700"
          to="/posts"
        >
          ← Back to Posts
        </Link>
      </div>
      <article className="mx-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            {post.title}
          </h1>
          <div className="text-sm text-gray-500">
            Published on {formatDate(post.created_at)}
          </div>
        </header>
        <div className="prose prose-lg max-w-none">
          <p className="text-lg leading-relaxed text-gray-700">
            {post.description}
          </p>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
