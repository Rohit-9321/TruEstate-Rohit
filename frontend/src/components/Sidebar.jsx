import React from "react";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="avatar-circle">V</div>
        <div>
          <div className="app-title">Vault</div>
          <div className="user-name">Anurag Yadav</div>
        </div>
      </div>

      <nav className="sidebar-section">
        <div className="sidebar-section-title">Dashboard</div>
        <button className="sidebar-link active">Dashboard</button>
        <button className="sidebar-link">Nexus</button>
        <button className="sidebar-link">Intake</button>
      </nav>

      <nav className="sidebar-section">
        <div className="sidebar-section-title">Services</div>
        <button className="sidebar-link">Pre-active</button>
        <button className="sidebar-link">Active</button>
        <button className="sidebar-link">Blocked</button>
        <button className="sidebar-link">Closed</button>
      </nav>

      <nav className="sidebar-section">
        <div className="sidebar-section-title">Invoices</div>
        <button className="sidebar-link">Proforma Invoices</button>
        <button className="sidebar-link">Final Invoices</button>
      </nav>
    </aside>
  );
}
