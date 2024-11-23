CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_embedding_index" ON "documents" USING hnsw ("embedding" vector_cosine_ops);
