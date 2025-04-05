"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit, Trash2, Clock, Plus } from "lucide-react";

// Mock notes data
const initialNotes = [
  {
    id: 1,
    content:
      "useState hook is used to add state to functional components. It returns a stateful value and a function to update it.",
    timestamp: "10:23",
    createdAt: "Today, 2:30 PM",
  },
  {
    id: 2,
    content:
      "The useState hook can be used multiple times in a single component to manage different state variables.",
    timestamp: "12:45",
    createdAt: "Today, 2:35 PM",
  },
];

export default function CourseNotes() {
  const [notes, setNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: Date.now(),
        content: newNote,
        timestamp: "14:20", // Current video timestamp
        createdAt: "Just now",
      };
      setNotes([newNoteObj, ...notes]);
      setNewNote("");
    }
  };

  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setEditingNoteId(id);
      setEditContent(noteToEdit.content);
    }
  };

  const handleSaveEdit = () => {
    if (editingNoteId && editContent.trim()) {
      setNotes(
        notes.map((note) =>
          note.id === editingNoteId ? { ...note, content: editContent } : note
        )
      );
      setEditingNoteId(null);
      setEditContent("");
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Your Notes</h3>
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Add a note for this lecture..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Current timestamp: 14:20</span>
            </div>
            <Button onClick={handleAddNote} className="bg-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded-md p-4 space-y-2">
            {editingNoteId === note.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingNoteId(null)}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p>{note.content}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-muted-foreground flex items-center gap-2">
                    <span>At {note.timestamp}</span>
                    <span>•</span>
                    <span>{note.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditNote(note.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
