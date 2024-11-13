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
import { PencilIcon, PlusIcon, Power } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Define the Plans type with advantages
type Products = {
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
export default function Products() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  // Query to fetch plans
  const queryClient = useQueryClient();
  const {
    data: plans,
    isPending,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosInstance.get("/plans-dashboard");
      return res.data;
    },
    refetchOnWindowFocus: true, // Automatically refetch on window focus
  });

  // Define the columns for the DataTable
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => {
        const planName = row.original?.title?.en || "Unnamed Product"; // Fallback text

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

        const isActive = row.original.isActive;

        return (
          <div className="flex gap-2">
            {/* Link to Edit plan */}
            <Link to={`/edit-product/${id}`} state={{ plan: row.original }}>
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
              className={`${
                isActive
                  ? "bg-green-600 hover:bg-green-600/95"
                  : "bg-red-600 hover:bg-red-600/95"
              }  text-white hover:text-white`}
              onClick={() => {
                setSelectedProduct(row.original); // Set selected plan for deletion
                setModalOpen(true); // Open confirmation modal
              }}
            >
              <Power className="h-4 w-4" />
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
        Error loading product
      </div>
    );

  // Search functionality
  const filteredData = plans.data?.filter((product: any) =>
    product?.title?.en?.includes(userSearch)
  );

  const handleDeactivate = async (id: string) => {
    try {
      // Optionally fetch the plan to confirm it exists
      const response = await axiosInstance.get(`/plans-dashboard/${id}`);
      if (!response.data) {
        console.error("Product not found:", id);
        return;
      }

      // Delete the plan
      await axiosInstance.put(`/plans-dashboard/${id}/toggle-active`);

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
      <PageTitle title="Products" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-product"} key="add-product">
            <Button variant={"default"} className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>,
        ]}
      />

      <DataTable
        editLink="/edit-product"
        columns={columns} // Pass columns directly
        data={filteredData}
        handleDelete={handleDeactivate}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        alertTitle="Confirm Deactivation"
        actionBtnText="Deactivate"
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onConfirm={() => {
          if (selectedProduct) {
            handleDeactivate(selectedProduct.id);
          }
        }}
        message={`Are you sure you want to deactivate the product "${selectedProduct?.title.en}"?`}
      />
    </div>
  );
}
