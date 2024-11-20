import { index, pgTable, serial, text, timestamp, vector } from "drizzle-orm/pg-core";
import { documentsTable } from "../../../1-learn-the-basics/db/schema/documents-schema";

export const factsTable = pgTable(
  "facts",
  {
    id: serial("id").primaryKey(),
    subject: text("subject").notNull(),
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
