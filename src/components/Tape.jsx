import React from "react";
import { Input } from "@/components/ui/input"; // Adjust the import path as needed
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const Tape = ({ title, filterOptions, filterValue, onFilterChange, onAdd }) => {
  return (
    <div className="flex items-center mb-4 justify-between gap-6">
      <h2 className="text-3xl font-semibold text-gray-700 mb-4 w-full">
        {title}
      </h2>

      <Input type="text" placeholder="Search" className="w-full" />

      <Select value={filterValue} onValueChange={onFilterChange}>
        <SelectTrigger className="w-full bg-gray-100">
          <SelectValue placeholder="Filter by Service" />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="" onClick={onAdd} className="ml-auto">
        + Add
      </Button>
    </div>
  );
};

export default Tape;
