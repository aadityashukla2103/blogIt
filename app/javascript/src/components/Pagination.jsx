import React from "react";

import { RiArrowRightWideFill, RiArrowLeftWideFill } from "@remixicon/react";

const Pagination = ({ pagy, onPageChange, currentPage }) => {
  if (!pagy || pagy.pages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= pagy.pages; i++) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex items-center justify-end space-x-2">
      <button
        className="rounded border bg-gray-100 px-3 py-1 text-gray-700 disabled:opacity-50"
        disabled={!pagy.prev}
        onClick={() => onPageChange(pagy.prev)}
      >
        <RiArrowLeftWideFill />
      </button>
      {pages.map(num => (
        <button
          disabled={num === currentPage}
          key={num}
          className={`rounded border px-3 py-1 ${
            num === currentPage
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
      <button
        className="rounded border bg-gray-100 px-3 py-1 text-gray-700 disabled:opacity-50"
        disabled={!pagy.next}
        onClick={() => onPageChange(pagy.next)}
      >
        <RiArrowRightWideFill />
      </button>
    </div>
  );
};

export default Pagination;
