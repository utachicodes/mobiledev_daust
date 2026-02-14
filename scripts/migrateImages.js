#!/usr/bin/env node
/**
 * Migration Script: Upload product images to Convex Storage
 *
 * This script:
 * 1. Reads product images from public/assets/
 * 2. Uploads them to Convex Storage
 * 3. Creates products with Convex Storage IDs
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get Convex deployment URL from environment
const CONVEX_URL = process.env.VITE_CONVEX_URL || process.env.CONVEX_URL;

if (!CONVEX_URL) {
    console.error("❌ Error: CONVEX_URL not found in environment variables");
    console.error("Run: export CONVEX_URL=https://your-deployment.convex.cloud");
    process.exit(1);
}

console.log(`🔗 Connecting to Convex: ${CONVEX_URL}`);
const client = new ConvexHttpClient(CONVEX_URL);

// Product data to migrate (updated with CFA prices)
const PRODUCTS = [
    {
        name: "DAUST Water Bottle",
        category: "Drinkware",
        price: 7500,
        rating: 4.8,
        badge: "Popular",
        image: "public/assets/GoodiesMedias/Goodies/bottle.png",
        images: ["public/assets/GoodiesMedias/Goodies/bottle.png", "public/assets/GoodiesMedias/Goodies/mug.png"],
        colors: [{ name: "Steel", hex: "#94a3b8" }, { name: "Navy", hex: "#0a2342" }],
        description: "Stay hydrated on campus with our premium DAUST Water Bottle. Designed for durability and style.",
    },
    {
        name: "DAUST Mug",
        category: "Drinkware",
        price: 5000,
        rating: 4.7,
        image: "public/assets/GoodiesMedias/Goodies/mug.png",
        images: ["public/assets/GoodiesMedias/Goodies/mug.png", "public/assets/GoodiesMedias/Goodies/bottle.png"],
        colors: [{ name: "White", hex: "#ffffff" }],
        description: "The perfect companion for your morning coffee or late-night study sessions.",
    },
    {
        name: "DAUST Cap (Blue)",
        category: "Caps",
        price: 6000,
        rating: 4.6,
        image: "public/assets/GoodiesMedias/Goodies/cap-blue.png",
        images: ["public/assets/GoodiesMedias/Goodies/cap-blue.png"],
        colors: [{ name: "Blue", hex: "#1e40af" }],
        sizes: ["Adjustable"],
        description: "Classic 6-panel cap with our iconic DAUST logo embroidered on the front.",
    },
    {
        name: "Hoodie \"Once/Always a DAUST innovator\" (White)",
        category: "Hoodies",
        price: 15000,
        rating: 4.9,
        image: "public/assets/GoodiesMedias/Goodies/hoodie-oncealways-white.png",
        images: ["public/assets/GoodiesMedias/Goodies/hoodie-oncealways-white.png", "public/assets/GoodiesMedias/Goodies/hoodies-oncealways.png"],
        colors: [{ name: "White", hex: "#ffffff" }],
        sizes: ["S", "M", "L", "XL"],
        description: "Premium cotton-blend hoodie that represents the spirit of DAUST.",
    },
    {
        name: "Hoodie \"Proud Parent\" (Grey)",
        category: "Hoodies",
        price: 15000,
        rating: 4.7,
        image: "public/assets/GoodiesMedias/Goodies/hoodie-proud-grey.png",
        images: ["public/assets/GoodiesMedias/Goodies/hoodie-proud-grey.png", "public/assets/GoodiesMedias/Goodies/hoodie-proud-white.png"],
        colors: [{ name: "Grey", hex: "#9ca3af" }],
        sizes: ["M", "L", "XL", "2XL"],
        description: "Show your family pride with the Official DAUST Proud Parent hoodie.",
    },
    {
        name: "Hoodie \"Proud Parent\" (White)",
        category: "Hoodies",
        price: 15000,
        rating: 4.7,
        image: "public/assets/GoodiesMedias/Goodies/hoodie-proud-white.png",
        images: ["public/assets/GoodiesMedias/Goodies/hoodie-proud-white.png", "public/assets/GoodiesMedias/Goodies/hoodie-proud-grey.png"],
        colors: [{ name: "White", hex: "#ffffff" }],
        sizes: ["M", "L", "XL", "2XL"],
        description: "Show your family pride with the Official DAUST Proud Parent hoodie in White.",
    },
    {
        name: "T-Shirt Code Build Impact (Blue)",
        category: "T-Shirts",
        price: 8000,
        rating: 4.5,
        image: "public/assets/GoodiesMedias/Goodies/tshirt-cbi-blue.png",
        images: ["public/assets/GoodiesMedias/Goodies/tshirt-cbi-blue.png", "public/assets/GoodiesMedias/Goodies/tshirts-cbi.png"],
        colors: [{ name: "Blue", hex: "#0a2342" }],
        sizes: ["S", "M", "L", "XL"],
        description: "Code. Build. Impact. The engineer's uniform for making a difference.",
    },
    {
        name: "T-Shirt ELEC Engineer (Grey)",
        category: "T-Shirts",
        price: 8000,
        rating: 4.5,
        image: "public/assets/GoodiesMedias/Goodies/tshirt-elec-grey.png",
        images: ["public/assets/GoodiesMedias/Goodies/tshirt-elec-grey.png", "public/assets/GoodiesMedias/Goodies/tshirts-elec.png"],
        colors: [{ name: "Grey", hex: "#9ca3af" }],
        sizes: ["S", "M", "L", "XL"],
        description: "Official ELEC Engineering T-Shirt. Represent your department with pride.",
    },
];

/**
 * Upload a file to Convex Storage
 */
async function uploadFile(filePath) {
    try {
        const fullPath = path.resolve(__dirname, "..", filePath);

        if (!fs.existsSync(fullPath)) {
            console.error(`  ❌ File not found: ${fullPath}`);
            return null;
        }

        // Read file as buffer
        const fileBuffer = fs.readFileSync(fullPath);
        const blob = new Blob([fileBuffer], { type: "image/png" });

        // Get upload URL from Convex
        const uploadUrl = await client.mutation(api.products.generateUploadUrl);

        // Upload file
        const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": "image/png" },
            body: blob,
        });

        const { storageId } = await result.json();
        return storageId;
    } catch (error) {
        console.error(`  ❌ Upload failed for ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Main migration function
 */
async function migrate() {
    console.log("\n🚀 Starting image migration to Convex Storage...\n");

    let successCount = 0;
    let failCount = 0;

    for (const product of PRODUCTS) {
        console.log(`📦 Processing: ${product.name}`);

        try {
            // Upload main image
            console.log(`  📤 Uploading main image...`);
            const mainImageStorageId = await uploadFile(product.image);

            if (!mainImageStorageId) {
                console.log(`  ⚠️  Skipping ${product.name} - image upload failed`);
                failCount++;
                continue;
            }

            // Upload additional images if present
            let imageStorageIds = [mainImageStorageId];
            if (product.images && product.images.length > 1) {
                console.log(`  📤 Uploading ${product.images.length - 1} additional images...`);
                for (let i = 1; i < product.images.length; i++) {
                    const storageId = await uploadFile(product.images[i]);
                    if (storageId) {
                        imageStorageIds.push(storageId);
                    }
                }
            }

            // Create product with storage IDs
            await client.mutation(api.products.addProduct, {
                name: product.name,
                category: product.category,
                price: product.price,
                rating: product.rating,
                badge: product.badge,
                image: mainImageStorageId,
                images: imageStorageIds,
                colors: product.colors,
                sizes: product.sizes,
                description: product.description,
                collection: product.collection,
            });

            console.log(`  ✅ Created product with Convex Storage images\n`);
            successCount++;
        } catch (error) {
            console.error(`  ❌ Failed to create product:`, error.message, "\n");
            failCount++;
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Migration complete!`);
    console.log(`   Success: ${successCount} products`);
    console.log(`   Failed:  ${failCount} products`);
    console.log("=".repeat(50) + "\n");
}

// Run migration
migrate()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Migration failed:", error);
        process.exit(1);
    });
