import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: false,
});
 
export async function fetchFilters() {
  const res = await client.get("/sales/filters");
  return res.data;
}

export async function fetchSales(params) {
  const res = await client.get("/sales", { params });
  return res.data;
}
