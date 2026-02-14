#!/usr/bin/env node
/**
 * Migration Script: Migrate existing products from file paths to Convex Storage
 *
 * This script:
 * 1. Gets all existing products from the database
 * 2. Uploads their images from public/assets/ to Convex Storage
 * 3. Updates products to use Convex Storage IDs
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

/**
 * Upload a file to Convex Storage
 */
async function uploadImageToStorage(imagePath) {
    try {
        // Convert URL path to file system path
        let filePath = imagePath;

        // Remove leading slash if present
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }

        // Prepend 'public/' if not already there
        if (!filePath.startsWith("public/")) {
            filePath = "public/" + filePath;
        }

        // Construct full path
        const fullPath = path.resolve(__dirname, "..", filePath);

        if (!fs.existsSync(fullPath)) {
            console.error(`  ❌ File not found: ${fullPath}`);
            return null;
        }

        // Read file as buffer
        const fileBuffer = fs.readFileSync(fullPath);

        // Determine content type from extension
        const ext = path.extname(fullPath).toLowerCase();
        const contentType = ext === ".png" ? "image/png" :
                          ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
                          "image/png";

        const blob = new Blob([fileBuffer], { type: contentType });

        // Get upload URL from Convex
        const uploadUrl = await client.mutation(api.products.generateUploadUrl);

        // Upload file
        const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": contentType },
            body: blob,
        });

        const { storageId } = await result.json();
        console.log(`  ✅ Uploaded: ${path.basename(fullPath)} -> ${storageId}`);
        return storageId;
    } catch (error) {
        console.error(`  ❌ Upload failed for ${imagePath}:`, error.message);
        return null;
    }
}

/**
 * Main migration function
 */
async function migrate() {
    console.log("\n🚀 Starting migration: File Paths → Convex Storage\n");

    try {
        // Get all products from database
        const products = await client.query(api.products.list);
        console.log(`📦 Found ${products.length} products to migrate\n`);

        let successCount = 0;
        let skipCount = 0;
        let failCount = 0;

        for (const product of products) {
            console.log(`\n📦 Processing: ${product.name} (ID: ${product._id})`);

            // Check if already using Convex Storage
            if (product.image && product.image.startsWith("kg")) {
                console.log(`  ⏭️  Already using Convex Storage, skipping...`);
                skipCount++;
                continue;
            }

            // Check if using file path
            if (!product.image || (!product.image.startsWith("/assets/") && !product.image.startsWith("assets/"))) {
                console.log(`  ⚠️  Unexpected image format: ${product.image}, skipping...`);
                skipCount++;
                continue;
            }

            try {
                // Upload main image
                console.log(`  📤 Uploading main image: ${product.image}`);
                const mainImageStorageId = await uploadImageToStorage(product.image);

                if (!mainImageStorageId) {
                    console.log(`  ❌ Failed to upload main image`);
                    failCount++;
                    continue;
                }

                // Prepare update data
                const updateData = {
                    id: product._id,
                    image: mainImageStorageId,
                };

                // Upload additional images if present
                if (product.images && product.images.length > 0) {
                    console.log(`  📤 Uploading ${product.images.length} additional images...`);
                    const imageStorageIds = [];

                    for (const imgPath of product.images) {
                        // Skip if already a storage ID
                        if (imgPath.startsWith("kg")) {
                            imageStorageIds.push(imgPath);
                            continue;
                        }

                        const storageId = await uploadImageToStorage(imgPath);
                        if (storageId) {
                            imageStorageIds.push(storageId);
                        }
                    }

                    if (imageStorageIds.length > 0) {
                        updateData.images = imageStorageIds;
                    }
                }

                // Update product in database
                await client.mutation(api.products.updateProduct, updateData);
                console.log(`  ✅ Product updated successfully!`);
                successCount++;

            } catch (error) {
                console.error(`  ❌ Failed to migrate product:`, error.message);
                failCount++;
            }
        }

        console.log("\n" + "=".repeat(60));
        console.log(`✅ Migration complete!`);
        console.log(`   Migrated:  ${successCount} products`);
        console.log(`   Skipped:   ${skipCount} products (already using Storage)`);
        console.log(`   Failed:    ${failCount} products`);
        console.log("=".repeat(60) + "\n");

        if (successCount > 0) {
            console.log("🎉 Products now use Convex Storage!");
            console.log("📝 You can now edit product details via the admin panel\n");
        }

    } catch (error) {
        console.error("\n❌ Migration failed:", error);
        throw error;
    }
}

// Run migration
migrate()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("\n❌ Fatal error:", error);
        process.exit(1);
    });
