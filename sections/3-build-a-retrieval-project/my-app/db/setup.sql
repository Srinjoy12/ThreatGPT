-- Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop the documents table if it exists
DROP TABLE IF EXISTS documents;

-- Create the documents table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding vector(256),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create the vector index
CREATE INDEX data_embedding_index ON documents USING hnsw (embedding vector_cosine_ops); 