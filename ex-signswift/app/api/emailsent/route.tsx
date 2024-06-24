import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logo from "../../emails/ex_logg.png";
import prisma from "@/lib/prisma";

dotenv.config();

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email, subject, email_body, docId } = await req.json();

    console.log(email, subject, email_body);

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email, // Change to your recipient emails
      subject: subject,
      html: `
      <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #e0e0e0;">
      <img src=${logo} alt="" />
      
        <h2>Document Signing Invitation</h2>
        <p>
          Dear 
        </p>
        <p>
          We are pleased to inform you that you have been invited to sign a Document
        </p>
        <p>
          Please click the button below to proceed with accepting and signing the contract
         
        </p>
        <p>${email_body}<p/>
        <a href="https://sign-swift.vercel.app/login" style="display: inline-block; background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept and Sign Contract</a>
        <p>
          If you have any questions or concerns, please feel free to contact us.
        </p>
        <p>
          Best regards,<br>
          ExSquared
        </p>
      </div>
    `, // Using the message from the request body
    };

    await transporter.sendMail(mailOptions);
    const documet = await prisma.document.update({
      where: {
        id: parseInt(docId),
      },
      data: {
        status: "PENDING",
      },
    });

    console.log(documet);
    console.log("Email sent successfully!");

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: "Failed to send email" });
  }
}
