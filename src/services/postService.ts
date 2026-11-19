// src/services/postService.ts
import type { ApiResponse, CreatePostPayload, Post } from "../types/Post";

const API_BASE_URL = "http://localhost:3000/api";

// GET /api/posts?search=...
export async function fetchPosts(search?: string): Promise<Post[]> {
  const query = search?.trim()
    ? `?search=${encodeURIComponent(search.trim())}`
    : "";

  const response = await fetch(`${API_BASE_URL}/posts${query}`);
  if (!response.ok) {
    throw new Error(`Gagal mengambil data posts (HTTP ${response.status})`);
  }

  const json: ApiResponse<Post[]> = await response.json();
  return json.data;
}

// POST /api/posts
export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(json?.message || "Gagal menambahkan post baru");
  }

  return (json as ApiResponse<Post>).data;
}

// DELETE /api/posts/:id
export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.message || "Gagal menghapus post");
  }
}