import React, { useState, useEffect } from "react";

import { Dropdown, Input, Button, Select } from "@bigbinary/neetoui";
import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import { useHistory, useParams } from "react-router-dom";

const EditPost = () => {
  const history = useHistory();
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { Menu, MenuItem } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

  const getFormattedDate = () => new Date().toISOString();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: postData }, { data: categoriesData }] =
          await Promise.all([postsApi.show(slug), categoriesApi.list()]);

        setFormData({
          title: postData.title,
          description: postData.description,
          status: postData.status || "draft",
        });

        setCategories(categoriesData);

        // Build options
        const categoryOptions = categoriesData.map(category => ({
          value: category.id,
          label: category.name,
        }));

        // Find selected options by label
        const selected = categoryOptions.filter(option =>
          (postData.categories || []).includes(option.label)
        );

        setSelectedCategories(selected);
      } catch {
        // Handle error appropriately
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const handleCategoryChange = selectedOptions => {
    setSelectedCategories(selectedOptions || []);
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    try {
      await postsApi.update({
        slug,
        payload: {
          ...formData,
          category_ids: selectedCategories.map(cat => cat.value),
        },
      });
      history.push("/posts");
    } catch {
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithData = async dataToSubmit => {
    setLoading(true);
    try {
      await postsApi.update({
        slug,
        payload: {
          ...dataToSubmit,
          category_ids: selectedCategories.map(cat => cat.value),
          published_at:
            dataToSubmit.status === "published" ? getFormattedDate() : null,
        },
      });
      history.push("/posts");
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postsApi.destroy(slug);
        history.push("/posts");
      } catch {
        // Handle error appropriately
      }
    }
  };

  if (fetching) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex justify-between">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            Edit blog post
          </h1>
          <div className="flex h-40 items-center gap-2 space-x-2">
            <svg
              className="h-8 w-8 cursor-pointer"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => window.open(`/posts/${slug}`, "_blank")}
            >
              <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z" />
            </svg>
            <Dropdown
              label="Publish"
              buttonProps={{
                className: "bg-black text-white hover:bg-gray-800",
              }}
              onClickOutside={function noRefCheck() {}}
              onClose={function noRefCheck() {}}
            >
              <Menu>
                <MenuItemButton
                  onClick={() => {
                    const updatedForm = { ...formData, status: "published" };
                    setFormData(updatedForm);
                    handleSubmitWithData(updatedForm);
                  }}
                >
                  Publish
                </MenuItemButton>
                <MenuItemButton
                  onClick={() => {
                    const updatedForm = { ...formData, status: "draft" };
                    setFormData(updatedForm);
                    handleSubmitWithData(updatedForm);
                  }}
                >
                  Save as draft
                </MenuItemButton>
              </Menu>
            </Dropdown>
            <Dropdown
              position="bottom-end"
              customTarget={
                <svg
                  className="h-8 w-8 cursor-pointer"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z" />
                </svg>
              }
            >
              <Menu>
                <MenuItemButton style="danger" onClick={handleDelete}>
                  Delete
                </MenuItemButton>
              </Menu>
            </Dropdown>
          </div>
        </div>
        <div className="w-full">
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  required
                  id="title"
                  label="Title*"
                  maxLength={125}
                  name="title"
                  placeholder="Enter title"
                  size="large"
                  value={formData.title}
                  onChange={e => handleChange(e)}
                />
              </div>
              <div>
                <Select
                  isMulti
                  isSearchable
                  classNamePrefix="react-select"
                  inputId="categories"
                  label="Category*"
                  name="categories"
                  options={categoryOptions}
                  placeholder="Search category"
                  size="large"
                  value={selectedCategories}
                  styles={{
                    control: provided => ({
                      ...provided,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: "0.5rem",
                      outline: "none",
                    }),
                  }}
                  onChange={handleCategoryChange}
                />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Description*
                  </label>
                  <span className="text-sm text-gray-500">
                    {formData.description.length}/1000
                  </span>
                </div>
                <Input
                  required
                  className="w-full"
                  id="description"
                  maxLength={1000}
                  name="description"
                  placeholder="Enter description"
                  size="large"
                  type="text"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  label="Cancel"
                  style="secondary"
                  onClick={() => history.push("/posts")}
                />
                <Button
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={loading}
                  label={loading ? "Updating..." : "Update"}
                  loading={loading}
                  style="primary"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
