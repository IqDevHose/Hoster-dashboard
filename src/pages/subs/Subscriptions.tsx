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
import { LucidePen, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Category = {
  id: string;
  name: string;
};

// Define the Product type
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
};

// Main component for ProductsPage
export default function Subscriptions() {
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Plans | null>(null);

  // Query to fetch products
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
      header: "Plans Name",
      cell: ({ row }) => {
        // Ensure `name` and `name.en` exist before attempting to access `en`
        const planName = row.original.name?.en || "Unnamed Plan"; // Fallback text in case `en` is undefined

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
      header: "Category",
      cell: ({ row }) => {
        // Check for `description` and `description.en`
        const categoryDescription =
          row.original.description?.en || "No description";

        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">{categoryDescription}</div>
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

        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 justify-center items-center">
            <Link state={{}} to={`/edit-subscription/${row.original.id}`} className="hover:bg-slate-300 rounded-md transition ease-in-out p-2" >
                <LucidePen size={17} className="text-gray-600"/>
            </Link>
            </div>
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
        Error loading products
      </div>
    );

  // Search functionality
  const filteredData = plans?.filter((product: Plans) =>
    product?.name?.en?.includes(userSearch)
  );

  const handleDelete = async (id: string) => {
    try {
      // Optionally fetch the product to confirm it exists
      const response = await axiosInstance.get(`/product/${id}`);
      if (!response.data) {
        console.error("Product not found:", id);
        return;
      }

      // Delete the product
      await axiosInstance.delete(`/product/${id}`);

      // Optionally update the local state to reflect the deletion
      setModalOpen(false); // Close modal after deletion
      setSelectedProduct(null); // Clear selected product

      // Invalidate and refetch the products
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Refetch products to update the list
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden p-10 gap-5 w-full">
      <PageTitle title="Subscriptions" />
      <Options
        haveSearch={true}
        searchValue={userSearch}
        setSearchValue={setUserSearch}
        buttons={[
          <Link to={"/new-subscription"} key="add-product">
            <Button variant={"default"} className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Subscription</span>
            </Button>
          </Link>,
        ]}
      />

      <DataTable
        editLink="/edit-product"
        columns={columns} // Pass columns directly
        data={filteredData}
        handleDelete={function (id: string): void {
          throw new Error("Function not implemented.");
        }}
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
        message={`Are you sure you want to delete the product "${selectedProduct?.name.en}"?`}
      />
    </div>
  );
}
