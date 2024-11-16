import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import ConfirmationModal from "@/components/ConfirmationModal";
import Loading from "@/components/Loading";
import { PencilIcon, PlusIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function Subscriptions() {
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // Filter by status
  const [monthFilter, setMonthFilter] = useState<string>("all"); // Filter by month
  const [yearFilter, setYearFilter] = useState<string>("all"); // Filter by year
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const queryClient = useQueryClient();
  const { data: subscriptions, isLoading, isError, error } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const res = await axiosInstance.get("/subscriptions");
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "clientName",
      header: "Client",
    },
    {
      accessorKey: "domainName",
      header: "Domain",
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
    },
    {
      accessorKey: "submissionDate",
      header: "Submission Date",
    },
    {
      accessorKey: "expiryDate",
      header: "Expiry Date",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex gap-2">
            <Link to={`/edit-subscription/${id}`} state={{ plan: row.original }}>
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

  // Loading state
  if (isLoading) return <Loading />;

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-full mx-auto text-red-500">
        Error loading subscriptions:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  // Get unique years from data
  const years = Array.from(
    new Set(subscriptions.map((sub: any) => new Date(sub.expiryDate).getFullYear()))
  ).sort((a, b) => a - b);

  // Filter data
  const filteredData = subscriptions.filter((subscription: any) => {
    const matchesSearch = subscription.clientName
      .toLowerCase()
      .includes(userSearch.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || subscription.status === statusFilter;

    const expiryDate = new Date(subscription.expiryDate);
    const matchesMonth =
      monthFilter === "all" || expiryDate.getMonth() === parseInt(monthFilter);
    const matchesYear =
      yearFilter === "all" || expiryDate.getFullYear() === parseInt(yearFilter);

    return matchesSearch && matchesStatus && matchesMonth && matchesYear;
  });

  // Handle delete action
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/subscriptions/${id}`);
      setModalOpen(false);
      setSelectedProduct(null);
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (err) {
      console.error("Failed to delete subscription:", err);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden p-4 sm:p-6 lg:p-10 gap-5 w-full">
      <PageTitle title="Subscriptions" />

      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to="/new-subscription" key="add-subscription">
            <Button variant="default" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Subscription</span>
            </Button>
          </Link>,
        ]}
      />

      <div className="flex gap-3 items-center mb-4">
        {/* Filter by Status */}
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by Month */}
        <Select
          value={monthFilter}
          onValueChange={(value) => setMonthFilter(value)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Month</SelectItem>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i} value={String(i)}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter by Year */}
        <Select
          value={yearFilter}
          onValueChange={(value) => setYearFilter(value)}
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Year</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        editLink="/edit-subscription"
        columns={columns}
        data={filteredData}
        handleDelete={(id: string) => {
          setSelectedProduct(id);
          setModalOpen(true);
        }}
      />

      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedProduct) handleDelete(selectedProduct.id);
        }}
        message={`Are you sure you want to delete the subscription "${selectedProduct?.name?.en}"?`}
      />
    </div>
  );
}
