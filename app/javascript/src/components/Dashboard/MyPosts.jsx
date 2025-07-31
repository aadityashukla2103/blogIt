import React, { useState, useEffect } from "react";

import { Pagination, Dropdown } from "@bigbinary/neetoui";
import postsApi from "apis/posts";
import { either, isEmpty, isNil } from "ramda";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

import CategoriesSidebar from "./CategoriesSidebar";
import PostsNavbar from "./PostsNavbar";

import Sidebar from "../Sidebar";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pagy, setPagy] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { Menu, MenuItem } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

  const fetchPosts = async (pageNum = 1, categoryIds = selectedCategories) => {
    setLoading(true);
    try {
      // Fetch all posts (both published and drafts) by not passing status
      const { data } = await postsApi.list(pageNum, 10, categoryIds);
      setPosts(data.posts);
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
  }, []);

  const handlePageChange = newPage => {
    if (newPage !== page && newPage > 0 && (!pagy || newPage <= pagy.pages)) {
      fetchPosts(newPage);
    }
  };

  const handleSelectCategory = categories => {
    setSelectedCategories(categories);
    fetchPosts(1, categories);
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
      // Refresh the posts list
      fetchPosts(page);
    } catch {
      // Handle error appropriately
    }
  };

  const handleDelete = async post => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsApi.destroy(post.slug);
        // Refresh the posts list
        fetchPosts(page);
      } catch {
        // Handle error appropriately
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

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (either(isEmpty, isNil)(posts)) {
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
          <p className="mb-8 text-gray-600">{posts.length} articles</p>
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Published At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {posts.map(post => (
                  <tr className="hover:bg-gray-50" key={post.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      {/* <div className="text-sm font-medium text-gray-900">
                        {post.title}
                      </div> */}
                      <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {post.categories && post.categories.length > 0
                          ? post.categories.join(", ")
                          : "No category"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {formatDate(post.published_at)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {getStatusBadge(post.status)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <Dropdown
                        position="bottom-end"
                        customTarget={
                          <svg
                            className="h-5 w-5 cursor-pointer text-gray-400 hover:text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        }
                      >
                        <Menu>
                          <MenuItemButton
                            onClick={() =>
                              (window.location.href = `/posts/${post.slug}/edit`)
                            }
                          >
                            Edit
                          </MenuItemButton>
                          {post.status === "published" && (
                            <MenuItemButton
                              onClick={() => handleUnpublish(post)}
                            >
                              Unpublish
                            </MenuItemButton>
                          )}
                          <MenuItemButton
                            style="danger"
                            onClick={() => handleDelete(post)}
                          >
                            Delete
                          </MenuItemButton>
                        </Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
