import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    onChange(p);
  };

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        Prev
      </button>
      <span className="page-info">
        Page {page} of {totalPages}
      </span>
      <button
        className="page-btn"
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
