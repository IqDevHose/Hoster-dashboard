import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmationModal from "@/components/ConfirmationModal";
import Loading from "@/components/Loading";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Category = {
  id: string;
  name: string;
};

// Define the Plans type with advantages
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
  advantages?: {
    [key: string]: string; // Adjust based on the structure of `advantages`
  };
};

// Main component for PlansPage
export default function Plans() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Plans | null>(null);

  // Query to fetch plans
  const queryClient = useQueryClient();
  const {
    data: plans,
    isPending,
    error,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await axiosInstance.get("/plans");
      console.log("Fetched plans:", res.data); // Log the fetched data
      return res.data;
    },
    refetchOnWindowFocus: true, // Automatically refetch on window focus
  });

  // Define the columns for the DataTable
  const columns: ColumnDef<Plans>[] = [
    {
      accessorKey: "name",
      header: "Plan Name",
      cell: ({ row }) => {
        const planName = row.original.name?.en || "Unnamed Plan"; // Fallback text

        return (
          <div className="flex gap-2 items-center">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{planName.charAt(0)}</AvatarFallback>
            </Avatar>
            <p>{planName}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const categoryDescription =
          row.original.description?.en || "No description";

        return (
          <div className="truncate w-32">
            <span className="block overflow-hidden whitespace-nowrap text-ellipsis">
              {categoryDescription}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id; // Access the plan ID

        return (
          <div className="flex gap-2">
            {/* Link to Edit plan */}
            <Link to={`/edit-plan/${id}`} state={{ plan: row.original }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 hover:text-blue-600"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Link>
            {/* Button to Delete plan */}
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={() => {
                setSelectedProduct(row.original); // Set selected plan for deletion
                setModalOpen(true); // Open confirmation modal
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Loading state
  if (isPending) return <Loading />;

  // Error state
  if (error)
    return (
      <div className="flex justify-center items-center h-full self-center mx-auto">
        Error loading plans
      </div>
    );

  // Search functionality
  const filteredData = plans?.filter((product: Plans) =>
    product?.name?.en?.includes(userSearch)
  );

  const handleDelete = async (id: string) => {
    try {
      // Optionally fetch the plan to confirm it exists
      const response = await axiosInstance.get(`/plans/${id}`);
      if (!response.data) {
        console.error("Plan not found:", id);
        return;
      }

      // Delete the plan
      await axiosInstance.delete(`/plans/${id}`);

      // Optionally update the local state to reflect the deletion
      setModalOpen(false); // Close modal after deletion
      setSelectedProduct(null); // Clear selected plan

      // Invalidate and refetch the plans
      queryClient.invalidateQueries({ queryKey: ["plans"] }); // Refetch plans to update the list
    } catch (err) {
      console.error("Failed to delete plan:", err);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
      <PageTitle title="Plans" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-plan"} key="add-plan">
            <Button variant={"default"} className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Plan</span>
            </Button>
          </Link>,
        ]}
      />

      <DataTable
        editLink="/edit-plan"
        columns={columns} // Pass columns directly
        data={filteredData}
        handleDelete={handleDelete}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => {
          console.log("Closing modal");
          setModalOpen(false);
        }}
        onConfirm={() => {
          if (selectedProduct) {
            console.log("Confirming deletion for:", selectedProduct);
            handleDelete(selectedProduct.id);
          }
        }}
        message={`Are you sure you want to delete the plan "${selectedProduct?.name.en}"?`}
      />
    </div>
  );
}
