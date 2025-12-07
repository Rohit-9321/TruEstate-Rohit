import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import TopBar from "../components/TopBar.jsx";
import FiltersBar from "../components/FiltersBar.jsx";
import StatsCards from "../components/StatsCards.jsx";
import SalesTable from "../components/SalesTable.jsx";
import Pagination from "../components/Pagination.jsx";
import { fetchFilters, fetchSales } from "../services/api.js";

export default function SalesDashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    ageMin: null,
    ageMax: null,
    dateFrom: null,
    dateTo: null
  });

  const [sort, setSort] = useState({
    sortBy: "date",
    sortOrder: "desc"
  });

  const [page, setPage] = useState(1);
  const [options, setOptions] = useState({});
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({});
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Load filter options once
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchFilters();
        setOptions(data);
      } catch (e) {
        console.error("Failed to load filter options", e);
      }
    })();
  }, []);

  // Load table whenever search/filters/sort/page change
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = {
  search: search || undefined,
  page,
  pageSize: 10,
  sortBy: sort.sortBy,
  sortOrder: sort.sortOrder,

  // ⛔ Only send filter if user selected something
  regions: filters.regions.length > 0 ? filters.regions.join(",") : undefined,
  genders: filters.genders.length > 0 ? filters.genders.join(",") : undefined,
  categories: filters.categories.length > 0 ? filters.categories.join(",") : undefined,
  tags: filters.tags.length > 0 ? filters.tags.join(",") : undefined,
  paymentMethods: filters.paymentMethods.length > 0 ? filters.paymentMethods.join(",") : undefined,

  // ⛔ Null should NOT be sent as filter
  ageMin: filters.ageMin !== null ? filters.ageMin : undefined,
  ageMax: filters.ageMax !== null ? filters.ageMax : undefined,
  dateFrom: filters.dateFrom !== null ? filters.dateFrom : undefined,
  dateTo: filters.dateTo !== null ? filters.dateTo : undefined
};

        const res = await fetchSales(params);

        // 🔥 SAFE assignment to avoid crashes
        setRows(res?.data ?? []);
        setStats(res?.stats ?? {});
        setTotalPages(res?.totalPages ?? 1);

      } catch (e) {
        console.error("Failed to load sales data", e);
        setRows([]);
        setStats({});
      } finally {
        setLoading(false);
      }
    })();
  }, [search, filters, sort, page]);

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleFiltersChange = (updater) => {
    if (typeof updater === "function") {
      setFilters((prev) => updater(prev));
    } else {
      setFilters(updater);
    }
    setPage(1);
  };

  const handleSortChange = (updater) => {
    setSort(updater);
    setPage(1);
  };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <TopBar search={search} onSearch={handleSearchChange} />

        <FiltersBar
          filters={filters}
          setFilters={handleFiltersChange}
          sort={sort}
          setSort={handleSortChange}
          options={options}
        />

        <StatsCards stats={stats} />

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <SalesTable rows={rows} />
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </main>
    </div>
  );
}
