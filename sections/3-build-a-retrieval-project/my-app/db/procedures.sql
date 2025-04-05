-- Create vector extension function
CREATE OR REPLACE FUNCTION create_vector_extension()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE EXTENSION IF NOT EXISTS vector;
END;
$$;

-- Drop documents table function
CREATE OR REPLACE FUNCTION drop_documents_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DROP TABLE IF EXISTS documents;
END;
$$;

-- Create documents table function
CREATE OR REPLACE FUNCTION create_documents_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(256),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
END;
$$;

-- Create vector index function
CREATE OR REPLACE FUNCTION create_vector_index()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE INDEX data_embedding_index ON documents USING hnsw (embedding vector_cosine_ops);
END;
$$; 