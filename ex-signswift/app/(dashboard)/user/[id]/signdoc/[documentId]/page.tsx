//sign doc route should be seend by email only
"use client";
import PdfFillComponent from "@/components/DragDrop/pdfFillComponent";

import SignatureForm from "@/components/Form/signatureForm";
import { useParams } from "next/navigation";
import axios from "axios";
import React, { useState } from "react";
import SignatureCanvas from "react-signature-canvas";

import { useEffect } from "react";
import H2 from "@/components/Typography/H2";
import H4 from "@/components/Typography/H4";
import { useRouter } from "next/navigation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Cookies from "js-cookie";
import { User } from "@prisma/client";
import { useEdgeStore } from "@/lib/edgestore";
import Loader from "@/components/Loader";
import emailjs from "emailjs-com";
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
  recipientId: string;
}
const page = () => {
  const { edgestore } = useEdgeStore();
  const params = useParams<{ documentId: string; id: string }>();
  console.log(params.id, params.documentId);
  const signatureCanvasRef = React.useRef<SignatureCanvas | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = React.useState<boolean>(false);
  const [url, setUrl] = React.useState("");
  const [email, setEmail] = React.useState("");
  const router = useRouter();
  // Run only once on component mount
  const signatureCanvasRef2 = React.useRef<SignatureCanvas | null>(null);
  const [copiedItems, setCopiedItems] = React.useState<IField[]>([]);
  const [recipients, setRecipients] = React.useState<any[]>([]);
  const [signNumber, setSignNumber] = React.useState<number>(0);
  const [userx, setUser] = React.useState<User>();
  const [recipientid, setrecipientid] = React.useState<string>("0");

  React.useEffect(() => {
    const cookieData = Cookies.get("session");
    if (cookieData) {
      const jsonData = JSON.parse(cookieData);
      console.log(jsonData);
      setUser(jsonData.data.user);
    } else {
      //redirect to login
      router.push("/login");
    }
  }, []);
  useEffect(() => {
    setEmail(userx?.email || "");
    const getDocument = async () => {
      const response = await axios.post(
        "https://sign-swift.vercel.app/api/document/getDocument",
        {
          docId: params.documentId,
        }
      );
      console.log("step4", response);
      setUrl(response?.data?.Document?.ShareLink);
      console.log(userx?.email, "step444444");
      const recipientxxx = response?.data?.Document?.Recipient?.find(
        (user: any) =>
          user.email === (userx?.email !== undefined ? userx?.email : "")
      );
      let recipientId = "0";
      if (recipientxxx) {
        recipientId = recipientxxx.id;
      }

      setrecipientid(recipientId);
      console.log(recipientId, "recipient ddd");
      const fields = response?.data?.Document?.Field?.filter((item: IField) => {
        return item.recipientId === recipientId;
      });
      //filter out fields for this user only
      const user = recipients.find((user) => user.email === userx?.email);
      if (user?.role != "VIEWER") {
        setCopiedItems(fields);
        console.log("hhhh");
      }

      setRecipients(response?.data?.Document?.Recipient);
      setSignNumber(response?.data?.Document?.signnumber);

      console.log("step5", recipients, signNumber);
      if (userx?.id) {
        const user = recipients.find((user) => user.email === userx?.email);

        if (response?.data?.Document.isOrder) {
          if (user?.signnumber === recipients?.length - 1) {
            setIsLast(true);
          }
        } else {
          const notsignedrecipients = recipients.filter((recipient) => {
            return recipient.signingStatus === "NOT_SIGNED";
          });
          if (user?.signnumber === notsignedrecipients?.length - 1) {
            setIsLast(true);
          }
        }

        console.log("step6", user);
        if (user && response?.data?.Document.isOrder) {
          if (user.signnumber !== signNumber) {
            console.log("333");
            toast(
              "Currently you are not allowed to sign Wait for your number to come to sign the doc. Redirecting",
              {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              }
            );
            setTimeout(() => {
              router.push(`https://sign-swift.vercel.app/user/${params.id}`);
            }, 2000);
          }
        }
      }
    };

    getDocument();
  }, [params, signNumber, url, email]);

  const handleSign = async () => {
    const signDoc = async () => {
      try {
        setLoading(true);

        const response = await axios.post(
          "https://sign-swift.vercel.app/api/document/addSignature",
          {
            docId: params.documentId,
            copiedItems: copiedItems,
            isLast: isLast,
            recipientEmail: email,
            recipientid: recipientid,
          }
        );
        console.log(response, "funny");

        if (isLast) {
          const emaillist = response.data.emaillist.join(",");
          const url = response.data.presignedUrltodownload;
          emailjs
            .send(
              "service_gvqozgy",
              "template_dqism0s",
              {
                presignedUrltodownload: url,
                reply_to: emaillist,
              },
              "RC3YaLXE1VvIp-Rhs"
            )
            .then(
              (response: any) => {
                console.log("SUCCESS!", response.status, response.text);
              },
              (error: any) => {
                console.log("FAILED...", error);
              }
            );
        } else {
          if (response?.data?.signedbyone) {
            emailjs
              .send(
                "service_gvqozgy",
                "template_w3ieoye",
                {
                  signed_by: response?.data?.recipientemail,
                  reply_to: response?.data?.reply_to,
                },
                "RC3YaLXE1VvIp-Rhs"
              )
              .then(
                (response: any) => {
                  console.log("SUCCESS!", response.status, response.text);
                },
                (error: any) => {
                  console.log("FAILED...", error);
                }
              );
          }
        }
      } catch (error) {
        console.error("Error during API call:", error);
      } finally {
        setLoading(false);
      }

      router.push(`https://sign-swift.vercel.app/user/${params.id}`);
    };
    signDoc();
  };
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className="w-full flex flex-col  items-center px-16"
      style={{
        overflowY: "hidden",
        height: "100%",
      }}
    >
      <ToastContainer />
      <div className="w-full flex flex-col gap-7 pt-10 ">
        <H2>{"Pdf_file_name"}</H2>
        <H4>Recepient info</H4>
      </div>
      <div className="flex flex-row w-full  gap-36">
        <div
          className="rounded-md h-full  w-full max-w-[40rem]"
          style={{
            display: "flex",
            padding: "1rem",
          }}
        >
          <PdfFillComponent
            url={url}
            copiedItems={copiedItems}
            signatureCanvasRef={signatureCanvasRef}
            signatureCanvasRef2={signatureCanvasRef2}
            userid={params.id}
          />
        </div>
        <div className="w-[30rem]  h-full mb-10 flex  items-start pt-10 ">
          <SignatureForm
            signatureCanvasRef={signatureCanvasRef2}
            handleSign={handleSign}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
