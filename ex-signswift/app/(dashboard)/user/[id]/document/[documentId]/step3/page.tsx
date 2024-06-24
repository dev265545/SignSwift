"use client";
import { DndComponent } from "@/components/DragDrop/dndComponent";
import axios from "axios";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect } from "react";
import H2 from "@/components/Typography/H2";
import H4 from "@/components/Typography/H4";
import { useApi } from "@/api-service/useApi";
import { getDocumentById } from "@/api-service/documentApi";
import Loader from "@/components/Loader";
import { IField, IRecepient } from "@/types/global.type";

// async function fetchData(params: any) {
//   try {
//     const response = await axios.post(
//       "https://sign-swift.vercel.app/api/document/getDocument",
//       { userId: parseInt(params.id), id: params.documentId }
//     );
//     console.log(response.data);
//     return response;

//     // Assuming you want to do something with the response data
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// Call the async function

export default function Document({
  params,
}: {
  params: { id: string; documentId: string };
}) {
  // const [url, setUrl] = React.useState("");
  // const response = fetchData(params).then((response) =>
  //   setUrl(response?.data.Document.url)
  // );

  interface IData {
    Document: {
      ShareLink: string;
      createdAt: Date;
      id: number;
      title: string;
      status: string;
      updatedAt: Date;
      Field: IField[];
      Recipient: IRecepient[];
    };
  }

  const { loading, error, data, request } = useApi(getDocumentById) as {
    loading: boolean;
    error: string;
    data: IData | null;
    request: (...args: any[]) => Promise<any>;
  };
  useEffect(() => {
    if (params.documentId) {
      request({ docId: params.documentId });
    }
  }, [params]);
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="px-16"
      style={{
        display: "flex",
        // overflowY: "hidden",
        flexDirection: "column",
      }}
    >
      <div className="w-full flex flex-col gap-7    pt-10 mt-8">
        <H2>{"Pdf_file_name"}</H2>
        <H4>Recepient info</H4>
      </div>
      <div className="mt-5">
        <DndProvider backend={HTML5Backend}>
          <DndComponent
            addedfield={data?.Document?.Field || []}
            url={data?.Document?.ShareLink || ""}
            docId={params.documentId}
            userId={params.id}
            recepient={data?.Document?.Recipient || []}
          />
        </DndProvider>
      </div>
    </div>
  );
}
