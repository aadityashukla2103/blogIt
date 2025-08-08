import React, { useState, useRef, useEffect } from "react";

import { Filter } from "@bigbinary/neeto-icons";
import { Button, Input, Typography, Select, Pane } from "@bigbinary/neetoui";
import categoriesApi from "apis/categories";

const FilterPane = ({
  onApplyFilters,
  onRemoveFilters,
  activeFilters = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    title: activeFilters.title || "",
    categories: activeFilters.categories || [],
    status: activeFilters.status || null,
  });
  const inputRef = useRef(null);
  const { Header, Body, Footer } = Pane;

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

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

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      title: "",
      categories: [],
      status: null,
    };
    setFilters(clearedFilters); // <-- Reset local state
    onRemoveFilters(); // <-- Reset parent state
    setIsOpen(false);
  };

  const handleCategoryChange = selectedCategories => {
    setFilters(prev => ({
      ...prev,
      categories: selectedCategories || [],
    }));
  };

  const handleStatusChange = selectedStatus => {
    setFilters(prev => ({
      ...prev,
      status: selectedStatus,
    }));
  };

  const handleTitleChange = e => {
    setFilters(prev => ({
      ...prev,
      title: e.target.value,
    }));
  };

  // Transform categories to the format expected by the Select component
  const categoryOptions = categories.map(category => ({
    label: category.name,
    value: category.id,
  }));

  return (
    <div className="w-full">
      <div className="space-y-6">
        <div className="space-y-8">
          <div className="flex flex-row flex-wrap items-center justify-start gap-6">
            <Button
              icon={Filter}
              style="secondary"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>
      <Pane
        initialFocusRef={inputRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Header>
          <Typography style="h2" weight="semibold">
            Filters
          </Typography>
        </Header>
        <Body>
          <div className="mb-4 w-full">
            <Input
              label="Title"
              placeholder="Enter the Title"
              value={filters.title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="mb-4 w-full">
            <Select
              isMulti
              isSearchable
              classNamePrefix="react-select"
              inputId="categories"
              isLoading={loading}
              label="Category"
              name="categories"
              options={categoryOptions}
              placeholder="Search category"
              size="large"
              value={filters.categories}
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
          <div className="mb-4 w-full">
            <Select
              label="Status"
              placeholder="Select status"
              value={filters.status}
              options={[
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
              ]}
              onChange={handleStatusChange}
            />
          </div>
        </Body>
        <Footer className="flex items-center space-x-2">
          <Button label="Apply Filters" onClick={handleApplyFilters} />
          <Button
            label="Clear filters"
            style="tertiary"
            onClick={handleClearFilters}
          />
        </Footer>
      </Pane>
    </div>
  );
};

export default FilterPane;
