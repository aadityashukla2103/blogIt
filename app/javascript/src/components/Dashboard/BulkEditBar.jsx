import React, { useState } from "react";

import { Delete } from "@bigbinary/neeto-icons";
import {
  Tag,
  Typography,
  ActionDropdown,
  Checkbox,
  Button,
  Alert,
} from "@bigbinary/neetoui";

import FilterPane from "../commons/Table/FilterPane";

const BulkEditBar = ({
  posts,
  activeFilters,
  visibleColumns,
  toggleColumnVisibility,
  handleApplyFilters,
  handleClearFilters,
  selectedPostIds,
  handleStatusChangeAll,
  handleDeleteAll,
}) => {
  const { Menu, MenuItem } = ActionDropdown;
  const { Button: MenuItemButton } = MenuItem;
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  return (
    <>
      <Alert
        isOpen={isDeleteAlertOpen}
        title="Delete Posts"
        message={`Are you sure you want to delete ${
          selectedPostIds.length
        } post${
          selectedPostIds.length > 1 ? "s" : ""
        }? This action cannot be undone.`}
        onClose={() => setIsDeleteAlertOpen(false)}
        onSubmit={() => {
          handleDeleteAll();
          setIsDeleteAlertOpen(false);
        }}
      />
      <div className="mb-2 flex justify-between">
        <div className="flex items-center gap-4">
          {activeFilters.title ? (
            <div className="ml-3 flex items-center gap-2">
              <Typography>
                {posts.length} Results for "{activeFilters.title}"
              </Typography>
              {activeFilters.categories?.map((category, index) => (
                <Tag key={index} label={category.label} size="small" />
              ))}
              {activeFilters.status && (
                <Tag
                  label={activeFilters.status.value}
                  size="small"
                  style="danger"
                />
              )}
            </div>
          ) : (
            <Typography>{posts.length} posts</Typography>
          )}
          {selectedPostIds.length > 0 && (
            <div className="flex gap-2">
              <ActionDropdown buttonStyle="secondary" label="Change Status">
                <Menu>
                  <MenuItemButton
                    onClick={() => handleStatusChangeAll("published")}
                  >
                    Published
                  </MenuItemButton>
                  <MenuItemButton
                    onClick={() => handleStatusChangeAll("draft")}
                  >
                    Draft
                  </MenuItemButton>
                </Menu>
              </ActionDropdown>
              <Button
                icon={Delete}
                iconPosition="right"
                label="Delete"
                style="danger"
                onClick={() => setIsDeleteAlertOpen(true)}
              />
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <ActionDropdown buttonStyle="secondary" label="Columns">
            <Menu>
              <MenuItemButton>
                <Checkbox
                  disabled
                  checked={visibleColumns.title}
                  label="Title"
                />
              </MenuItemButton>
              <MenuItemButton>
                <Checkbox
                  checked={visibleColumns.category}
                  label="Category"
                  onChange={() => toggleColumnVisibility("category")}
                />
              </MenuItemButton>
              <MenuItemButton>
                <Checkbox
                  checked={visibleColumns.publishedAt}
                  label="Last published at"
                  onChange={() => toggleColumnVisibility("publishedAt")}
                />
              </MenuItemButton>
              <MenuItemButton>
                <Checkbox
                  checked={visibleColumns.status}
                  label="Status"
                  onChange={() => toggleColumnVisibility("status")}
                />
              </MenuItemButton>
            </Menu>
          </ActionDropdown>
          <FilterPane
            activeFilters={activeFilters}
            onApplyFilters={handleApplyFilters}
            onRemoveFilters={handleClearFilters}
          />
        </div>
      </div>
    </>
  );
};

export default BulkEditBar;
