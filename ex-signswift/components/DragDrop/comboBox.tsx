"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import Loader from "../Loader";

//value->only small letter allowed

interface receptient {
  value: string;
  label: string;
  id: number;
}
interface ComboBoxProps {
  value: number;
  setValue: (value: number) => void;
  value2: string;
  setValue2: (value: string) => void;
  docId: string;
}

export function ComboBox({
  value,
  setValue,
  value2,
  docId,
  setValue2,
}: ComboBoxProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  console.log(docId);

  const [receptient, setReceptient] = React.useState<receptient[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const getReceptient = async () => {
      console.log("step3 renderer");
      setLoading(true);
      const result = await axios.post(
        "https://sign-swift.vercel.app/api/document/getreceptient",
        { docId }
      );
      const receptientres = result?.data;
      console.log(result);
      const receptientLabel = receptientres?.result?.map((item: any) => {
        //save email in small letter in db
        return { label: item.name, value: item.email, id: item.id };
      });
      console.log(receptientLabel);
      setReceptient(receptient ? receptientLabel : null);
      setValue2(receptientLabel[0]?.value);
      setValue(receptientLabel[0]?.id);
      setLoading(false);
    };
    getReceptient();
  }, [docId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <Loader />
      </div>
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between p-4 h-10"
        >
          {value2
            ? receptient?.find((item: any) => item.value === value2)?.label
            : receptient[0]?.value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full  p-1 h-full" align="start">
        <Command label="Command Menu">
          <CommandEmpty>No Signer Found</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {receptient?.map((item: any) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    // console.log(currentValue, value);
                    setValue2(currentValue);
                    setValue(item.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value2 === item.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboBox;
