import React, { useEffect, useRef, useState } from "react";

import categoriesApi from "apis/categories";

const CategoriesSidebar = ({
  open,
  onClose,
  onSelectCategory,
  selectedCategories = [],
}) => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const addModalRef = useRef(null);

  // Hide modal on outside click
  useEffect(() => {
    if (!showAdd) return undefined;
    function handleClickOutside(event) {
      if (addModalRef.current && !addModalRef.current.contains(event.target)) {
        setShowAdd(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAdd]);

  useEffect(() => {
    if (open) fetchCategories();
    // eslint-disable-next-line
  }, [open]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await categoriesApi.list();
      setCategories(data || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (newCategory && !categories.some(c => c.name === newCategory)) {
      try {
        const { data } = await categoriesApi.create(newCategory);
        setCategories([...categories, data]);
        setNewCategory("");
        setShowAdd(false);
      } catch {
        alert("Failed to add category");
      }
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />
      {/* Sidebar */}
      <aside className="relative z-50 flex h-full w-80 flex-col bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Categories</h2>
          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button
              aria-label="Search"
              className="text-gray-500 hover:text-gray-700"
              type="button"
              onClick={() => setShowSearch(s => !s)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            {/* Add Icon */}
            <button
              aria-label="Add Category"
              className="text-gray-500 hover:text-gray-700"
              type="button"
              onClick={() => setShowAdd(s => !s)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4v16m8-8H4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Search Input */}
        {showSearch && (
          <input
            autoFocus
            className="mb-3 w-full rounded border px-3 py-2"
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        )}
        {/* Add Category Modal */}
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div
              className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
              ref={addModalRef}
            >
              <button
                aria-label="Close"
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                type="button"
                onClick={() => setShowAdd(false)}
              >
                ✕
              </button>
              <h3 className="mb-4 text-xl font-bold">New category</h3>
              <label
                className="mb-2 block text-sm font-medium"
                htmlFor="new-category-input"
              >
                Category title
              </label>
              <input
                autoFocus
                className="mb-4 w-full rounded border px-3 py-2"
                id="new-category-input"
                placeholder="Category title"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              />
              <div className="flex space-x-2">
                <button
                  className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
                  disabled={!newCategory.trim()}
                  type="button"
                  onClick={handleAddCategory}
                >
                  Add
                </button>
                <button
                  className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  type="button"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="py-4 text-center">Loading...</div>
          ) : (
            filteredCategories.map(c => {
              const isSelected = selectedCategories.includes(c.id);

              return (
                <button
                  key={c.name}
                  type="button"
                  className={`mb-1 block w-full rounded px-3 py-2 text-left${
                    isSelected
                      ? ` bg-gray-200 font-semibold`
                      : ` hover:bg-gray-100`
                  }`}
                  onClick={() => {
                    const newSelected = isSelected
                      ? selectedCategories.filter(id => id !== c.id)
                      : [...selectedCategories, c.id];
                    onSelectCategory(newSelected);
                  }}
                >
                  <span className="mr-2">
                    <input
                      readOnly
                      checked={isSelected}
                      className="align-middle"
                      type="checkbox"
                    />
                  </span>
                  {c.name}
                </button>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
};

export default CategoriesSidebar;
