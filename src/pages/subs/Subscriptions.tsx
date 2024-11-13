import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
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
  PENDING = "pending",
  AVAILABLE = "available",
  CANCELED = "canceled",
  REJECTED = "rejected",
  PAID = "paid",
  ACTIVE = "active",
  EXPIRED = "expired",
}

// Define groups for statuses
const statusGroups = {
  Active: [
    RecordStatusEnum.AVAILABLE,
    RecordStatusEnum.PAID,
    RecordStatusEnum.ACTIVE,
  ],
  Inactive: [
    RecordStatusEnum.PENDING,
    RecordStatusEnum.CANCELED,
    RecordStatusEnum.REJECTED,
    RecordStatusEnum.EXPIRED,
  ],
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
      const res = await axiosInstance.get("/records-dashboard/subscriptions");
      console.log(res)
      return res.data;
    },
    refetchOnWindowFocus: true,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Domain",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <p>{row.original.domain}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "domainType",
      header: "Domain Type",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">{row.original.domainType}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "plan",
      header: "Plan",
    },
    {
      accessorKey: "startDate",
      header: "startDate",
    },
    {
      accessorKey: "endDate",
      header: "endDate",
    },
    {
      accessorKey: "price",
      header: "price",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id; // Access the user's ID
        const name = row.getValue("name") as string; // Access the user's name
        return (
          <div className="flex gap-2">
            <Link to={`/edit-subscription/${id}`} className="text-blue-600">
              <PencilIcon className="w-5 h-5" />
            </Link>
            <button
              onClick={() => {
                setSelectedProduct(row.original);
                setModalOpen(true);
              }}
              className="text-red-600"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
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
  const filteredData = subscriptions.data?.filter((product: Plans) => {
    const matchesSearch = product.name.en
      .toLowerCase()
      .includes(userSearch.toLowerCase());
    const matchesStatus = statusFilter ? product.status === statusFilter : true;
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

      <div className="flex gap-3 items-center mb-4">  
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
      </div>

   
 {/* 1 */}
      <div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Domian Name</p>
<p className=" text-gray-600">Required</p>
</div>
<input
          type="text"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
           
        />


</div>

{/* 2 */}
<div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Client Name</p>
<p className=" text-gray-600">Required</p>
</div>
<input
          type="text"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
        
        />


</div>


{/* 3 */}
<div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Phone  Number</p>
<p className=" text-gray-600">Required</p>
</div>
<input
          type="text"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
          
        />


</div>



{/* 4 */}
<div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Document  link</p>
 
</div>
<input
          type="text"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
          
        />


</div>



{/* 5 */}
<div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Submission  Date</p>
 
</div>
<input
          type="date"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
          
        />


</div>




{/* 6 */}
<div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Activation  Date</p>

</div>
<input
             type="date"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
          
        />


</div>



{/* 7 */}
<div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Expiry  Date</p>
 
</div>
<input
             type="date"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
          
        />


</div>



{/* 8 */}
<div   className=" ">

<div className=" flex items-center justify-between  ">
<p className=" font-medium">Price  Sold</p>
 
</div>
<input
          type="text"
          // value={searchValue}
          // onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 border w-full mt-2 h-10 focus:border-gray-500 transition ease-in-out border-gray-300 rounded-md outline-none"
          
        />


</div>

{/* 9 */}

<div>

<div className=" flex items-center justify-between  ">
<p className=" font-medium"> Status</p>
<p className=" text-gray-600">Required</p>
</div>



<div className="flex gap-3  items-center my-4">  
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as RecordStatusEnum | "")
          }
        >

          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>  
              <SelectGroup   >
                <SelectLabel></SelectLabel>
                {["Expired/Renewal Required ","Activation In Progrees"].map((status) => (
                  <SelectItem  key={status || ""} value={status || "em"}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
           
            <SelectItem defaultChecked value="all">Active</SelectItem>
          </SelectContent>

        </Select>
      </div>
</div>

 
{/* 10 */}
<div>

<div className=" flex items-center justify-between  ">
<p className=" font-medium"> Payment Method </p>
<p className=" text-gray-600">Required</p>
</div>



<div className="flex gap-3  items-center my-4">  
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as RecordStatusEnum | "")
          }
        >

          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>  
              <SelectGroup   >
                <SelectLabel></SelectLabel>
                {["Zain Cash ","Qi Card", "Baghdad Branch"].map((status) => (
                  <SelectItem  key={status || ""} value={status || "em"}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
           
            <SelectItem defaultChecked value="all">Cash</SelectItem>
          </SelectContent>

        </Select>
      </div>
</div>

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
