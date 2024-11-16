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
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Define the Plans type
type Plans = {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  price: string;
  description: {
    ar: string;
    en: string;
  };
  status: RecordStatusEnum;
};

// Enum for record status
export enum RecordStatusEnum {
  COLD_LEAD= "cold_lead",
  HOT_LEAD= "hot_lead",
  UNSURE= "unsure",
}

// // Define groups for statuses
const statusGroups = {
  Type: [
    RecordStatusEnum.COLD_LEAD,
    RecordStatusEnum.HOT_LEAD,
    RecordStatusEnum.UNSURE,
  ]
};

export default function Subscriptions() {
  const [userSearch, setUserSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecordStatusEnum | "">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Plans | null>(null);

  const queryClient = useQueryClient();
  const {
    data: subscriptions,
    isLoading,
    isError,
    error,
  } = useQuery({
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
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">{row.original.clientName}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "domainName",
      header: "Domain",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <p>{row.original.domainName}</p>
          </div>
        );
      },
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
        const id = row.original.id; // Access the user's ID
        return (
          <div className="flex gap-2">
            {/* <Link to= className="text-blue-600">
              <PencilIcon className="w-5 h-5" />
            </Link> */}

            <Link to={`/edit-subscription/${id}`} state={{ plan: row.original }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            {/* <button
              onClick={() => {
                setSelectedProduct(row.original);
                setModalOpen(true);
              }}
              className="text-red-600"
            >
              <TrashIcon className="w-5 h-5" />
            </button> */}
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

  // Filter data
  const filteredData = subscriptions.filter((subscription: any) => {
    const matchesSearch = subscription.clientName
      .toLowerCase()
      .includes(userSearch.toLowerCase());
    const matchesStatus = statusFilter ? subscription.status === statusFilter : true;
    return matchesSearch && matchesStatus;
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

      {/* <div className="flex gap-3 items-center mb-4">  
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as RecordStatusEnum | "")
          }
        >
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusGroups).map(([groupLabel, statuses]) => (
              <SelectGroup key={groupLabel || ""}>
                <SelectLabel>{groupLabel}</SelectLabel>
                {statuses.map((status) => (
                  <SelectItem key={status || ""} value={status || "em"}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
            <SelectItem defaultChecked value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

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
        message={`Are you sure you want to delete the subscription "${selectedProduct?.name.en}"?`}
      />
    </div>
  );
}
