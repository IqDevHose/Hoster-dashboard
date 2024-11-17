import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from "@/components/Loading";
import { PencilIcon } from "lucide-react";

export default function Leads() {
  const [userSearch, setUserSearch] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Query to fetch users
  const { data: records, isLoading, error } = useQuery({
    queryKey: ["records"],
    queryFn: async () => {
      const res = await axiosInstance.get("/sales");
      console.log(res.data)
      return res.data;
    },
  });

  // Loading state
  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="flex justify-center items-center h-full self-center mx-auto">
        Error loading users
      </div>
    );

  // Filter users based on search input and dropdown selections
  const filteredData = records?.filter((record: any) => {
    const matchesService =
      selectedService === "all" || record?.serviceRequired === selectedService;
    const matchesStatus =
      selectedStatus === "all" || record?.leadStatus === selectedStatus;

    return matchesService && matchesStatus;
  });

  // Define the columns for the table
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "leadName",
      header: "Lead Name",
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "serviceRequired",
      header: "Service Required",
    },
    {
      accessorKey: "leadStatus",
      header: "Status",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex gap-2">
            <Link to={`/edit-sale/${id}`} state={{ user: row.original }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
      <PageTitle title="Sales" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to="/new-sale" key="add-user">
            <Button variant="default" className="flex items-center gap-1">
              Add Sale
            </Button>
          </Link>,
        ]}
      />

      <div className="flex gap-4 mb-4">
        {/* Filter by Service Required */}
        <Select
          value={selectedService}
          onValueChange={(value) => setSelectedService(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Service Required</SelectItem>
            <SelectItem value="domain_registration_with_hosting">Domain Registration With Hosting</SelectItem>
            <SelectItem value="domain_registration">Domain Registration</SelectItem>
            <SelectItem value="portfolio_website">Portfolio Website</SelectItem>
            <SelectItem value="ecommerce_website">Ecommerce Website</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by Lead Status */}
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value="cold_lead">Cold Lead</SelectItem>
            <SelectItem value="hot_lead">Host Lead</SelectItem>
            <SelectItem value="unsure">Unsure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Pass the filtered data to the DataTable */}
      <DataTable
        columns={columns}
        data={filteredData || []}
        editLink={"/edit-sale"}
        handleDelete={(id: string) => console.log("Delete", id)}
      />
    </div>
  );
}
