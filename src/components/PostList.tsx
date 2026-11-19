// src/components/PostList.tsx
import { useEffect, useState, type CSSProperties } from "react";
import type { Post } from "../types/Post";
import { createPost, deletePost, fetchPosts } from "../services/postService";
import { categoryHue } from "../utils/categoryColor";

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bonus: pencarian server-side (?search=...)
  const [search, setSearch] = useState("");

  // Controlled form untuk POST /api/posts
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data saat komponen mount & setiap kali kata kunci `search` berubah
  useEffect(() => {
    let isCancelled = false;

    const loadPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPosts(search);
        if (!isCancelled) {
          setPosts(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal terhubung ke server backend (port 3000)."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();

    return () => {
      isCancelled = true;
    };
  }, [search]);

  // Handler POST /api/posts
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const newPost = await createPost({
        title: title.trim(),
        content: content.trim() || undefined,
        authorId: Number(authorId), // Wajib number sesuai createPostSchema Zod
      });

      // Update state secara immutable tanpa refresh halaman
      setPosts((prev) => [newPost, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat post");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler DELETE /api/posts/:id
  const handleDeletePost = async (id: number) => {
    setError(null);
    try {
      await deletePost(id);
      // Hapus item dari state secara immutable tanpa refresh halaman
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus post");
    }
  };

  return (
    <div className="layout">
      {/* Kolom Kiri: Form Tambah Post (memakai style .note-form temanmu) */}
      <form className="note-form" onSubmit={handleAddPost}>
        <h2>Post Baru</h2>

        <label className="field">
          <span>Judul Post</span>
          <input
            type="text"
            placeholder="Tulis judul post..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Author ID (User di DB)</span>
          <input
            type="number"
            min={1}
            value={authorId}
            onChange={(e) => setAuthorId(Number(e.target.value))}
            required
          />
        </label>

        <label className="field">
          <span>Konten</span>
          <textarea
            placeholder="Tulis isi post..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? "Mengirim..." : "Kirim ke API"}
        </button>
      </form>

      {/* Kolom Kanan: Pencarian & Daftar Post */}
      <section>
        <div className="search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            placeholder="Cari post di backend (?search=...)..."
            aria-label="Cari post di backend"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear"
              aria-label="Hapus pencarian"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        <p className="result-info" aria-live="polite">
          {!isLoading &&
            !error &&
            `Menampilkan ${posts.length} post dari database`}
        </p>

        {/* Tampilan Error jika server mati / validasi gagal */}
        {error && (
          <div className="empty" style={{ borderColor: "#ff4d6d", marginBottom: "20px" }}>
            <strong>Terjadi Kesalahan</strong>
            <span>{error}</span>
          </div>
        )}

        {/* Tampilan Loading */}
        {isLoading ? (
          <div className="empty">
            <strong>Memuat data dari server...</strong>
            <span>Menghubungkan ke http://localhost:3000/api/posts</span>
          </div>
        ) : posts.length === 0 && !error ? (
          <div className="empty">
            <strong>Belum ada post</strong>
            <span>
              {search.trim()
                ? `Tidak ada post dengan kata kunci "${search}".`
                : "Buat post pertamamu lewat form di samping."}
            </span>
          </div>
        ) : (
          <div className="notes">
            {posts.map((post) => {
              const authorName = post.author?.name || `User #${post.authorId}`;
              return (
                <article
                  key={post.id}
                  className="note-card"
                  style={{ "--hue": categoryHue(authorName) } as CSSProperties}
                >
                  <div className="note-top">
                    <span className="note-badge">{authorName}</span>
                    <button
                      type="button"
                      className="note-delete"
                      aria-label={`Hapus post ${post.title}`}
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="note-title">{post.title}</h3>
                  <p className="note-body">
                    {post.content || "Tidak ada konten tambahan."}
                  </p>

                  <div className="note-meta">
                    <span>ID #{post.id}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}