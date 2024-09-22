"use client";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

import {
  Image,
  Loader,
  Loader2,
  MousePointerSquareDashedIcon,
} from "lucide-react";
import React, { useCallback, useState, useTransition } from "react";
import Dropzone, { FileRejection, useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const page = () => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const router = useRouter();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      const configId = data.serverData.configId;
      startTransition(() => {
        router.push(`/configure/design?id=${configId}`);
      });
    },
    onUploadProgress: (p) => {
      setUploadProgress(p);
    },
  });
  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [files] = rejectedFiles;
    setIsDragOver(false);
    toast({
      title: `${files.file.type} type is not supported`,
      description: "Please choose PNG, JPG, JPEG images instead",
      variant: "destructive",
    });

    // Drop rejected code goes here
  };
  const onDropAccepted = (acceptedFiles: File[]) => {
    console.log("accepted files", acceptedFiles);
    startUpload(acceptedFiles, { configId: undefined });
    setIsDragOver(false);
  };

  const [isPending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center",
        {
          "ring-blue-900/25 bg-blue-00/10": isDragOver,
        }
      )}
    >
      <div className="relative flex flex-1 flex-col items-center justify-center w-full">
        <Dropzone
          onDropRejected={onDropRejected}
          onDropAccepted={onDropAccepted}
          accept={{
            "image/png": [".png"],
            "image/jpeg": [".jpeg"],
            "image/jpg": [".jpg"],
          }}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              className="h-full w-full flex-1 flex flex-col items-center justify-center"
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              {isDragOver ? (
                <MousePointerSquareDashedIcon className="h-6 w-6 text-zinc-500 mb-2" />
              ) : isUploading || isPending ? (
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" />
              ) : (
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
              )}
              <div className="flex flex-col justify-center mb-2 text-sm text-zinc-700">
                {isUploading ? (
                  <div className="flex flex-col">
                    <p>Uploading...</p>
                    <Progress
                      className="mt-2 w-40 h-2 bg-gray-300 "
                      value={uploadProgress}
                    />
                  </div>
                ) : isPending ? (
                  <div className="flex flex-col items-center">
                    <p>Redirecting, Pleae wait...</p>
                  </div>
                ) : isDragOver ? (
                  <p>
                    <span className="font-semibold">Drop File</span> to upload
                  </p>
                ) : (
                  <p>
                    <span className="font-semibold">Click to upload</span> or
                    Drag and drop
                  </p>
                )}
              </div>
              {isPending ? null : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG </p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </div>
  );
};

export default page;
