"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, Edit, Trash2, Clock, Plus } from "lucide-react";
import {
  useCreateNote,
  useGetNotes,
  useUpdateNote,
  useDeleteNote,
} from "@/hooks/course-note-hooks";

interface CourseNotesProps {
  userId: string;
  courseId: string;
  sectionId: string;
  lectureId: string;
  allLectures: any[];
  onSelectLecture: (sectionId: string, lectureId: string) => void;
}

export default function CourseNotes({
  userId,
  courseId,
  sectionId,
  lectureId,
  allLectures,
  onSelectLecture,
}: CourseNotesProps) {
  const { data: notes = [], isLoading } = useGetNotes(
    courseId,
    sectionId,
    userId
  );
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();

  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    createNoteMutation.mutate(
      { userId, courseId, sectionId, lectureId, content: newNote },
      {
        onSuccess: () => setNewNote(""),
        onError: (err) => console.error("Failed to create note:", err),
      }
    );
  };

  const handleEditNote = (id: string) => {
    const noteToEdit = notes.find((note) => note._id === id);
    if (noteToEdit) {
      setEditingNoteId(id);
      setEditContent(noteToEdit.content);
    }
  };

  const handleSaveEdit = () => {
    if (!editContent.trim() || !editingNoteId) return;

    updateNoteMutation.mutate(
      { noteId: editingNoteId, content: editContent },
      {
        onSuccess: () => {
          setEditingNoteId(null);
          setEditContent("");
        },
        onError: (err) => console.error("Failed to update note:", err),
      }
    );
  };

  const handleDeleteNote = (id: string) => {
    setDeletingNoteId(id);
    deleteNoteMutation.mutate(id, {
      onSuccess: () => setDeletingNoteId(null),
      onError: () => setDeletingNoteId(null),
    });
  };

  if (isLoading) return <p>Loading notes...</p>;

  return (
    <div className="space-y-6">
      {/* Add Note */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Your Notes</h3>
        <div className="flex flex-col gap-2">
          <Textarea
            placeholder="Add a note for this section..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="font-bold">Section ID: {sectionId}</span>
            </div>
            <Button
              onClick={handleAddNote}
              className="bg-indigo-600"
              disabled={createNoteMutation.isPending}
            >
              {createNoteMutation.isPending ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {notes.map((note) => {
          // Find the lecture object by lectureId
          const lecture = allLectures.find((l) => l._id === note.lectureId);

          return (
            <div key={note._id} className="border rounded-md p-4 space-y-2">
              {editingNoteId === note._id ? (
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
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={updateNoteMutation.isPending}
                    >
                      {updateNoteMutation.isPending ? (
                        "Saving..."
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{note.content}</p>
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-muted-foreground flex items-center gap-2">
                      {/* Lecture clickable */}
                      {lecture ? (
                        <span
                          className="cursor-pointer font-bold text-blue-600 hover:underline"
                          onClick={() =>
                            onSelectLecture(lecture.sectionId, lecture._id)
                          }
                        >
                          {lecture.title}
                        </span>
                      ) : (
                        <span>Lecture: {note.lectureId}</span>
                      )}
                      <span>•</span>
                      <span>{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditNote(note._id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteNote(note._id)}
                        disabled={deletingNoteId === note._id}
                      >
                        {deletingNoteId === note._id ? (
                          "Deleting..."
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
