import { mutation } from "./_generated/server";

// Clear all products from the database
export default mutation({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();

        for (const product of products) {
            await ctx.db.delete(product._id);
        }

        return { success: true, deleted: products.length };
    },
});
