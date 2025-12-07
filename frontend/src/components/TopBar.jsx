import React from "react";

export default function TopBar({ search, onSearch }) {
  return (
    <header className="topbar">
      <div className="topbar-title">Sales Management System</div>
      <div className="topbar-search">
        <input
          type="text"
          placeholder="Name, Phone no."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
    </header>
  );
}
