import { Pencil, Trash2 } from "lucide-react";
import type { Note } from "../types";

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export function NoteList({ notes, onEdit, onDelete, disabled }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No notes yet. Create your first note!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium text-gray-900">{note.title}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(note)}
                disabled={disabled}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pencil className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => onDelete(note.id)}
                disabled={disabled}
                className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">{note.content}</p>
        </div>
      ))}
    </div>
  );
}
