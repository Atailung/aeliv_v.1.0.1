"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDown } from "lucide-react";

const options = ["Asc", "Desc"];

function SortingDropDown() {
  const [selectedOption, setSelectedOption] = useState("Asc");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"link"}>
          <span className="font-medium text-sm">{selectedOption}</span>
          {selectedOption === "Asc" ? (
            <ArrowDown className="text-sm size-4" />
          ) : (
            <ArrowDown className="rotate-180 text-sm size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {options.map((option, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={selectedOption === option}
            className="h-9"
            onCheckedChange={() => setSelectedOption(option)}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SortingDropDown;
