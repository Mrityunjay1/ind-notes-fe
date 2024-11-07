import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { PlusCircle, LogOut, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNoteStore } from "../store/useNoteStore";
import { api } from "../services/api";
import { NoteEditor } from "../components/NoteEditor";
import { NoteList } from "../components/NoteList";
import type { Note } from "../types";

export function NotesPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { notes, setNotes, addNote, updateNote, deleteNote } = useNoteStore();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNotes = await api.notes.getAll(); // GET /notes
      setNotes(fetchedNotes);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (data: { title: string; content: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      if (editingNote) {
        const updated = await api.notes.update(editingNote.id, data); // PUT /notes/{id}
        updateNote(updated);
        toast.success("Note updated successfully");
      } else {
        const created = await api.notes.create(data); // POST /notes
        addNote(created);
        toast.success("Note created successfully");
      }
      resetEditor();
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    setIsLoading(true);
    setError(null);
    try {
      await api.notes.delete(id); // DELETE /notes/{id}
      deleteNote(id);
      toast.success("Note deleted successfully");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setNotes([]);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    setError(message);
    if (message.includes("Authentication required")) {
      handleLogout();
    }
  };

  const resetEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{user?.email}</span>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="flex-1 text-sm text-red-700">{error}</div>
              <button
                onClick={loadNotes}
                className="px-3 py-1 text-sm font-medium text-red-700 hover:text-red-800 bg-red-100 rounded-md hover:bg-red-200"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {isEditorOpen ? (
          <div className="max-w-3xl mx-auto">
            <NoteEditor
              note={editingNote}
              onSave={handleSave}
              onCancel={resetEditor}
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditorOpen(true)}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Note
              </button>
            </div>

            <NoteList
              notes={notes}
              onEdit={(note) => {
                setEditingNote(note);
                setIsEditorOpen(true);
              }}
              onDelete={handleDelete}
              disabled={isLoading}
            />
          </div>
        )}
      </main>
    </>
  );
}
