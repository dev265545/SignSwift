"use client";
import * as React from "react";
import Cookies from "js-cookie";

import { redirect, useRouter } from "next/navigation";
import H2 from "@/components/Typography/H2";
import H4 from "@/components/Typography/H4";
import logo from "@/public/Profile.png";
import logo1 from "../../../assets/image.png";
import Image from "next/image";
import { IoIosSearch } from "react-icons/io";
import { FaPenNib } from "react-icons/fa";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandGroup,
  CommandDialog,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { debounce } from "@/app/utils/debounce";
import axios from "axios";

const Navbar = (props: any) => {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [searchToggle, setSearchToggle] = React.useState<boolean>(true);
  const actionStatusUrl = (
    status: string,
    shareLink: string,
    userId: string,
    documentId: string
  ) => {
    if (status === "DRAFT") {
      return `https://sign-swift.vercel.app/user/${userId}/document/${documentId}/step1`;
    } else if (status === "SIGN") {
      return `https://sign-swift.vercel.app/user/${userId}/signdoc/${documentId}`;
    } else if (status === "PENDING") {
      return "";
    } else if (status === "COMPLETED") {
      return shareLink;
    }
  };

  React.useEffect(() => {
    const cookieData = Cookies.get("session");
    if (cookieData) {
      const jsonData = JSON.parse(cookieData);
      console.log(jsonData, "jssson data");

      setUser(jsonData.data.user);
    }
  }, []);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        setSearchToggle(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  const changeInput = React.useMemo(
    () =>
      debounce(async (inpstring: string) => {
        try {
          const response = await axios.post(
            "https://sign-swift.vercel.app/api/document/searchDocumentForUser",
            {
              userId: user?.id,
              email: user?.email,
              titlematch: inpstring,
            }
          );
          console.log(response.data?.Document);
          setSuggestions(response.data?.Document || []);
        } catch (error) {
          console.error("Error fetching documents:", error);
        }
      }, 200),
    [user]
  );

  // redirect(`/api/auth/signout`)   wont't work because this is client component it would have worked in server side componenet
  function handleSignOut() {
    console.log("signout click");
    router.push("/api/auth/signout");
    // redirect(`/api/auth/signout`)   wont't work because this is client component it would have worked in server side componenet
  }
  return (
    <nav className=" bg-white shadow-xl  top-0 left-0 w-full ">
      <div className="w-full bg-rose-100 h-10">
        <div className="flex items-center justify-center p-1 text-sm font-medium font-sans "></div>
      </div>
      <div className="px-12 py-3   nav-container-two flex items-center bg-white text-black">
        {/* <div className=" nav-container-three w-full flex flex-row justify-between  "> */}
        <div className="nav-Logo-section  flex items-center w-1/2  gap-5 text-black">
          <Image width={"30"} height={"30"} src={logo1} alt="logo" />
          <H2>
            <div className="text-[#0F172A]">SignSwift</div>
          </H2>
          {/* <H4>Documents</H4> */}
        </div>

        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput
            placeholder="Type a command or search..."
            onChangeCapture={(e) => {
              setSearchToggle(false);
              changeInput(e.currentTarget.value.toString());
            }}
          />

          {searchToggle ? (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Documents">
                <CommandItem
                  onSelect={() => {
                    router.push(`/user/${user.id}` + "?" + "status=ALL", {
                      scroll: false,
                    });
                    setOpen((prev) => !prev);
                  }}
                >
                  All Documents
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push(`/user/${user.id}` + "?" + "status=DRAFT", {
                      scroll: false,
                    });
                    setOpen((prev) => !prev);
                  }}
                >
                  {" "}
                  Draft Documents
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push(`/user/${user.id}` + "?" + "status=COMPLETED", {
                      scroll: false,
                    });
                    setOpen((prev) => !prev);
                  }}
                >
                  Completed Documents
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push(`/user/${user.id}` + "?" + "status=PENDING", {
                      scroll: false,
                    });
                    setOpen((prev) => !prev);
                  }}
                >
                  Pending Documents
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    router.push(`/user/${user.id}` + "?" + "status=INBOX", {
                      scroll: false,
                    });
                    setOpen((prev) => !prev);
                  }}
                >
                  Inbox Documents
                </CommandItem>
              </CommandGroup>
            </CommandList>
          ) : (
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Documents">
                {suggestions?.map((doc) => (
                  <CommandItem
                    key={doc.id}
                    onSelect={() => {
                      router.push(
                        actionStatusUrl(
                          doc.status.toString() || "",
                          doc.ShareLink.toString() || "",
                          doc.userId.toString() || "",
                          doc.id.toString() || ""
                        ) || ""
                      );

                      setOpen((prev) => !prev);
                    }}
                  >
                    {doc.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </CommandDialog>
        <div className="flex w-96 items-center relative">
          <IoIosSearch size={28} className="absolute left-2" />
          <Input
            placeholder="Search"
            className="pl-10"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>

        <div className="nav-profile">
          {/* <Image className="profile-icon-image" src={logo} alt="logo" /> */}
          <a href="/">
            <Image
              className="rounded-full"
              src={props.user.image}
              width={40}
              height={40}
              alt="logo"
            />
          </a>
          {/* <p>Profile Icon</p> */}
          <div className="user-data-logo">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex  gap-5  justify-start items-center flex-col text-sm">
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col items-start justify-start">
                    <p>{props.user.name}</p>
                    <p>Personal Account</p>
                  </div>
                  <div className="flex flex-col justify-center">
                    <p
                      style={{
                        marginBottom: "-8px",
                        width: "20px",
                        color: "#64748B",
                      }}
                    >
                      ^
                    </p>
                    <p
                      className="rotate-180"
                      style={{
                        marginTop: "-8px",
                        width: "20px",
                        color: "#64748B",
                      }}
                    >
                      ^
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSignOut()}>
                  SignOut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div></div>
        </div>
      </div>
      {/* </div> */}
    </nav>
  );
};

export default Navbar;
