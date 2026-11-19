import { useState, type CSSProperties } from "react";
import { PostList } from "./components/PostList";
import type { Note } from "./types/Note";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { categoryHue } from "./utils/categoryColor";
import { NoteForm } from "./components/NoteForm";
import { NoteCard } from "./components/NoteCard";
import "./App.css";

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"notes" | "posts">("notes");

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const handleDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const categories = [...new Set(notes.map((note) => note.category))];
  const selectedCategory =
    activeCategory && categories.includes(activeCategory)
      ? activeCategory
      : null;

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.trim().toLowerCase()) &&
      (selectedCategory === null || note.category === selectedCategory),
  );

  const isFiltering = search.trim() !== "" || selectedCategory !== null;

  const resetFilters = () => {
    setSearch("");
    setActiveCategory(null);
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>{activeTab === "notes" ? "Catatan" : "Posts API"}</h1>
        <p>
          {activeTab === "notes"
            ? notes.length === 0
              ? "Simpan ide, tugas, dan hal penting di sini."
              : `${notes.length} catatan tersimpan di browser ini.`
            : "Terhubung ke Express + Prisma + Neon (Modul 4)"}
        </p>

        {/* Navigasi Tab Tahap 1 & Tahap 2 */}
        <div className="chips" style={{ justifyContent: "center", marginTop: "20px" }}>
          <button
            type="button"
            className="chip"
            aria-pressed={activeTab === "notes"}
            onClick={() => setActiveTab("notes")}
          >
            <span className="dot" />
            Tahap 1: Catatan Lokal
          </button>
          <button
            type="button"
            className="chip"
            aria-pressed={activeTab === "posts"}
            style={{ "--hue": 150 } as CSSProperties}
            onClick={() => setActiveTab("posts")}
          >
            <span className="dot" />
            Tahap 2: REST API Posts
          </button>
        </div>
      </header>

      {activeTab === "notes" ? (
        <div className="layout">
          {/* ... seluruh kode NoteForm & section notes milik Orang 1 & 2 tetap di sini ... */}
        </div>
      ) : (
        <PostList />
      )}

      <div className="layout">
        <NoteForm onAddNote={handleAddNote} categories={categories} />

        <section>
          <div className="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="text"
              placeholder="Cari berdasarkan judul..."
              aria-label="Cari catatan berdasarkan judul"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                aria-label="Hapus kata pencarian"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <div className="chips">
              <button
                type="button"
                className="chip"
                aria-pressed={selectedCategory === null}
                onClick={() => setActiveCategory(null)}
              >
                Semua
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className="chip"
                  aria-pressed={selectedCategory === category}
                  style={{ "--hue": categoryHue(category) } as CSSProperties}
                  onClick={() =>
                    setActiveCategory(
                      selectedCategory === category ? null : category,
                    )
                  }
                >
                  <span className="dot" />
                  {category}
                </button>
              ))}
            </div>
          )}

          <p className="result-info" aria-live="polite">
            {isFiltering &&
              `Menampilkan ${filteredNotes.length} dari ${notes.length} catatan`}
          </p>

          <div className="notes">
            {filteredNotes.length === 0 ? (
              <div className="empty">
                {notes.length === 0 ? (
                  <>
                    <strong>Belum ada catatan</strong>
                    <span>Isi form untuk menulis catatan pertamamu.</span>
                  </>
                ) : (
                  <>
                    <strong>Catatan tidak ditemukan</strong>
                    <span>Coba kata lain atau ganti kategori.</span>
                    <button type="button" className="link-btn" onClick={resetFilters}>
                      Tampilkan semua catatan
                    </button>
                  </>
                )}
              </div>
            ) : (
              filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDeleteNote={handleDeleteNote}
                  highlight={search}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;