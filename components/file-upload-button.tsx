"use client";
import { UploadButton } from "@/lib/uploadthing";
import React from "react";

const FileUploadButton = ({
  onClientUploadComplete,
  onUploadError,
  buttonText,
}: {
  onClientUploadComplete: (res: { url: string; key: string }[]) => void; // Expecting an array for multiple files
  onUploadError: (error: Error) => void;
  buttonText: string;
}) => {
  return (
    <UploadButton
      endpoint="imageUploader" // Ensure this endpoint supports multiple uploads
      className="border"
      onClientUploadComplete={onClientUploadComplete} // Handle array of uploaded files
      onUploadError={onUploadError} // Handle upload errors
      appearance={{
        button: "ut-uploading:cursor-not-allowed px-2 mt-2", // Custom styling for the button
        container:
          "w-full flex-row rounded-md border-gray-300 border-dashed text-black", // Container styling
        allowedContent:
          "flex h-8 flex-col items-center justify-center px-2 text-black", // Content styling
      }}
    />
  );
};

export default FileUploadButton;
