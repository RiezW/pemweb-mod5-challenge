import { useState, type CSSProperties, type ReactNode } from "react";
import type { Note } from "../types/Note";
import { categoryHue } from "../utils/categoryColor";

interface NoteCardProps {
  note: Note;
  onDeleteNote: (id: number) => void;
  highlight?: string;
}

function highlightText(text: string, query: string): ReactNode {
  const q = query.trim();
  if (!q) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === q.toLowerCase() ? <mark key={index}>{part}</mark> : part,
  );
}

export function NoteCard({ note, onDeleteNote, highlight = "" }: NoteCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const isLong = note.content.length > 120 || note.content.split("\n").length > 4;

  const handleDelete = () => {
    setLeaving(true);
    window.setTimeout(() => onDeleteNote(note.id), 250);
  };

  const createdAt = new Date(note.id).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });

  const className = ["note-card", expanded ? "expanded" : "", leaving ? "leaving" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={className} style={{ "--hue": categoryHue(note.category) } as CSSProperties}>
      <div className="note-top">
        <span className="note-badge">{note.category}</span>
        <button
          type="button"
          className="note-delete"
          aria-label={`Hapus catatan ${note.title}`}
          onClick={handleDelete}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
          </svg>
        </button>
      </div>

      <h3 className="note-title">{highlightText(note.title, highlight)}</h3>
      <p className="note-body">{note.content}</p>

      <div className="note-meta">
        <span>{createdAt}</span>
        {isLong && (
          <button
            type="button"
            className="note-toggle"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Ringkas" : "Baca semua"}
          </button>
        )}
      </div>
    </article>
  );
}