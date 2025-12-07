import React from "react";

export default function SalesTable({ rows }) {
  if (!Array.isArray(rows)) {
    return <div className="loading">Loading...</div>;
  }

  if (rows.length === 0) {
    return (
      <div className="no-results">
        No results found. Try adjusting filters.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Customer region</th>
            <th>Product ID</th>
            <th>Employee name</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.transactionId}</td>
              <td>{r.date}</td>
              <td>{r.customerId}</td>
              <td>{r.customerName}</td>
              <td>{r.phoneNumber}</td>
              <td>{r.gender}</td>
              <td>{r.age}</td>
              <td>{r.productCategory}</td>
              <td>{r.quantity}</td>
              <td>₹ {r.finalAmount?.toLocaleString("en-IN")}</td>
              <td>{r.customerRegion}</td>
              <td>{r.productId}</td>
              <td>{r.employeeName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
