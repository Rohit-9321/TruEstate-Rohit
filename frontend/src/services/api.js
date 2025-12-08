import axios from "axios";

const base = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL + "/api"
  : "http://localhost:4000/api";

export const client = axios.create({
  baseURL: base,
  withCredentials: false
});

export async function fetchFilters() {
  const res = await client.get("/sales/filters");
  return res.data;
}

export async function fetchSales(params) {
  const res = await client.get("/sales", { params });
  return res.data;
}
