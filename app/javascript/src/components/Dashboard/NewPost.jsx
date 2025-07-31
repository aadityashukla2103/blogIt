import React, { useState, useEffect } from "react";

import { Dropdown, Select, Input, Button } from "@bigbinary/neetoui";
import categoriesApi from "apis/categories";
import postsApi from "apis/posts";
import { useHistory } from "react-router-dom";
// import Select from "react-select";

const NewPost = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "published",
    published_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { Menu, MenuItem } = Dropdown;
  const { Button: MenuItemButton } = MenuItem;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await categoriesApi.list();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

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

  const getFormattedDate = () => {
    const date = new Date();

    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
  };

  const handleSubmit = async e => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      await postsApi.create({
        post: {
          ...formData,
          category_ids: selectedCategories.map(cat => cat.value),
          published_at:
            formData.status === "published" ? getFormattedDate() : null,
        },
      });
      history.push("/posts");
    } catch {
      // Error handling for creating post
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWithData = async dataToSubmit => {
    setLoading(true);
    try {
      await postsApi.create({
        post: {
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

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex justify-between">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            New blog post
          </h1>
          <div className="h-40 ">
            <Dropdown
              label="Publish"
              buttonProps={{
                className: "bg-black text-white hover:bg-gray-800",
              }}
            >
              <Menu>
                <MenuItemButton value="published">Publish</MenuItemButton>
                <MenuItemButton
                  as="button"
                  value="draft"
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
          </div>
        </div>
        <div className="w-full">
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Input
                  required
                  id="title"
                  label="Title"
                  maxLength={125}
                  name="title"
                  placeholder="Enter title"
                  size="large"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
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
                    strategy="fixed"
                    value={selectedCategories}
                    portalProps={{
                      className: "select-menu-list",
                    }}
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
              </div>
              <div>
                <Input
                  required
                  id="description"
                  label="Description"
                  maxLength={10000}
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
                  label={loading ? "Creating..." : "Submit"}
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

export default NewPost;
