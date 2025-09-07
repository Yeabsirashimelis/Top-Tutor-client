// hooks/course-notes-hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Note } from "@/types/types";
import { betterFetch } from "@better-fetch/fetch";

// Fetch notes
export const getNotes = async (
  courseId: string,
  sectionId: string,
  userId: string
) => {
  const res = await betterFetch<{ message: string; data: Note[] }>(
    `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/notes?courseId=${courseId}&sectionId=${sectionId}&userId=${userId}`
  );
  return res.data?.data || [];
};

// Hook to get notes
export const useGetNotes = (
  courseId: string,
  sectionId: string,
  userId: string
) => {
  return useQuery({
    queryKey: ["notes", courseId, sectionId, userId],
    queryFn: () => getNotes(courseId, sectionId, userId),
    enabled: !!courseId && !!sectionId && !!userId,
  });
};

// Hook to create a note
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: {
      courseId: string;
      sectionId: string;
      lectureId: string;
      userId: string;
      content: string;
    }) => {
      const res = await betterFetch<{ message: string; notes: Note }>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(note),
        }
      );
      return res.data?.notes; // matches backend's "notes" field
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "notes",
          variables.courseId,
          variables.sectionId,
          variables.userId,
        ],
      });
    },
  });
};

// UPDATE note hook
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      noteId,
      content,
    }: {
      noteId: string;
      content: string;
    }) => {
      const res = await betterFetch<{ message: string; note: Note }>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/notes`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId, content }),
        }
      );
      return res.data?.note;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

// DELETE note hook
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: string) => {
      const res = await betterFetch<{ message: string; note: Note }>(
        `${process.env.NEXT_PUBLIC_BACKEND_LINK}/api/notes?noteId=${noteId}`,
        { method: "DELETE" }
      );
      return res.data?.note;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};
