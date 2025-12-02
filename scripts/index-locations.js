#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function indexLocations() {
  try {
    console.log("📍 Indexing locations...");
    const response = await fetch(`${BASE_URL}/api/algolia/index-locations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.success) {
      console.log(`✅ Successfully indexed ${data.indexed} locations`);
    } else {
      console.log(`⚠️  ${data.message || "Indexing failed"}`);
      if (data.locationsFound !== undefined) {
        console.log(`   Found ${data.locationsFound} locations in WordPress`);
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

indexLocations();
