// // function to create user in our database

// // We impot our prisma client
// import prisma from "../../../../lib/prisma";
// // Prisma will help handle and catch errors

// import { NextRequest, NextResponse } from "next/server";
// import fetch from "node-fetch";
// import { PDFDocument } from "pdf-lib";

// import {
//   createPresignedUrlToDownload,
//   createPresignedUrlToUpload,
// } from "@/app/utils/s3-file-management";
// import { nanoid } from "nanoid";
// import { PresignedUrlProp } from "@/app/utils/types";
// import { uploadToS3 } from "@/app/utils/fileUploadHelpers";

// const dotenv = require("dotenv");
// const nodemailer = require("nodemailer");
// dotenv.config();
// let transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_MAIL, // generated ethereal user
//     pass: process.env.SMTP_PASSWORD, // generated ethereal password
//   },
// });

// //update title of document

// interface IField {
//   id: number;
//   secondaryId: string;
//   left: string;
//   top: string;
//   width: string;
//   height: string;
//   page: number;
//   text: string;
//   icon: string;
//   recipientId: number;
//   signature: string;
// }

// export const maxDuration = 50;
// export async function POST(req: NextRequest, res: NextResponse) {
//   var oldurl = "";
//   var pdfbytes4;
//   const { docId, copiedItems, isLast, recipientEmail } = await req.json();
//   console.log(recipientEmail);
//   const document = await prisma.document.findUnique({
//     where: {
//       id: parseInt(docId),
//     },
//     include: {
//       Field: {
//         include: {
//           Signature: true,
//         },
//       },
//     },
//   });

//   let userId = document?.userId;
//   console.log("user id is", document?.userId);
//   const user2 = await prisma.user.findUnique({
//     where: {
//       customerId: userId,
//     },
//   });
//   console.log("user id", user2);
//   console.log("email is", user2?.email);

//   //role recpient->creater ,reader,signer
//   //mail will be sent to  all
//   // and in case signer when its his step to sign doc

//   console.log("check2");
//   if (isLast) {
//     const signFields = copiedItems?.map((item: any) => ({
//       fieldId: item.id,
//       signatureImageAsBase64: item.signature,
//       recipientId: item.recipientId,
//     }));
//     const signature = await prisma.signature.createMany({
//       data: signFields,
//     });
//     const document2 = await prisma.document.findUnique({
//       where: {
//         id: parseInt(docId),
//       },
//       include: {
//         Field: {
//           include: {
//             Signature: true,
//           },
//         },
//       },
//     });

//     const pdfUrl = document2?.ShareLink || "";
//     const addedFields = document2?.Field;
//     console.log("added field in last is", addedFields);
//     console.log(pdfUrl);
//     const response = await fetch(pdfUrl);
//     if (!response.ok) {
//       throw new Error("Failed to fetch PDF file");
//     }
//     // console.log(response);
//     const pdfBytes = await response.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(pdfBytes);

//     addedFields?.map(async (item: any) => {
//       if (item?.Signature) {
//         const pngImage = await pdfDoc.embedPng(
//           item?.Signature?.signatureImageAsBase64
//         );
//         const page = pdfDoc.getPage(item?.page - 1);
//         const height = page?.getHeight();

//         page.drawImage(pngImage, {
//           x: parseInt(item?.left),
//           y: Math.abs(height - parseInt(item?.top) - parseInt(item?.height)),
//           width: parseInt(item?.width),
//           height: parseInt(item?.height),
//         });
//       }
//     });
//     const pdfBytes2 = await pdfDoc.save();
//     if (pdfBytes2) {
//       pdfbytes4 = pdfBytes2;
//       oldurl = pdfUrl;
//     }

//     console.log(pdfbytes4, oldurl);
//     const bucketName = "ipvms-dev";
//     const fileName = `${nanoid(5)}_completed_pdf.pdf`;
//     const expiry = 60 * 60 * 24 * 7; // 1 year
//     const url = await createPresignedUrlToUpload({
//       bucketName,
//       fileName,
//       expiry,
//     });
//     console.log(url, "presigned url created");
//     const blob = new Blob([pdfBytes2], { type: "application/pdf" });
//     const file = new File([blob], fileName, {
//       type: "application/pdf",
//       lastModified: Date.now(),
//     });
//     console.log(file, "file created");
//     const presignedurl: PresignedUrlProp = {
//       originalFileName: "name.pdf",
//       fileSize: 1212,
//       url: url,
//       fileNameInBucket: fileName,
//     };

//     const uploadtos3 = (await uploadToS3(presignedurl, file)).json();
//     console.log(uploadtos3, "upload to S3 put");
//     const presignedUrltodownload = await createPresignedUrlToDownload({
//       bucketName:
//         process.env.S3_BUCKET_NAME !== undefined
//           ? process.env.S3_BUCKET_NAME
//           : "ipvms-dev",
//       fileName: fileName,
//     });

//     // const pdfFilePath =
//     //   "C:/Users/dgupta/Desktop/hrtech/EXSignSwift/ex-signswift/components/PdfSign/sow2.pdf";
//     // fs.writeFileSync(pdfFilePath, pdfBytes2);
//     // console.log(pdfFilePath, "dnddnd");
//     // fs.writeFileSync(
//     //   "C:/Users/dgupta/Desktop/hrtech/EXSignSwift/ex-signswift/components/PdfSign/sow2.pdf",
//     //   pdfBytes2
//     // );
//     // const res = await edgestore.publicFiles.upload({
//     //   file: new File([pdfBytes2], "completed_pdf", { type: "application/pdf" }),
//     //   options: {
//     //     replaceTargetUrl: pdfUrl,
//     //   },
//     // });
//     // -----------------------important uncomment
//     const updatedDocument = await prisma.document.update({
//       where: {
//         id: parseInt(docId || "0"),
//       },
//       data: {
//         signnumber: {
//           increment: 1,
//         },
//         status: "COMPLETED",
//         ShareLink: presignedUrltodownload,
//       },
//     });

//     var mailOptions = {
//       from: process.env.SMTP_MAIL,
//       to: [user2?.email, "guptadev265@gmail.com", "guptadev545@gmail.com"],
//       subject: "check_multiple in main",
//       // react: <Welcome />
//       // html: emailHtml,
//       html: `<h3>Your document is signed by all recipients</h3> <a href=${presignedUrltodownload}> Download The Signed Document</a>`,
//       // attachments: [
//       //   {
//       //     filename: document?.title,
//       //     content: pdfBytes,
//       //     contentType: "application/pdf",
//       //   },
//       // ],
//     };
//     await transporter.sendMail(mailOptions, function (error: any, info: any) {
//       if (error) {
//         // console.log(check3)
//         console.log(error);
//       } else {
//         console.log("Email sent successfully!");
//         return NextResponse.json({
//           message: "data",
//         });
//       }
//     });
//   } else {
//     const signFields = copiedItems?.map((item: any) => ({
//       fieldId: item.id,
//       signatureImageAsBase64: item.signature,
//       recipientId: item.recipientId,
//     }));

//     const signature = await prisma.signature.createMany({
//       data: signFields,
//     });
//     var mailOptions2 = {
//       from: process.env.SMTP_MAIL,
//       to: [user2?.email || "guptadev265@gmail.com"],
//       subject: "user signed alert",
//       // react: <Welcome />
//       // html: emailHtml,
//       html: `<h3>Your document is signed by ${recipientEmail}</h3>`,
//     };
//     const updatedDocument = await prisma.document.update({
//       where: {
//         id: parseInt(docId || "0"),
//       },
//       data: {
//         signnumber: {
//           increment: 1,
//         },
//       },
//     });

//     await transporter.sendMail(mailOptions2, function (error: any, info: any) {
//       if (error) {
//         // console.log(check3)
//         console.log(error);
//       } else {
//         console.log("Email sent successfully!");
//         return NextResponse.json({ message: "data" });
//       }
//     });
//   }

//   try {
//     return NextResponse.json({
//       message: "success",
//       status: 200,
//     });
//   } catch (error) {
//     return NextResponse.json({
//       message: "Imnernal Server Error",
//       status: 500,
//       error: error,
//     });
//   }
// }

import prisma from "../../../../lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { PDFDocument } from "pdf-lib";
import emailjs from "emailjs-com";

import {
  createPresignedUrlToDownload,
  createPresignedUrlToUpload,
} from "@/app/utils/s3-file-management";
import { nanoid } from "nanoid";
import { PresignedUrlProp } from "@/app/utils/types";
import { uploadToS3 } from "@/app/utils/fileUploadHelpers";
import { uploadToCloudinary } from "@/cloudinary/config";
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();
let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587, // Use 587 or 25
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL, // generated ethereal user
    pass: process.env.SMTP_PASSWORD, // generated ethereal password
  },
});

interface IField {
  id: number;
  secondaryId: string;
  left: string;
  top: string;
  width: string;
  height: string;
  page: number;
  text: string;
  icon: string;
  recipientId: number;
  signature: string;
}

export const maxDuration = 50;

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    var oldurl = "";
    var pdfbytes4;
    const { docId, copiedItems, isLast, recipientEmail, recipientid } =
      await req.json();
    console.log(recipientEmail);

    const document = await prisma.document.findUnique({
      where: { id: parseInt(docId) },
      include: {
        Field: { include: { Signature: true } },
        Recipient: { include: {} },
      },
    });
    console.log(document?.Recipient, "hello recipeints");
    const resdxxx = await prisma.recipient.update({
      where: { id: parseInt(recipientid) },
      data: {
        signingStatus: "SIGNED",
      },
    });
    console.log(resdxxx);
    if (!document) throw new Error("Document not found");

    let userId = document.userId;
    console.log("user id is", userId);

    const user2 = await prisma.user.findUnique({
      where: { customerId: userId },
    });
    if (!user2) throw new Error("User not found");
    console.log("user id", user2);
    console.log("email is", user2.email);

    if (isLast) {
      const signFields = copiedItems.map((item: any) => ({
        fieldId: item.id,
        signatureImageAsBase64: item.signature,
        recipientId: item.recipientId,
      }));

      await prisma.signature.createMany({ data: signFields });
      const document2 = await prisma.document.findUnique({
        where: { id: parseInt(docId) },
        include: {
          Field: {
            include: {
              Signature: true,
            },
          },
        },
      });
      console.log(document2);

      if (!document2) throw new Error("Document not found on final update");

      const pdfUrl = document2.ShareLink || "";
      const addedFields = document2.Field;

      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF file");

      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      addedFields?.map(async (item: any) => {
        if (item?.Signature) {
          const pngImage = await pdfDoc.embedPng(
            item?.Signature?.signatureImageAsBase64
          );
          const page = pdfDoc.getPage(item?.page - 1);
          const height = page?.getHeight();

          page.drawImage(pngImage, {
            x: parseInt(item?.left),
            y: Math.abs(height - parseInt(item?.top) - parseInt(item?.height)),
            width: parseInt(item?.width),
            height: parseInt(item?.height),
          });
        }
      });

      const pdfBytes2 = await pdfDoc.save();
      if (pdfBytes2) {
        pdfbytes4 = pdfBytes2;
        oldurl = pdfUrl;
      }

      console.log(pdfbytes4, oldurl);

      const bucketName = "ipvms-dev";
      const fileName = `${nanoid(5)}_completed_pdf.pdf`;
      const expiry = 60 * 60 * 24 * 7; // 1 week

      // const url = await createPresignedUrlToUpload({
      //   bucketName,
      //   fileName,
      //   expiry,
      // });
      // console.log(url, "presigned url created");

      const blob = new Blob([pdfBytes2], { type: "application/pdf" });
      const file = new File([blob], fileName, {
        type: "application/pdf",
        lastModified: Date.now(),
      });
      console.log(file, "file created");

      // cludinary version
      const fileBuffer = await file.arrayBuffer();

      const mimeType = file.type;
      const encoding = "base64";
      const base64Data = Buffer.from(fileBuffer).toString("base64");
      console.log(mimeType, file, base64Data, "dev upload");
      // this will be used to upload the file
      const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
      console.log(fileUri, "fileUri");

      const res = await uploadToCloudinary(fileUri, file.name);
      let presignedUrltodownload = "";
      if (res.success && res.result) {
        console.log(res.result.secure_url);
        presignedUrltodownload = res.result.secure_url;
      }

      /// minio version

      // const presignedurl: PresignedUrlProp = {
      //   originalFileName: "name.pdf",
      //   fileSize: 1212,
      //   url: url,
      //   fileNameInBucket: fileName,
      // };

      // const uploadtos3 = await uploadToS3(presignedurl, file);
      // const presignedUrltodownload = await createPresignedUrlToDownload({
      //   bucketName: process.env.S3_BUCKET_NAME || "ipvms-dev",
      //   fileName: fileName,
      // });
      // console.log(presignedUrltodownload);

      const resd = await prisma.document.update({
        where: { id: parseInt(docId || "0") },
        data: {
          signnumber: { increment: 1 },
          status: "COMPLETED",
          ShareLink: presignedUrltodownload,
        },
      });
      console.log(resd);
      const emaillist = [];
      document?.Recipient.map((user) => {
        emaillist.push(user.email);
      });
      emaillist.push(recipientEmail);
      emaillist.push(user2.email);

      try {
        // const info = await transporter.sendMail(mailOptions);
        // if (info) {xxxx
        const webhookUrl = `http://ipvms-api.exitest.com/webhook/updateLetterStatus/${docId}`; // Replace with your actual webhook URL

        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        // }
        // console.log("Email sent successfully:", info);
      } catch (error) {
        console.error("Error sending email:", error);
      }
      return Response.json({
        status: 200,
        emaillist: emaillist,
        presignedUrltodownload: presignedUrltodownload,
      });

      // const mailOptions = {
      //   from: process.env.SMTP_MAIL,
      //   to: emaillist,
      //   subject: "check_multiple in main",
      //   html: `<h3>Your document is signed by all recipients</h3> <a href=${presignedUrltodownload}>Link to Completed Document</a>`,
      // };
      // console.log("mail options", mailOptions);
    } else {
      const signFields = copiedItems.map((item: any) => ({
        fieldId: item.id,
        signatureImageAsBase64: item.signature,
        recipientId: item.recipientId,
      }));

      await prisma.signature.createMany({ data: signFields });

      const mailOptions2 = {
        from: process.env.SMTP_MAIL,
        to: [user2.email || "guptadev265@gmail.com"],
        subject: "user signed alert",
        html: `<h3>Your document is signed by ${recipientEmail}</h3>`,
      };

      await prisma.document.update({
        where: { id: parseInt(docId || "0") },
        data: { signnumber: { increment: 1 } },
      });

      // await transporter.sendMail(mailOptions2, (error: any, info: any) => {
      //   if (error) {
      //     console.error("Error sending email:", error);
      //   } else {
      //     console.log("Email sent successfully!");
      //   }
      // });

      return Response.json({
        status: 200,
        recipientemail: recipientEmail,
        reply_to: user2?.email || "guptadev265@gmail.com",
        signedbyone: true,
      });
    }
    console.log("hello");
    return NextResponse.json({ message: "hello" });
  } catch (error: any) {
    console.error("Error processing request:", error);
  }
}
