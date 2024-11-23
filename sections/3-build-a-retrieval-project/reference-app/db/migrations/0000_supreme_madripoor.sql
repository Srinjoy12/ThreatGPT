CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "data" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "data_embedding_index" ON "data" USING hnsw ("embedding" vector_cosine_ops);
