import { useState, type FormEvent } from "react";
import type { Note } from "../types/Note";

interface NoteFormProps {
  onAddNote: (note: Note) => void;
  categories?: string[];
}

export function NoteForm({ onAddNote, categories = [] }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const isValid = title.trim() && content.trim() && category.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
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
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>Tambah Catatan</h2>

      <label className="field">
        <span>Judul</span>
        <input
          type="text"
          placeholder="Judul catatan"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Isi</span>
        <textarea
          placeholder="Isi catatan"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>

      <label className="field">
        <span>Kategori</span>
        <input
          type="text"
          list="category-list"
          placeholder="Kategori"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        />
        <datalist id="category-list">
          {categories.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      </label>

      <button className="btn btn-primary" type="submit" disabled={!isValid}>
        Tambah Catatan
      </button>
    </form>
  );
}