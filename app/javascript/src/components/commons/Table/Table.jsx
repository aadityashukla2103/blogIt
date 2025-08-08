import React from "react";

import { MenuHorizontal } from "@bigbinary/neeto-icons";
import {
  Table,
  ActionDropdown,
  Dropdown,
  Typography,
} from "@bigbinary/neetoui";
import { useHistory } from "react-router-dom";

const UserTable = ({
  posts,
  visibleColumns,
  formatDate,
  getStatusBadge,
  handleUnpublish,
  handleDelete,
  selectedPostIds,
  setSelectedPostIds,
}) => {
  const { Menu, MenuItem } = ActionDropdown;
  const { Button: MenuItemButton } = MenuItem;
  const history = useHistory();

  const handleSelectRow = selectedKeys => {
    setSelectedPostIds(selectedKeys);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
      render: (title, row) => (
        <Typography
          className="cursor-pointer text-custom-green"
          onClick={() => history.push(`/posts/${row.slug}`)}
        >
          {title}
        </Typography>
      ),
      ...(visibleColumns.title ? {} : { show: false }),
    },
    {
      title: "Category",
      dataIndex: "categories",
      key: "categories",
      width: 200,
      render: categories =>
        categories?.length > 0 ? categories.join(", ") : "No category",
      ...(visibleColumns.category ? {} : { show: false }),
    },
    {
      title: "Last Published At",
      dataIndex: "published_at",
      key: "published_at",
      width: 200,
      render: publishedAt => formatDate(publishedAt),
      ...(visibleColumns.publishedAt ? {} : { show: false }),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: status => getStatusBadge(status),
      ...(visibleColumns.status ? {} : { show: false }),
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, row) => (
        <Dropdown
          className="cursor-pointer"
          customTarget={<MenuHorizontal />}
          position="bottom-end"
        >
          <Menu>
            <MenuItemButton
              onClick={() => history.push(`/posts/${row.slug}/edit`)}
            >
              Edit
            </MenuItemButton>
            {row.status === "published" && (
              <MenuItemButton onClick={() => handleUnpublish(row)}>
                Unpublish
              </MenuItemButton>
            )}
            <MenuItemButton style="danger" onClick={() => handleDelete(row)}>
              Delete
            </MenuItemButton>
          </Menu>
        </Dropdown>
      ),
    },
  ].filter(col => col.show !== false);

  const rowData = posts.map(post => ({
    ...post,
    key: post.id, // key is required
  }));

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white text-custom-green shadow">
      <Table
        rowSelection
        columnData={columns}
        currentPageNumber={1}
        defaultPageSize={10}
        handlePageChange={() => {}}
        rowData={rowData}
        selectedRowKeys={selectedPostIds}
        onRowSelect={handleSelectRow}
      />
    </div>
  );
};

export default UserTable;
