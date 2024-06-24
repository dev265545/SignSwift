"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import axios from "axios";
import Loader from "./Loader";
import { Button } from "./ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

// import ""

// import styles from "./globals.css";

const EmailForm = ({
  userId,
  recipient,
  docId,
}: {
  userId: string;
  recipient: any;
  docId: string;
}) => {
  const [emailSent, setEmailSent] = useState(false);
  const [inputs, setInputs] = useState({ subject: "", email_body: "" });
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // const [receptient, setReceptient] = React.useState<IReceptient[]>([]);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchRecepients = async () => {
  //     const result = await axios.post(
  //       "https://sign-swift.vercel.app/api/document/getreceptient",
  //       docId
  //     );
  //     const receptientres = result?.data;

  //     receptientres?.result?.map((item: any) => {
  //       const res = {
  //         name: item.name,
  //         email: item.email,
  //       };
  //       setReceptient((prev) => [...prev, res]);
  //     });
  //   };
  //   fetchRecepients();
  // }, [docId, userId]);

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const mails = recipient?.map((email: any) => email.email);
  console.log("mailsss", mails);
  console.log("recipient", recipient.item);
  const check = recipient?.map((item: any) => item);
  console.log("check", check);
  const sendEmail = async () => {
    setLoading2(true);
    console.log(recipient, "check by arc now");
    const emails = recipient?.map((item: any) => item.email);
    console.log(emails);
    try {
      const response = await fetch("/api/emailsent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emails,
          subject: inputs.subject,
          email_body: inputs.email_body,
          docId: docId,
        }), // Change the email address as needed
      });

      if (response) {
        setEmailSent(true);
        setLoading(false);
        setLoading2(false);
        router.push(`/user/${userId}`);
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    } finally {
      setLoading(false);
      setLoading2(false);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(inputs);
    // alert(inputs.username + inputs.age);
    await sendEmail();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <Loader />
      </div>
    );
  }

  return (
    <main className=" bg-[#F7F7F7] sticky flex h-full  flex-col overflow-auto rounded-xl border px-4 py-6">
      {/* <div className="heading">Hello MAIN</div>
      <Link href="#" onClick={sendEmail} className="link">
        {emailSent ? "Email Sent!" : "Send Email"}
      </Link> */}
      <form onSubmit={handleSubmit} className=" bg-[#F7F7F7]">
        <div className="-mx-2 flex flex-1 flex-col px-2 w-full">
          <h3 className="text-black text-2xl font-semibold">Send Email</h3>
          <p className="text-black mt-2 text-sm">
            Add subject and body for the email you want to send
          </p>
        </div>
        <hr />

        <div className="mt-5 mb-5 flex flex-col gap-3 ">
          <label className="text-sm font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            value={inputs.subject || ""}
            onChange={handleChange}
            className="  w-1/2 h-10 shadow-sm border border-gray-100 rounded-md"
          />
        </div>
        <div className="mt-5 mb-20 flex flex-col gap-3 ">
          <label className="text-sm font-semibold">Email message</label>
          <textarea
            name="email_body"
            value={inputs.email_body}
            onChange={handleChange}
            className="  w-full h-30 shadow-sm border border-gray-100 rounded-md"
            rows={5}
            cols={50}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Button
            className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-white hover:bg-rose-500/90 h-11 px-8 rounded-md bg-rose-500 flex-1"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          {loading2 ? (
            <Button
              disabled
              className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-white hover:bg-rose-500/90 h-11 px-8 rounded-md bg-rose-500 flex-1"
            >
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              className="inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background text-white hover:bg-rose-500/90 h-11 px-8 rounded-md bg-rose-500 flex-1"
              type="button"
              onClick={handleSubmit}
            >
              Send Email
            </Button>
          )}
        </div>
      </form>
      <div className="mt-5">
        <p className="text-muted-foreground text-sm text-black">
          Step <span>4 of 4</span>
        </p>
        <div className="relative h-1  rounded-full mb-2">
          <div className="absolute left-0 top-0 h-full bg-rose-500 w-full"></div>
        </div>
      </div>
    </main>
  );
};

export default EmailForm;
