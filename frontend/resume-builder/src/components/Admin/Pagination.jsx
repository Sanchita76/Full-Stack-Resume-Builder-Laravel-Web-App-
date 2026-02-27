import React from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Pagination = ({ currentPage, lastPage, onPageChange, total, perPage }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1);
    }
  };

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-600">
        Showing <span className="font-medium">{from}</span> to{" "}
        <span className="font-medium">{to}</span> of{" "}
        <span className="font-medium">{total}</span> results
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <LuChevronLeft />
          Previous
        </button>

        <span className="px-4 py-2 text-sm text-gray-700">
          Page {currentPage} of {lastPage}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPage === lastPage}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          Next
          <LuChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;