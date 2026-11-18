import { useState } from "react";
import type { Note } from "./types/Note";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { NoteForm } from "./components/NoteForm";
import { NoteCard } from "./components/NoteCard";

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);
  const [search, setSearch] = useState("");

  const handleAddNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const handleDeleteNote = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <main>
      <h1>Catatan</h1>

      <NoteForm onAddNote={handleAddNote} />

      <input
        type="text"
        placeholder="Cari berdasarkan judul..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {filteredNotes.length === 0 ? (
        <p>
          {notes.length === 0
            ? "Belum ada catatan."
            : "Catatan tidak ditemukan."}
        </p>
      ) : (
        filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDeleteNote={handleDeleteNote}
          />
        ))
      )}
    </main>
  );
}

export default App;