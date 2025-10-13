import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // const session = await getSession();

      // // If you throw, the user will not be able to upload
      // if (!session) throw new UploadThingError("Unauthorized");

      // // Whatever is returned here is accessible in onUploadComplete as `metadata`
      // return { userId: session?.user?.id };
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      // console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: "anonymous" };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
