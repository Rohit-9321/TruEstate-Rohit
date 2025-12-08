import axios from "axios";

// 🟢 Auto-pick Render in Production, Local in Dev
const baseURL =
  import.meta.env.VITE_API_URL && import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:4000/api";

console.log("📡 API Base URL →", baseURL);

export const client = axios.create({
  baseURL,
  withCredentials: false, // no cookies needed
});

export async function fetchFilters() {
  try {
    const res = await client.get("/sales/filters");
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch filters:", err);
    throw err;
  }
}

export async function fetchSales(params) {
  try {
    const res = await client.get("/sales", { params });
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch sales:", err);
    throw err;
  }
}
