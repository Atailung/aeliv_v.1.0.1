"use client";
import React, { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderState,
  RenderUploadingState,
  RenderDeletingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct";

interface UploaderState {
  id: string | null;
  file: File | null;
  Uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

interface iAppProps {
  value?: string;
  onChange?: (url: string) => void;
  disabled?: boolean;
  fileTypeAccept: "image" | "video";
}

function Uploader({
  value,
  onChange,
  fileTypeAccept,
  disabled = false,
}: iAppProps) {
  const fileUrl = useConstructUrl(value || "");
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    isDeleting: false,
    key: value,
    progress: 0,
    Uploading: false,
    fileType: fileTypeAccept,
    objectUrl: value ? fileUrl : undefined,
  });

  // Cleanup object URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (fileState.objectUrl) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const uploadFile = useCallback(
    async (file: File) => {
      const fileType = file.type.split("/")[0] as "image";
      setFileState((pre) => ({
        ...pre,
        file: file,
        Uploading: true,
        id: uuidv4(),
        fileType,
        error: false,
      }));
      try {
        // 1 get presigned url from the server
        const presignedResponse = await fetch(`/api/s3/upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            isImage: fileTypeAccept === "image" ? true : false,
          }),
        });

        if (!presignedResponse.ok) {
          const errorText = await presignedResponse.text();
          toast.error(
            `Failed to get presigned URL: ${errorText || "Server error"}`
          );
          setFileState((pre) => ({
            ...pre,
            error: true,
            Uploading: false,
            progress: 0,
          }));
          return;
        }

        const { key, presignedUrl } = await presignedResponse.json();

        if (!key || !presignedUrl) {
          throw new Error(
            "Invalid response from server: missing key or presigned URL"
          );
        }

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentageCompleted = (event.loaded / event.total) * 100;
              setFileState((pre) => ({
                ...pre,
                progress: Math.round(percentageCompleted),
              }));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setFileState((pre) => ({
                ...pre,
                progress: 100,
                key: key,
                Uploading: false,
                error: false,
              }));
              onChange?.(key);
              toast.success("File uploaded successfully");
              resolve();
            } else {
              const errorMessage = `Upload failed with status ${xhr.status}: ${xhr.statusText}`;
              reject(new Error(errorMessage));
            }
          };

          xhr.onerror = () => {
            reject(new Error("Network error occurred during upload"));
          };

          xhr.ontimeout = () => {
            reject(new Error("Upload timed out"));
          };

          xhr.timeout = 60000; // 60 second timeout
          xhr.open("PUT", presignedUrl);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (error) {
        console.error("Upload error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        toast.error(`Error uploading file: ${errorMessage}`);
        setFileState((pre) => ({
          ...pre,
          error: true,
          Uploading: false,
          progress: 0,
        }));
      }
    },
    [fileTypeAccept, onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Validate file type
        const fileType = file.type.split("/")[0] as "image" | "video";
        if (fileType !== fileTypeAccept) {
          toast.error("Only image files are allowed");
          return;
        }

        // Clean up previous object URL to prevent memory leaks
        if (fileState.objectUrl) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        const newObjectUrl = URL.createObjectURL(file);

        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        setFileState({
          error: false,
          objectUrl: newObjectUrl,
          progress: 0,
          file: file,
          Uploading: false,
          id: uuidv4(),
          isDeleting: false,
          key: undefined,
          fileType: fileTypeAccept,
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl, fileTypeAccept, uploadFile]
  );

  function rejectedFiles(fileRejections: FileRejection[]) {
    if (fileRejections.length) {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          switch (error.code) {
            case "too-many-files":
              toast.error(
                `Too many files selected. Please select only one file. Rejected: ${rejection.file.name}`
              );
              break;
            case "file-too-large":
              toast.error(
                `File too large. Maximum size is 5MB. Rejected: ${rejection.file.name}`
              );
              break;
            case "file-invalid-type":
              toast.error(
                `Invalid file type. Only images are allowed. Rejected: ${rejection.file.name}`
              );
              break;
            default:
              toast.error(
                `File rejected: ${error.message}. File: ${rejection.file.name}`
              );
          }
        });
      });
    }
  }

  function renderContent() {
    if (fileState.Uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }
    if (fileState.error) {
      return (
        <div className="text-center">
          <p className="text-red-500 mb-2">
            Error uploading file. Please try again.
          </p>
          <button
            onClick={() => setFileState((prev) => ({ ...prev, error: false }))}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (fileState.objectUrl) {
      return (
        <RenderDeletingState
          handleRemoveFile={handleRemoveFile}
          isDeleting={fileState.isDeleting}
          previewUrl={fileState.objectUrl}
          fileType={fileState.fileType}
        />
      );
    }
    return <RenderState isDragActive={isDragActive} />;
  }

  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;
    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));
      const response = await fetch(`/api/s3/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: fileState.key }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        toast.error(`Failed to delete file: ${errorText || "Server error"}`);
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
        return;
      }
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        error: false,
        file: null,
        id: null,
        isDeleting: false,
        key: undefined,
        objectUrl: undefined,
        progress: 0,
        Uploading: false,
        fileType: fileTypeAccept,
      });
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error(
        `Error deleting file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }
  useEffect(() => {
    // Cleanup object URL when component unmounts or when a new file is selected
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileTypeAccept === "video" ? { "video/*": [] } : { "image/*": [] },
    multiple: false,
    maxFiles: 1,
    maxSize: fileTypeAccept === "image" ? 5 * 1024 * 1024 : 5000 * 1024 * 1024, // 5 MB for images, 5 GB for videos
    onDropRejected: rejectedFiles,
    disabled: disabled || fileState.Uploading || !!fileState.key,
  });

  return (
    <>
      <Card
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
          {
            "border-primary bg-primary/10": !isDragActive,
            "border-border hover:border-primary": isDragActive,
          }
        )}
      >
        <CardContent className="flex items-center justify-center h-full w-full p-4">
          <input {...getInputProps()} />
          {renderContent()}
        </CardContent>
      </Card>
    </>
  );
}

export default Uploader;
