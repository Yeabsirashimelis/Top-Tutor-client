"use client";

import { useState } from "react";
import { Bookmark, Trash2, Clock } from "lucide-react";
import { useGetBookmarks, useAddBookmark, useRemoveBookmark } from "@/hooks/bookmark-hooks";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface VideoBookmarksProps {
  userId: string;
  lectureId: string;
  courseId: string;
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function VideoBookmarks({
  userId,
  lectureId,
  courseId,
  currentTime,
  onSeek,
}: VideoBookmarksProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [note, setNote] = useState("");

  const { data: bookmarks, isLoading } = useGetBookmarks(userId, lectureId);
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAddBookmark = () => {
    addBookmark.mutate(
      {
        userId,
        lectureId,
        courseId,
        timestamp: Math.floor(currentTime),
        note,
      },
      {
        onSuccess: () => {
          setNote("");
          setShowAddForm(false);
        },
      }
    );
  };

  const handleRemoveBookmark = (bookmarkId: string) => {
    removeBookmark.mutate({ bookmarkId, userId });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          <Bookmark className="w-5 h-5" />
          Bookmarks
        </h3>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          size="sm"
          variant="outline"
        >
          <Bookmark className="w-4 h-4 mr-2" />
          Add Bookmark
        </Button>
      </div>

      {showAddForm && (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            Current time: {formatTime(currentTime)}
          </div>
          <Textarea
            placeholder="Add a note (optional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddBookmark}
              disabled={addBookmark.isPending}
              size="sm"
            >
              {addBookmark.isPending ? "Saving..." : "Save Bookmark"}
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setNote("");
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading bookmarks...</div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <div className="space-y-2">
          {bookmarks.map((bookmark: any) => (
            <div
              key={bookmark._id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div
                  onClick={() => onSeek(bookmark.timestamp)}
                  className="flex-1"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                    <Clock className="w-4 h-4" />
                    {formatTime(bookmark.timestamp)}
                  </div>
                  {bookmark.note && (
                    <p className="text-sm text-gray-600 mt-1">{bookmark.note}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark._id)}
                  className="opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 p-1"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Bookmark className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No bookmarks yet</p>
          <p className="text-sm">Add bookmarks to mark important moments</p>
        </div>
      )}
    </div>
  );
}
