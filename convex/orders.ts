import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("orders").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const addOrder = mutation({
  args: {
    orderId: v.string(),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      year: v.string(),
    }),
    items: v.array(v.object({
      name: v.string(),
      qty: v.number(),
      price: v.number(),
      color: v.optional(v.string()),
      size: v.optional(v.string()),
    })),
    subtotal: v.number(),
    total: v.number(),
  },
  handler: async (ctx, args) => {
    // Save to Convex database
    const orderId = await ctx.db.insert("orders", {
      ...args,
      status: "Processing",
      createdAt: Date.now(),
    });

    // Backup to Google Sheets (if configured)
    const sheetsUrl = process.env.SHEETS_WEBAPP_URL;
    const sheetsSecret = process.env.SHEETS_SECRET;

    if (sheetsUrl && sheetsSecret) {
      try {
        const payload = {
          orderId: args.orderId,
          name: args.customer.name,
          email: args.customer.email,
          year: args.customer.year,
          items: args.items.map(item =>
            `${item.name} (x${item.qty})${item.color ? ` - ${item.color}` : ""}${item.size ? ` - ${item.size}` : ""}`  // Fixed: Added closing backtick and parenthesis
          ).join(", "),
          total: args.total,
          secret: sheetsSecret,
          timestamp: new Date().toISOString(),
        };

        await fetch(sheetsUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        // Log but don't fail the order if sheets sync fails
        console.error("Google Sheets backup failed:", error);
      }
    }

    return orderId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
