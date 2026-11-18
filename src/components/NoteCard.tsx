import type { Note } from "../types/Note";

interface NoteCardProps {
  note: Note;
  onDeleteNote: (id: number) => void;
}

export function NoteCard({ note, onDeleteNote }: NoteCardProps) {
  return (
    <article>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <small>Kategori: {note.category}</small>

      <br />

      <button type="button" onClick={() => onDeleteNote(note.id)}>
        Hapus
      </button>
    </article>
  );
}