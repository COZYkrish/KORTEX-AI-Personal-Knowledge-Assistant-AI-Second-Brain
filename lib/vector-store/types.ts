export interface VectorSearchResult {
  id: string;
  documentId: string;
  content: string;
  score: number;
  metadata: Record<string, unknown>;
}

export interface VectorStore {
  upsert(params: {
    id: string;
    embedding: number[];
    documentId: string;
    workspaceId: string;
    content: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;

  search(params: {
    embedding: number[];
    workspaceId: string;
    topK?: number;
    threshold?: number;
  }): Promise<VectorSearchResult[]>;

  delete(chunkId: string): Promise<void>;
  deleteByDocument(documentId: string): Promise<void>;
}
