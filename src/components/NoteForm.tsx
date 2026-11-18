import { useState, type FormEvent } from "react";
import type { Note } from "../types/Note";

interface NoteFormProps {
  onAddNote: (note: Note) => void;
}

export function NoteForm({ onAddNote }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !content.trim() || !category.trim()) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
    };

    onAddNote(newNote);

    setTitle("");
    setContent("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tambah Catatan</h2>

      <input
        type="text"
        placeholder="Judul catatan"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <textarea
        placeholder="Isi catatan"
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />

      <input
        type="text"
        placeholder="Kategori"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      />

      <button type="submit">Tambah Catatan</button>
    </form>
  );
}