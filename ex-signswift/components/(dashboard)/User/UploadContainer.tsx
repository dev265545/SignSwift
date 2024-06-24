"use client";
import { DocumentDropzone } from "@/components/(dashboard)/User/Upload";
import { useToast } from "@/components/ui/use-toast";
import { useEdgeStore } from "../../../lib/edgestore";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRef, useState } from "react";
import { FileProps, ShortFileProp } from "@/app/utils/types";
import {
  getPresignedUrls,
  handleUpload,
  MAX_FILE_SIZE_S3_ENDPOINT,
  validateFiles,
} from "@/app/utils/fileUploadHelpers";
import { createPresignedUrlToDownload } from "@/app/utils/s3-file-management";

export async function getPresignedUrl(file: FileProps) {
  console.log(file.name);
  const response = await fetch(`/api/files/download/presignedUrl/${file.id}`);
  const res = await response.json();
  console.log();

  return res?.message;
}
export default function UploadContainer(id: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { edgestore } = useEdgeStore();
  const onFileDropRejected = () => {
    toast({
      title: "Your document failed to upload.",
      description: `File cannot be larger than 50 MB`,
      duration: 5000,
      variant: "destructive",
    });
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const uploadToServer = async (file: any) => {
    console.log(file);
    // check if files are selected
    if (!file) {
      alert("Please, select file you want to upload");
      return;
    }
    // get File[] from FileList
    const files = Object.values(file);
    // validate files
    const filesInfo: ShortFileProp[] = [
      {
        originalFileName: file.name,
        fileSize: file.size,
      },
    ];

    const filesValidationResult = validateFiles(
      filesInfo,
      MAX_FILE_SIZE_S3_ENDPOINT
    );
    if (filesValidationResult) {
      alert(filesValidationResult);
      return;
    }
    setLoading(true);

    // const presignedUrls = await getPresignedUrls(filesInfo);
    // console.log(presignedUrls, "Dev");
    // if (!presignedUrls?.length) {
    //   alert("Something went wrong, please try again later");
    //   return;
    // }

    // upload files to s3 endpoint directly and save file info to db

    // await handleUpload([file], presignedUrls, async function () {}).then(
    //   async () => {
    //     console.log(presignedUrls[0].url, file);
    //     setTimeout(async () => {
    //       console.log("time out 4 seconds hello");
    //       const filesx = await axios.post("/api/files");
    //       let body = filesx.data as FileProps[];
    //       console.log(body);
    //       console.log(body[0], "dev body");
    //       while (
    //         body[0].originalFileName !== presignedUrls[0].originalFileName
    //       ) {
    //         const filesxc = await axios.post("/api/files");
    //         body = filesxc.data as FileProps[];
    //         console.log(body);
    //         console.log(body[0], "dev body");
    //       }

    //       const presignedUrl = await getPresignedUrl(body[0]);
    //       console.log(presignedUrl);
    //       const response = await axios.post("/api/document/uploadDocument", {
    //         userId: id.id,
    //         ShareLink: presignedUrl,
    //       });
    //       console.log(response);
    //       router.push(
    //         `/user/${id.id}/document/${response.data.document.id}/step1`
    //       );
    //     }, 4000);
    //   }
    // );

    const uploadStagedFile = async (stagedFile: File | Blob) => {
      console.log("stagedfile", stagedFile);
      const form = new FormData();
      form.set("file", stagedFile);

      // here /api/upload is the route of my handler
      const res = await fetch("/api/cloudinary", {
        method: "POST",
        body: form,
        headers: {
          // add token
          // content-type will be auto-handled and set to multipart/form-data
        },
      });

      const data = await res.json();

      // we will return the uploaded image URL from the API to the client
      console.log(data.imgUrl);
      return data.imgUrl;
    };
    console.log(file, typeof file);
    return uploadStagedFile(file);
  };
  const onFileDrop = async (file: File) => {
    try {
      if (file) {
        console.log("file");
        const res = await uploadToServer(file);

        // const res = await edgestore.publicFiles.upload({
        //   file,
        //   onProgressChange: (progress) => {
        //     console.log(progress);
        //     setLoading(true);
        //   },
        // });

        console.log(res, "hello res minio");

        const response = await axios
          .post("/api/document/uploadDocument", {
            userId: id.id,
            ShareLink: res,
          })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              console.log("push push push");
              router.push(
                `/user/${id.id}/document/${response.data.document.id}/step1`
              );
            }
          });

        console.log("after push");

        setLoading(false);
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="text-black flex flex-col gap-4 bg-white   ">
      {/* User Dashboard with ID here the user should be directed to after login
      here will be the upload and table function */}
      {!loading ? (
        <DocumentDropzone
          className="h-[50vh]"
          onDrop={onFileDrop}
          onDropRejected={onFileDropRejected}
        />
      ) : (
        <div
          className=" h-[50vh] flex items-center justify-center"
          role="status"
        >
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </main>
  );
}
