import { getSalesData, getFilterOptions } from "../utils/csvLoader.js";

function applySearch(records, search) {
  if (!search) return records;
  const q = search.toLowerCase();
  return records.filter((r) => {
    return (
      (r.customerName && r.customerName.toLowerCase().includes(q)) ||
      (r.phoneNumber && r.phoneNumber.toLowerCase().includes(q))
    );
  });
}

function applyFilters(records, filters) {
  return records.filter((r) => {
    const {
      regions,
      genders,
      categories,
      tags,
      paymentMethods,
      ageMin,
      ageMax,
      dateFrom,
      dateTo
    } = filters;

    if (regions?.length && !regions.includes(r.customerRegion)) return false;
    if (genders?.length && !genders.includes(r.gender)) return false;
    if (categories?.length && !categories.includes(r.productCategory))
      return false;
    if (paymentMethods?.length && !paymentMethods.includes(r.paymentMethod))
      return false;

    if (ageMin != null && !Number.isNaN(r.age) && r.age < ageMin) return false;
    if (ageMax != null && !Number.isNaN(r.age) && r.age > ageMax) return false;

    if (dateFrom) {
      const d = new Date(r.date);
      if (d < new Date(dateFrom)) return false;
    }
    if (dateTo) {
      const d = new Date(r.date);
      if (d > new Date(dateTo)) return false;
    }

    if (tags?.length) {
      const rowTags = (r.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const hasAll = tags.every((t) => rowTags.includes(t));
      if (!hasAll) return false;
    }

    return true;
  });
}

function applySort(records, sortBy, sortOrder) {
  if (!sortBy) return records;

  const dir = sortOrder === "asc" ? 1 : -1;
  const sorted = [...records];

  sorted.sort((a, b) => {
    let va, vb;
    if (sortBy === "date") {
      va = new Date(a.date);
      vb = new Date(b.date);
    } else if (sortBy === "quantity") {
      va = a.quantity || 0;
      vb = b.quantity || 0;
    } else if (sortBy === "customerName") {
      va = a.customerName?.toLowerCase() || "";
      vb = b.customerName?.toLowerCase() || "";
    } else {
      return 0;
    }

    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });

  return sorted;
}

function computeStats(records) {
  let totalUnits = 0;
  let totalAmount = 0;
  let totalDiscount = 0;

  for (const r of records) {
    totalUnits += r.quantity || 0;
    totalAmount += r.finalAmount || 0;
    const original = r.totalAmount || 0;
    const final = r.finalAmount || 0;
    const discount = original - final;
    if (discount > 0) totalDiscount += discount;
  }

  return { totalUnits, totalAmount, totalDiscount };
}

export function getSalesWithQuery(params) {
  const {
    search,
    page = 1,
    pageSize = 10,
    sortBy,
    sortOrder,
    regions,
    genders,
    categories,
    tags,
    paymentMethods,
    ageMin,
    ageMax,
    dateFrom,
    dateTo
  } = params;

  const base = getSalesData();

  const filtered = applyFilters(
    applySearch(base, search),
    {
      regions,
      genders,
      categories,
      tags,
      paymentMethods,
      ageMin:
        ageMin !== undefined && ageMin !== null ? Number(ageMin) : undefined,
      ageMax:
        ageMax !== undefined && ageMax !== null ? Number(ageMax) : undefined,
      dateFrom,
      dateTo
    }
  );

  const sorted = applySort(filtered, sortBy, sortOrder);
  const stats = computeStats(filtered);

  const pageNum = Number(page) || 1;
  const size = Number(pageSize) || 10;
  const start = (pageNum - 1) * size;
  const end = start + size;

  const paged = sorted.slice(start, end);
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));

  return {
    data: paged,
    page: pageNum,
    pageSize: size,
    totalItems,
    totalPages,
    stats,
    filterOptions: getFilterOptions()
  };
}
