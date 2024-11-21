import { index, pgTable, serial, text, timestamp, vector } from "drizzle-orm/pg-core";

export const factsTable = pgTable(
  "facts",
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

export type InsertFacts = typeof factsTable.$inferInsert;
export type SelectFacts = typeof factsTable.$inferSelect;
