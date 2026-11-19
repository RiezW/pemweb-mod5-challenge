// src/types/Post.ts
export interface PostAuthor {
  id: number;
  name: string | null;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string | null;
  published: boolean;
  views: number;
  authorId: number;
  author?: PostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostPayload {
  title: string;
  content?: string;
  published?: boolean;
  authorId: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  metadata?: {
    currentPage: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}