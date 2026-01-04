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
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {buttonText}
      </label>
      <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors bg-gray-50">
        <div className="flex flex-col items-center justify-center space-y-2">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, JPEG (MAX. 4MB)
            </p>
          </div>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={onClientUploadComplete}
            onUploadError={onUploadError}
            appearance={{
              button:
                "ut-ready:bg-blue-600 ut-ready:hover:bg-blue-700 ut-uploading:cursor-not-allowed ut-uploading:bg-blue-400 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors",
              container: "w-auto",
              allowedContent: "hidden",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FileUploadButton;
