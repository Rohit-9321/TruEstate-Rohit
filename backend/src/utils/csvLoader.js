import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import url from "url";
import https from "https";

let SALES_DATA = [];
let FILTER_OPTIONS = {};

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Dropbox direct URL must be dl.dropboxusercontent.com not www.dropbox.com
function normalizeDropboxLink(link) {
  if (link.includes("dropbox.com")) {
    return link
      .replace("www.dropbox.com", "dl.dropboxusercontent.com")
      .replace("?dl=0", "")              // remove params
      .replace("?dl=1", "");
  }
  return link;
}

// 🌍 Remote fetch that handles SSL & redirect
async function fetchCsvFromUrl(fileUrl) {
  return new Promise((resolve, reject) => {
    const finalUrl = normalizeDropboxLink(fileUrl);

    console.log("🌍 Downloading CSV from:", finalUrl);

    https.get(finalUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(
          new Error(`❌ Failed to fetch CSV: ${res.statusCode} ${res.statusMessage}`)
        );
      }

      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

export async function loadCsvIntoMemory() {
  let csvText;

  if (process.env.SALES_CSV_URL) {
    console.log("🌍 Downloading CSV from →", process.env.SALES_CSV_URL);

    const res = await fetch(process.env.SALES_CSV_URL);
    csvText = await res.text();
  } else {
    const csvPath = path.join(__dirname, "../data/sales.csv");
    console.log("📁 Loading local CSV →", csvPath);
    csvText = fs.readFileSync(csvPath, "utf8");
  }

  // Parse CSV
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  SALES_DATA = records.map((r, idx) => ({
    id: idx + 1,
    transactionId: r["Transaction ID"],
    date: r["Date"],
    customerId: r["Customer ID"],
    customerName: r["Customer Name"],
    phoneNumber: r["Phone Number"],
    gender: r["Gender"],
    age: Number(r["Age"]),
    customerRegion: r["Customer Region"],
    customerType: r["Customer Type"],
    productId: r["Product ID"],
    productName: r["Product Name"],
    brand: r["Brand"],
    productCategory: r["Product Category"],
    tags: r["Tags"],
    quantity: Number(r["Quantity"]),
    pricePerUnit: Number(r["Price per Unit"]),
    discountPercentage: Number(r["Discount Percentage"]),
    totalAmount: Number(r["Total Amount"]),
    finalAmount: Number(r["Final Amount"]),
    paymentMethod: r["Payment Method"],
    orderStatus: r["Order Status"],
    deliveryType: r["Delivery Type"],
    storeId: r["Store ID"],
    storeLocation: r["Store Location"],
    salespersonId: r["Salesperson ID"],
    employeeName: r["Employee Name"]
  }));

  console.log(`📊 Successfully loaded ${SALES_DATA.length} rows from CSV`);

  // Build filter options
  const regions = new Set();
  const genders = new Set();
  const categories = new Set();
  const tagsSet = new Set();
  const paymentMethods = new Set();
  let minAge = Infinity, maxAge = -Infinity;
  let minDate = null, maxDate = null;

  for (const r of SALES_DATA) {
    if (r.customerRegion) regions.add(r.customerRegion);
    if (r.gender) genders.add(r.gender);
    if (r.productCategory) categories.add(r.productCategory);
    if (r.tags) {
      r.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean)
        .forEach(t => tagsSet.add(t));
    }
    if (r.paymentMethod) paymentMethods.add(r.paymentMethod);

    if (!isNaN(r.age)) {
      minAge = Math.min(minAge, r.age);
      maxAge = Math.max(maxAge, r.age);
    }

    if (r.date) {
      const d = new Date(r.date);
      if (!minDate || d < minDate) minDate = d;
      if (!maxDate || d > maxDate) maxDate = d;
    }
  }

  FILTER_OPTIONS = {
    regions: [...regions].sort(),
    genders: [...genders].sort(),
    categories: [...categories].sort(),
    tags: [...tagsSet].sort(),
    paymentMethods: [...paymentMethods].sort(),
    ageRange: { min: minAge, max: maxAge },
    dateRange: {
      min: minDate ? minDate.toISOString().slice(0, 10) : null,
      max: maxDate ? maxDate.toISOString().slice(0, 10) : null
    }
  };

  console.log("✅ Filter options generated");
}

// Exports
export function getSalesData() { return SALES_DATA; }
export function getFilterOptions() { return FILTER_OPTIONS; }
