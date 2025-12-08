import axios from "axios";

const baseURL = import.meta.env.PROD
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:4000/api";

console.log("📡 API Base URL →", baseURL);

export const client = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  }
});

// Fetch Filter Options
export async function fetchFilters() {
  try {
    const res = await client.get("/sales/filters");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch filters:", err.response?.data || err);
    return { error: true };
  }
}

// Fetch Paginated Sales
export async function fetchSales(params) {
  try {
    const res = await client.get("/sales", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch sales:", err.response?.data || err);
    return { error: true };
  }
}
