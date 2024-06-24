"use client";
import PdfFillComponent from "@/components/DragDrop/pdfFillComponent";
import SignatureForm from "@/components/Form/signatureForm";
import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import EmailForm from "@/components/emailForm";
import PdfViewer from "@/components/PdfViewer/viewer";
import H2 from "@/components/Typography/H2";
import H4 from "@/components/Typography/H4";
import Loader from "@/components/Loader";

interface IField {
  id: number;
  secondaaryId: string;
  left: string;
  top: string;
  width: string;
  height: string;
  page: number;
  text: string;
  icon: string;
  recipientId: number;
}
interface IReceptient {
  email: string;
  name: string;
  id: number;
}
const page = ({ params }: { params: { id: string; documentId: string } }) => {
  const signatureCanvasRef = React.useRef<SignatureCanvas | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = params.id;
  const signatureCanvasRef2 = React.useRef<SignatureCanvas | null>(null);
  const [receptient, setReceptient] = React.useState<IReceptient[]>([]);
  const [url, setUrl] = React.useState("");
  const [copiedItems, setCopiedItems] = React.useState<IField[]>([]);
  useEffect(() => {
    const getDocument = async () => {
      setLoading(true);
      const response = await axios.post(
        "https://sign-swift.vercel.app/api/document/getDocument",
        {
          docId: params.documentId,
        }
      );

      console.log("step4", response);
      response?.data?.Document?.Recipient?.map((item: IReceptient) => {
        const res1 = { name: item.name, email: item.email, id: item.id };
        setReceptient((prev) => [...prev, res1]);
        console.log("check bu arc", receptient);
      });
      setUrl(response?.data?.Document?.ShareLink);
      setCopiedItems(response?.data?.Document?.Field);
      setLoading(false);
    };

    getDocument();
  }, [params]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[1299] bg-gray-800 bg-opacity-50">
        <Loader />
      </div>
    );
  }
  console.log(receptient);
  return (
    <div className="flex flex-col px-16 ">
      <div className="w-full flex flex-col gap-7 pt-10 ">
        <H2>{"Pdf_file_name"}</H2>
        <H4>Recepient info</H4>
      </div>
      <div
        className="w-full flex flex-row justify-between   space-x-20   "
        // style={{ overflowY: "hidden", height: "86vh" }}
      >
        <div
          style={{
            // overflowY: "hidden",
            // overflowX: "hidden",
            height: "100%",
          }}
          id="pdf-viewer"
          className="rounded-md  max-w-[40rem]"
        >
          <PdfViewer
            copiedItems={copiedItems}
            receptient={receptient}
            url={url}
          />
        </div>
        <div className="w-[50rem]  justify-center pt-0  ">
          <div className="w-full   h-[50rem]">
            <EmailForm
              userId={userId}
              recipient={receptient}
              docId={params.documentId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
