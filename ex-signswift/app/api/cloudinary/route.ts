import { cloudinary, uploadToCloudinary } from "@/cloudinary/config"; // your config path
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // your auth check here if required

  const formData = await req.formData();
  const file = formData.get("file") as File;

  const fileBuffer = await file.arrayBuffer();

  const mimeType = file.type;
  const encoding = "base64";
  const base64Data = Buffer.from(fileBuffer).toString("base64");
  console.log(mimeType, file, base64Data, "dev upload");
  // this will be used to upload the file
  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;
  console.log(fileUri, "fileUri");

  const res = await uploadToCloudinary(fileUri, file.name);
  console.log(res);
  if (res.success && res.result) {
    return NextResponse.json({
      message: "success",
      imgUrl: res.result.secure_url,
    });
  } else return NextResponse.json({ message: "failure" });
}
