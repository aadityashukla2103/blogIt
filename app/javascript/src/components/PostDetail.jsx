import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import postsApi from "apis/posts";

const PostDetail = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { slug } = useParams();

    const fetchPost = async () => {
        try {
            setLoading(true);
            const { data } = await postsApi.show(slug);
            setPost(data);
        } catch (err) {
            setError("Post not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

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
                    <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
                    <p className="mb-6">The post you're looking for doesn't exist.</p>
                    <Link
                        to="/posts"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                        ← Back to Posts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-8">
            <div className="mt-12 mb-8">
                <Link
                    to="/posts"
                    className="text-blue-600 hover:text-blue-700 font-semibold mb-6 inline-block"
                >
                    ← Back to Posts
                </Link>
            </div>

            <article className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                    <div className="text-sm text-gray-500">
                        Published on {formatDate(post.created_at)}
                    </div>
                </header>

                <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed">
                        {post.description}
                    </p>
                </div>
            </article>
        </div>
    );
};

export default PostDetail;
