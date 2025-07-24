import React, { useState, useEffect } from "react";

import postsApi from "apis/posts";
import { either, isEmpty, isNil } from "ramda";

import CategoriesSidebar from "./CategoriesSidebar";
import PostsNavbar from "./PostsNavbar";

import Pagination from "../Pagination";
import PostCard from "../PostCard";
import Sidebar from "../Sidebar";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [pagy, setPagy] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const handleSelectCategory = categories => {
    setSelectedCategories(categories);
    // Do not close the sidebar here
  };

  const filteredPosts =
    selectedCategories.length > 0
      ? posts.filter(
          post =>
            post.categories &&
            post.categories.some(cat => selectedCategories.includes(cat))
        )
      : posts;

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (either(isEmpty, isNil)(filteredPosts)) {
    return (
      <div className="w-full bg-white">
        <PostsNavbar onOpenCategories={() => setCategorySidebarOpen(true)} />
        <CategoriesSidebar
          open={categorySidebarOpen}
          selectedCategories={selectedCategories}
          onClose={() => setCategorySidebarOpen(false)}
          onSelectCategory={handleSelectCategory}
        />
        <div className="px-6 py-8 text-center text-gray-600">
          <p className="mb-4 text-lg">No blog posts found!</p>
          <p className="text-sm">Create your first post to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <Sidebar onOpenCategories={() => setCategorySidebarOpen(true)} />
      <PostsNavbar />
      <CategoriesSidebar
        open={categorySidebarOpen}
        selectedCategories={selectedCategories}
        onClose={() => setCategorySidebarOpen(false)}
        onSelectCategory={handleSelectCategory}
      />
      <div className="px-6 py-8">
        {filteredPosts.map(post => (
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
