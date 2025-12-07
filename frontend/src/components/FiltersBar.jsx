import React, { useState, useRef, useEffect } from "react";

function MultiSelect({ label, value = [], options = [], onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggle = (opt) => {
    const exists = value.includes(opt);
    const next = exists ? value.filter((v) => v !== opt) : [...value, opt];
    onChange(next);
  };

  return (
    <div className={`filter-chip multi-dropdown ${className}`} ref={ref}>
      <div
        className="multi-dropdown-toggle"
        role="button"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        <span className="multi-label">{label}</span>
        <div className="multi-selected">
          {value.length === 0 ? (
            <span className="multi-placeholder">&nbsp;</span>
          ) : (className.includes("small") || className.includes("xsmall")) ? (
            // For compact variants show concise summary so control doesn't grow
            value.length === 1 ? (
              <span className="chip">{value[0]}</span>
            ) : (
              <span className="chip more">+{value.length}</span>
            )
          ) : (
            <>
              {value.slice(0, 2).map((v) => (
                <span key={v} className="chip">
                  {v}
                </span>
              ))}
              {value.length > 2 && (
                <span className="chip more">+{value.length - 2}</span>
              )}
            </>
          )}
        </div>
        <span className="caret">▾</span>
      </div>

      {open && (
        <div className="multi-dropdown-menu">
          <div className="menu-list">
            {options.map((opt) => (
              <label key={opt} className="menu-item">
                <input
                  type="checkbox"
                  checked={value.includes(opt)}
                  onChange={() => toggle(opt)}
                />
                <span className="menu-item-label">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FiltersBar({
  filters,
  setFilters,
  sort,
  setSort,
  options
}) {
  const update = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div className="filters-bar">
      <button
        className="reset-btn"
        type="button"
        aria-label="Reset filters"
        onClick={() => {
          const initial = {
            regions: [],
            genders: [],
            categories: [],
            tags: [],
            paymentMethods: [],
              ageMin: null,
              ageMax: null,
              date: null,
              dateFrom: null,
              dateTo: null,
            quick: []
          };
          setFilters(initial);
          setSort && setSort((s) => ({ ...s, sortBy: 'date', sortOrder: 'desc' }));
        }}
      >
        ⟲
      </button>

      <MultiSelect
        label="Region"
        value={filters.regions}
        options={options.regions || []}
        onChange={(v) => update("regions", v)}
        className="small"
      />
      <div className="filter-chip gender-chip">
        <span>Gen</span>
        <select
          className="gender-select"
          value={(filters.genders && filters.genders[0]) || ""}
          onChange={(e) =>
            update("genders", e.target.value ? [e.target.value] : [])
          }
        >
          <option value="">All</option>
          {(options.genders || []).map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-chip">
        <span>Age</span>
        <div className="age-range">
          <input
            type="number"
            placeholder="Min"
            value={filters.ageMin ?? ""}
            onChange={(e) => update("ageMin", e.target.value || null)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.ageMax ?? ""}
            onChange={(e) => update("ageMax", e.target.value || null)}
          />
        </div>
      </div>
      <MultiSelect
        label="Category"
        value={filters.categories}
        options={options.categories || []}
        onChange={(v) => update("categories", v)}
        className="small"
      />
      <MultiSelect
        label="Tags"
        value={filters.tags}
        options={options.tags || []}
        onChange={(v) => update("tags", v)}
        className="xsmall"
      />
      <MultiSelect
        label="Payment"
        value={filters.paymentMethods}
        options={options.paymentMethods || []}
        onChange={(v) => update("paymentMethods", v)}
        className="xsmall"
      />
      <div className="filter-chip">
        <span>Date</span>
        <div className="date-range single-date">
          <input
            type="date"
            value={filters.date || filters.dateFrom || ""}
            onChange={(e) => {
              const v = e.target.value || null;
              update("date", v);
              update("dateFrom", v);
              update("dateTo", v);
            }}
          />
        </div>
      </div>

      <div className="filter-chip sort-chip">
        <span>Sort</span>
        <select
          value={sort.sortBy}
          onChange={(e) =>
            setSort((s) => ({ ...s, sortBy: e.target.value || null }))
          }
        >
          <option value="">None</option>
          <option value="date">Date</option>
          <option value="quantity">Qty</option>
          <option value="customerName">Name</option>
        </select>
        <select
          value={sort.sortOrder}
          onChange={(e) =>
            setSort((s) => ({ ...s, sortOrder: e.target.value }))
          }
        >
          <option value="desc">↓</option>
          <option value="asc">↑</option>
        </select>
      </div>
    </div>
  );
}
