import { useState } from "react";
import { NoteForm } from "./components/NoteForm";
import { NoteCard } from "./components/NoteCard";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Note } from "./types/Note";

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);
  const [search, setSearch] = useState("");

  const handleAddNote = (note: Note) => {
    setNotes((currentNotes) => [...currentNotes, note]);
  };

  const handleDeleteNote = (id: number) => {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id),
    );
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main>
      <h1>Papan Catatan</h1>

      <NoteForm onAddNote={handleAddNote} />

      <section>
        <h2>Cari Catatan</h2>

        <input
          type="search"
          placeholder="Cari berdasarkan judul..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <section>
        <h2>Daftar Catatan</h2>

        {filteredNotes.length === 0 ? (
          <p>Belum ada catatan yang sesuai.</p>
        ) : (
          filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDeleteNote={handleDeleteNote}
            />
          ))
        )}
      </section>
    </main>
  );
}

export default App;