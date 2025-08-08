import React, { useState, useEffect } from "react";

import { Pagination } from "@bigbinary/neetoui";
import postsApi from "apis/posts";
import { either, isEmpty, isNil } from "ramda";

import BulkEditBar from "./BulkEditBar";
import CategoriesSidebar from "./CategoriesSidebar";
import PostsNavbar from "./PostsNavbar";

import UserTable from "../commons/Table/Table";
import Sidebar from "../Sidebar";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pagy, setPagy] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    title: "",
    categories: [],
    status: null,
  });

  // State to manage visibility of columns
  const [visibleColumns, setVisibleColumns] = useState({
    title: true,
    category: true,
    publishedAt: true,
    status: true,
  });

  const fetchPosts = async (
    pageNum = 1,
    categoryIds = selectedCategories,
    filters = activeFilters
  ) => {
    setLoading(true);
    try {
      // Extract category IDs from the filters.categories array of objects
      const categoryIdsToSend =
        filters.categories && filters.categories.length > 0
          ? filters.categories
              .map(cat => cat.value || cat.id || cat)
              .filter(Boolean)
          : categoryIds || [];

      // Extract status value from the status object if it exists
      let statusToSend = null;

      if (filters.status) {
        if (typeof filters.status === "object" && filters.status.value) {
          statusToSend = filters.status.value;
        } else if (typeof filters.status === "string") {
          statusToSend = filters.status;
        }
      }

      const { data } = await postsApi.list(
        pageNum,
        10,
        categoryIdsToSend,
        statusToSend
      );
      let filteredPosts = data.posts;

      // Apply title filter on the frontend for now
      if (filters.title) {
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(filters.title.toLowerCase())
        );
      }

      setPosts(filteredPosts);
      setPagy(data.pagy);
      setPage(pageNum);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = newPage => {
    if (newPage !== page && newPage > 0 && (!pagy || newPage <= pagy.pages)) {
      fetchPosts(newPage);
    }
  };

  const handleSelectCategory = categories => {
    setSelectedCategories(categories);
    fetchPosts(1, categories, activeFilters);
  };

  const handleApplyFilters = filters => {
    setActiveFilters(filters); // Save the filters in state
    fetchPosts(1, selectedCategories, filters); // Fetch filtered posts from page 1
  };

  const handleClearFilters = () => {
    const resetFilters = {
      title: "",
      categories: [],
      status: null,
    };

    setSelectedCategories([]);
    setActiveFilters(resetFilters);
    setPage(1);
    fetchPosts(1, [], resetFilters);
  };

  const handleUnpublish = async post => {
    try {
      await postsApi.update({
        slug: post.slug,
        payload: {
          title: post.title,
          description: post.description,
          status: "draft",
          published_at: null,
        },
      });

      fetchPosts(page);
    } catch {
      // Handle error
    }
  };

  const handleDelete = async post => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsApi.destroy(post.slug);

        fetchPosts(page);
      } catch {
        // Handle error
      }
    }
  };

  const formatDate = dateString => {
    if (!dateString) return "Not published";

    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = status => {
    const statusStyles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const toggleColumnVisibility = column => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const handleStatusChangeAll = async status => {
    const now = new Date().toISOString();

    setPosts(prevPosts =>
      prevPosts.map(post =>
        selectedPostIds.includes(post.id)
          ? {
              ...post,
              status,
              published_at:
                status === "published"
                  ? post.published_at || now // keep old date if exists
                  : null,
            }
          : post
      )
    );

    setSelectedPostIds([]);

    try {
      await postsApi.updateAll({ ids: selectedPostIds, status });
    } catch {
      //for errors
    }
  };

  const handleDeleteAll = async () => {
    setPosts(prevPosts =>
      prevPosts.filter(post => !selectedPostIds.includes(post.id))
    );
    try {
      await postsApi.deleteAll(selectedPostIds);
      fetchPosts(page);
      // Fetch posts again
    } catch {
      //for errors
    }
  };

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (either(isEmpty, isNil)(posts)) {
    return (
      <div>
        <Sidebar onOpenCategories={() => setCategorySidebarOpen(true)} />
        <div className="bg-white md:ml-16">
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
        <div className="py-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            My blog posts
          </h1>
          <BulkEditBar
            activeFilters={activeFilters}
            handleApplyFilters={handleApplyFilters}
            handleClearFilters={handleClearFilters}
            handleDeleteAll={handleDeleteAll}
            handleStatusChangeAll={handleStatusChangeAll}
            posts={posts}
            selectedPostIds={selectedPostIds}
            toggleColumnVisibility={toggleColumnVisibility}
            visibleColumns={visibleColumns}
          />
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <UserTable
              formatDate={formatDate}
              getStatusBadge={getStatusBadge}
              handleDelete={handleDelete}
              handleUnpublish={handleUnpublish}
              posts={posts}
              selectedPostIds={selectedPostIds}
              setSelectedPostIds={setSelectedPostIds}
              visibleColumns={visibleColumns}
            />
          </div>
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

export default MyPosts;
