import { useEffect, useState } from "react";
import { DataTable } from "@/components/DataTable";
import Options from "@/components/Options";
import PageTitle from "@/components/PageTitle";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/AxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PencilIcon, PlusIcon, TrashIcon, UserIcon } from "lucide-react";
import Loading from "@/components/Loading";

type User = {
  avatar: null;
  birthDay: string;
  email: string;
  gender: "male";
  id: number;
  name: string;
  phone: string;
  type: string;
};

export default function Leads() {
  const navigate = useNavigate();
  const [userSearch, setUserSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Initialize query client
  const queryClient = useQueryClient();

  // Query to fetch users
  const {
    data: records,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["records"],
    queryFn: async () => {
      const res = await axiosInstance.get("/sales");
      return res.data;
    },
  });

  const currentUserId = localStorage.getItem("userId"); // Assume this hook gives us the current user's info

  // Function to handle deletion
  const handleDelete = async (id: number) => {
    // try {
    //   await axiosInstance.delete(`/auth/admins/${id}`);
    //   setModalOpen(false); // Close modal after deletion
    //   setSelectedUser(null); // Clear selected user
    //   queryClient.invalidateQueries({ queryKey: ["users"] }); // Refetch users to update the list
    // } catch (err) {
    //   console.error("Failed to delete user:", err);
    // }
  };

  // Loading state
  if (isLoading) return <Loading />;

  if (error)
    return (
      <div className="flex justify-center items-center h-full self-center mx-auto">
        Error loading users
      </div>
    );

  // Filter users based on search input
  const filteredData = records?.data?.filter(
    (record: any) =>
      record?.applicantName?.toLowerCase().includes(userSearch.toLowerCase()) ||
      record?.domain?.toLowerCase().includes(userSearch.toLowerCase())
  );

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
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id; // Access the user's ID

        return (
          <div className="flex gap-2">
            {/* Link to Edit user */}
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
            {/* add plus icon */}

            <Button variant="default" className="flex items-center gap-1">
              <PlusIcon className="w-4 h-4" />
              <span>Add Sale</span>
            </Button>
          </Link>,
        ]}
      />
      {/* Pass the filtered data to the DataTable */}
      <DataTable
        columns={columns}
        data={records || []}
        editLink={"/edit-sale"} // Provide the base link for editing users
        handleDelete={function (id: string): void {
          throw new Error("Function not implemented.");
        }}
      />

      {/* Confirmation Modal */}
      {/* <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (selectedUser) {
            handleDelete(selectedUser.id); // Call delete function with the selected user ID
          }
        }}
        message={`Are you sure you want to delete user with name "${selectedUser?.name}"?`} // Updated message to use user's name
      /> */}
    </div>
  );
}
