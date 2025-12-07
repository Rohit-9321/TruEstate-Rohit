import React from "react";

export default function StatsCards({ stats }) {
  const { totalUnits, totalAmount, totalDiscount } = stats || {};

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Total units sold</div>
        <div className="stat-value">{totalUnits ?? 0}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Amount</div>
        <div className="stat-value">
          ₹{(totalAmount ?? 0).toLocaleString("en-IN")}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Total Discount</div>
        <div className="stat-value">
          ₹{(totalDiscount ?? 0).toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}
