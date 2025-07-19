import React, { useState, useEffect } from "react";

import { either, isEmpty, isNil } from "ramda";

import postsApi from "apis/posts";
import PostCard from "../PostCard";

const PostsList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const { data } = await postsApi.list();
            setPosts(data.posts);
        } catch (error) {
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
            <div className="p-4 text-center text-gray-600">
                No blog posts found!
            </div>
        );
    }

    return (
        <div className="w-full px-4 md:px-8">
            <h1 className="mt-12 mb-10 text-5xl font-bold text-gray-900">Blog posts</h1>
            {posts.map(post => (
                <PostCard key={post.id} post={post} variant="list" />
            ))}
        </div>
    );
};

export default PostsList;
