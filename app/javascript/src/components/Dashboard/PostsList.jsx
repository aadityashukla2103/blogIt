import React, { useState, useEffect, useCallback } from "react";

import { Pagination } from "@bigbinary/neetoui";
import postsApi from "apis/posts";
import { either, isEmpty, isNil } from "ramda";

import CategoriesSidebar from "./CategoriesSidebar";
import PostsNavbar from "./PostsNavbar";

import PostCard from "../PostCard";
import Sidebar from "../Sidebar";

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [pagy, setPagy] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchPosts = useCallback(
    async (pageNum = 1, categoryIds = selectedCategories) => {
      setLoading(true);
      try {
        const { data } = await postsApi.list(
          pageNum,
          5,
          categoryIds,
          "published"
        );
        setPosts(data.posts);
        setPagy(data.pagy);
        setPage(pageNum);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    },
    [selectedCategories]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  const handlePageChange = newPage => {
    if (newPage !== page && newPage > 0 && (!pagy || newPage <= pagy.pages)) {
      fetchPosts(newPage);
    }
  };

  const handleSelectCategory = categories => {
    setSelectedCategories(categories);
    fetchPosts(1, categories); // ✅ send selected categories
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (either(isEmpty, isNil)(posts)) {
    return (
      <div className="flex flex-col bg-white md:min-h-screen md:flex-row">
        {/* Top navbar (always visible) */}
        <PostsNavbar onOpenCategories={() => setCategorySidebarOpen(true)} />
        {/* Sidebar - visible only on medium (md) and up */}
        <Sidebar
          className="hidden w-64 md:block"
          onOpenCategories={() => setCategorySidebarOpen(true)}
        />
        {/* Slide-out category sidebar (used on all screen sizes) */}
        <CategoriesSidebar
          open={categorySidebarOpen}
          selectedCategories={selectedCategories}
          onClose={() => setCategorySidebarOpen(false)}
          onSelectCategory={handleSelectCategory}
        />
        {/* Main content */}
        <div className="flex-1 px-4 py-8 text-center text-gray-600 sm:px-6 md:px-8">
          <p className="mb-4 text-lg">No blog posts found!</p>
          <p className="text-sm">Create your first post to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-screen bg-white pl-16">
      <Sidebar
        className="w-64"
        onOpenCategories={() => setCategorySidebarOpen(true)}
      />
      <div className="flex flex-1 flex-col px-8">
        <PostsNavbar />
        <CategoriesSidebar
          open={categorySidebarOpen}
          selectedCategories={selectedCategories}
          onClose={() => setCategorySidebarOpen(false)}
          onSelectCategory={handleSelectCategory}
        />
        <div className="py-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} variant="list" />
          ))}
          {pagy && pagy.pages > 1 && (
            <div className="mt-8 flex items-center justify-end space-x-2">
              <Pagination
                count={pagy.count}
                navigate={handlePageChange}
                pageNo={pagy.page}
                pageSize={pagy.items}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostsList;
