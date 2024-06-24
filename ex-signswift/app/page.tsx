import Image from "next/image";
import { getServerSession, Session } from "next-auth";

import { redirect, useRouter } from "next/navigation";

import { config } from "@/lib/auth";

import axios from "axios";
export default async function Home() {
  const session: Session | null = await getServerSession(config);

  console.log("dev", session);
  // const router = useRouter();
  if (!session) {
    redirect("/login");
  } else {
    console.log(session.user);
    const response = await axios.post(
      "https://sign-swift.vercel.app/api/users/registerUser",
      session.user
    );
    console.log(response.data.user.customerId);
    redirect(`/user/${response.data.user.customerId}`);
  }

  return <></>;
}
