import fs from "fs";
import path from "path";
import url from "url";
import https from "https";
import csv from "csv-parser";

let FILTER_OPTIONS = {};
const CSV_INDEX = []; // to store minimal index info (not full data)

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeDropbox(link) {
  return link
    .replace("www.dropbox.com", "dl.dropboxusercontent.com")
    .replace("?dl=0", "")
    .replace("?dl=1", "");
}

// 📌 Stream CSV Rows ONE BY ONE (no full memory load)
export async function buildCsvIndex() {
  return new Promise((resolve, reject) => {
    const url = process.env.SALES_CSV_URL
      ? normalizeDropbox(process.env.SALES_CSV_URL)
      : path.join(__dirname, "../data/sales.csv");

    const stream = url.startsWith("http")
      ? https.get(url, (res) => res.pipe(csv()))
      : fs.createReadStream(url).pipe(csv());

    const regions = new Set();
    const genders = new Set();
    const categories = new Set();
    const tagsSet = new Set();
    const paymentMethods = new Set();
    let minAge = Infinity, maxAge = -Infinity;
    let minDate = null, maxDate = null;
    let rowIndex = 0;

    stream
      .on("data", (row) => {
        rowIndex++;

        // Only store index data, not full row
        CSV_INDEX.push({
          line: rowIndex,
          region: row["Customer Region"],
          gender: row["Gender"],
          category: row["Product Category"],
          tags: row["Tags"],
          payment: row["Payment Method"],
          date: row["Date"],
          age: Number(row["Age"])
        });

        if (row["Customer Region"]) regions.add(row["Customer Region"]);
        if (row["Gender"]) genders.add(row["Gender"]);
        if (row["Product Category"]) categories.add(row["Product Category"]);
        if (row["Payment Method"]) paymentMethods.add(row["Payment Method"]);

        if (row["Tags"]) {
          row["Tags"].split(",")
            .map(t => t.trim())
            .filter(Boolean)
            .forEach(t => tagsSet.add(t));
        }

        const age = Number(row["Age"]);
        if (!isNaN(age)) {
          minAge = Math.min(minAge, age);
          maxAge = Math.max(maxAge, age);
        }

        if (row["Date"]) {
          const d = new Date(row["Date"]);
          if (!minDate || d < minDate) minDate = d;
          if (!maxDate || d > maxDate) maxDate = d;
        }
      })
      .on("end", () => {
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

        console.log("📊 CSV Index built:", rowIndex, "rows");
        resolve();
      })
      .on("error", reject);
  });
}

export function getFilters() {
  return FILTER_OPTIONS;
}

export function getIndex() {
  return CSV_INDEX;
}
