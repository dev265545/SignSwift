"use client";

import * as React from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { useRouter } from "next/navigation";
import H4 from "@/components/Typography/H4";
import Loader from "@/components/Loader";
import {
  ALL_DOCS,
  COMPLETED_DOCS,
  DRAFT_DOCS,
  INBOX_DOCS,
  PENDING_DOCS,
} from "@/app/(dashboard)/user/[id]/signdoc/docstatus";

export type Payment = {
  id: string;
  ShareLink: string;
  status: "pending" | "processing" | "success" | "failed";
  title: string;
};

export function DocumentTable({
  id,
  email,
  status,
}: {
  id: string;
  email: string;
  status: string;
}) {
  // const [sorting, setSorting] = React.useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
  //   []
  // )
  // const [columnVisibility, setColumnVisibility] =
  //   React.useState<VisibilityState>({});
  // const [rowSelection, setRowSelection] = React.useState({});
  React.useEffect(() => {
    console.log(email, "email in user table");
  });
  const [signedData, setSignedData] = React.useState([]);
  const [recpientData, setRecipientData] = React.useState([]);
  const [data, setData] = React.useState<any[]>([]);
  const [filteredData, setFilteredData] = React.useState<any[]>([]);
  console.log(id);
  const actionStatus = (status: any) => {
    if (status === "DRAFT") {
      return (
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-ml-1 mr-2 h-4 w-4"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"></path>
          </svg>
          Edit
        </div>
      );
    } else if (status === "SIGN") {
      return (
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="-ml-1 mr-2 h-4 w-4"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
            <path d="m15 5 4 4"></path>
          </svg>
          Sign
        </div>
      );
    } else if (status === "PENDING") {
      return "Pending";
    } else if (status === "COMPLETED") {
      return (
        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="-ml-1 mr-2 inline h-4 w-4"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" x2="12" y1="15" y2="3"></line>
          </svg>
          Download
        </div>
      );
    }
  };
  const actionStatusUrl = (link: any) => {
    if (link.status === "DRAFT") {
      return `https://ex-sign-swift.vercel.app/user/${id}/document/${link.id}/step1`;
    } else if (link.status === "SIGN") {
      return `https://ex-sign-swift.vercel.app/user/${id}/signdoc/${link.id}`;
    } else if (link.status === "PENDING") {
      return "";
    } else if (link.status === "COMPLETED") {
      return link.ShareLink;
    }
  };
  const [loading, setLoading] = React.useState(false);
  const statusMap = (status: string) => {
    if (status === INBOX_DOCS) {
      return "SIGN";
    } else if (status == PENDING_DOCS) {
      return "PENDING";
    } else if (status == DRAFT_DOCS) {
      return "DRAFT";
    } else if (status == COMPLETED_DOCS) {
      return "COMPLETED";
    }
  };
  React.useEffect(() => {
    console.log(status);
    console.log(statusMap(status));

    setFilteredData(
      status == ALL_DOCS
        ? data
        : data.filter((item: any) => {
            return item.status == statusMap(status);
          })
    );
  }, [status]);
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id && email) {
        await axios
          .post(
            "https://ex-sign-swift.vercel.app/api/document/getDocumentForUser",
            { userId: id, email: email }
            //pending
            //why parse user id
          )
          .then((response) => {
            const document = response.data?.Document;
            setData(document);
            setFilteredData(document);

            // setRecipientData(response && response?.data?.Document[0]?.Recipient);
          });
        setLoading(false);
      }
    };
    fetchData();
  }, [id, email]);

  const router = useRouter();
  console.log(signedData, "signed", "dev", data);
  const getRandomColor = () => {
    const colors = [
      "#2ECC71", // Emerald Green
      "#3498DB", // Dodger Blue
      "#E74C3C", // Alizarin Crimson
      "#8E44AD", // Studio Purple
      "#1ABC9C", // Ocean Green
      "#F39C12", // Tangerine
      "#27AE60", // Nephritis
      "#2980B9", // Belize Hole
      "#E67E22", // Carrot Orange
      "#9B59B6", // Amethyst Purple
      "#16A085", // Dark Cyan
      "#C0392B", // Red Orange
      "#34495E", // Wet Asphalt
      "#F1C40F", // Sunflower Yellow
      "#7F8C8D", // Concrete Grey
      "#2C3E50", // Midnight Blue
      "#95A5A6", // Concrete Grey Light
      "#D35400", // Pumpkin
      "#1F618D", // Dark Cerulean
      "#D35400", // Pumpkin
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <Loader />
      </div>
    );
  }
  return (
    <div className="w-full sm:p-4">
      <div className="rounded-md sm:border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">Created at</TableHead>
              <TableHead className="font-medium">Title</TableHead>
              <TableHead className="font-medium">View</TableHead>
              <TableHead className="font-medium">Recipient</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData
              ? filteredData.map((link) => (
                  <TableRow key={link?.id}>
                    <TableCell>
                      {new Date(link?.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{link?.title || "NULL"}</TableCell>
                    <TableCell>
                      <Button className="bg-rose-400  w-24 hover:bg-rose-500 text-white font-medium ">
                        <Link href={link.ShareLink || ""}>
                          <H4>View</H4>
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="flex flex-row">
                      <div className="flex -space-x-2 items-center justify-center">
                        {link?.Recipient?.map(
                          (recpientData: any, index: number) => (
                            <div className="relative">
                              <div
                                style={{ backgroundColor: getRandomColor() }}
                                title={recpientData.email}
                                className="inline-block  size-[32px] rounded-full ring-2 ring-white dark:ring-neutral-900"
                              >
                                <div className="flex items-center justify-center text-white text-xl font-medium m-1">
                                  {recpientData.name.charAt(0).toUpperCase()}
                                </div>

                                <style jsx>{`
                                  /* Additional styles for the tooltip */
                                  .tooltip {
                                    position: absolute;
                                    bottom: calc(
                                      100% + 5px
                                    ); /* Adjust as needed */
                                    left: 50%;
                                    transform: translateX(-50%);
                                    padding: 5px;
                                    background-color: rgba(0, 0, 0, 0.8);
                                    color: #fff;
                                    font-size: 12px;
                                    border-radius: 3px;
                                    white-space: nowrap;
                                    opacity: 0;
                                    pointer-events: none;
                                    transition: opacity 0.3s ease;
                                  }

                                  .rounded-full:hover .tooltip {
                                    opacity: 1;
                                    pointer-events: auto;
                                  }
                                `}</style>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{link.status}</TableCell>
                    <TableCell>
                      <Button
                        className="bg-rose-400  w-28 p-2 hover:bg-rose-500 text-white font-medium "
                        onClick={() => {
                          router.push(actionStatusUrl(link));
                        }}
                      >
                        {/* Sign or view*/}
                        <H4>{actionStatus(link?.status)}</H4>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
