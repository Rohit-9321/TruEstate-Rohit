import { getSalesWithQuery } from "../services/salesService.js";
import { getFilterOptions } from "../utils/csvLoader.js";

export function getSales(req, res) {
  try {
    const {
      search,
      page,
      pageSize,
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
    } = req.query;

    const parseMulti = (v) =>
      !v ? undefined : Array.isArray(v) ? v : v.split(",");

    const result = getSalesWithQuery({
      search,
      page,
      pageSize,
      sortBy,
      sortOrder,
      regions: parseMulti(regions),
      genders: parseMulti(genders),
      categories: parseMulti(categories),
      tags: parseMulti(tags),
      paymentMethods: parseMulti(paymentMethods),
      ageMin,
      ageMax,
      dateFrom,
      dateTo
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export function getFilters(_req, res) {
  res.json(getFilterOptions());
}
