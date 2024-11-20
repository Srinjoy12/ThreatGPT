import { index, pgTable, serial, text, timestamp, vector } from "drizzle-orm/pg-core";

export const documentsTable = pgTable(
  "documents",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    content: text("content").notNull(),
    embedding: vector("embedding", {
      dimensions: 256
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    embedding_index: index("embedding_index").using("hnsw", table.embedding.op("vector_cosine_ops"))
  })
);

export type InsertDocuments = typeof documentsTable.$inferInsert;
export type SelectDocuments = typeof documentsTable.$inferSelect;
