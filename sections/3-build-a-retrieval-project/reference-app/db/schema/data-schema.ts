import { index, pgTable, serial, text, timestamp, vector } from "drizzle-orm/pg-core";

export const dataTable = pgTable(
  "data",
  {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    embedding: vector("embedding", {
      dimensions: 256
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    embedding_index: index("data_embedding_index").using("hnsw", table.embedding.op("vector_cosine_ops"))
  })
);

export type InsertData = typeof dataTable.$inferInsert;
export type SelectData = typeof dataTable.$inferSelect;
