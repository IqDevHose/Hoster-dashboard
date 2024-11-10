import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Tape from "../components/Tape";
const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filter, setFilter] = useState("");

  // Simulate data fetching, replace this with an actual API call to get subscription data
  useEffect(() => {
    setSubscriptions([
      {
        id: 1,
        name: "Basic Plan",
        price: "$10/month",
        status: "Active",
        renewalDate: "2024-12-01",
      },
      {
        id: 2,
        name: "Pro Plan",
        price: "$25/month",
        status: "Expired",
        renewalDate: "2023-11-01",
      },
      {
        id: 3,
        name: "Premium Plan",
        price: "$50/month",
        status: "Active",
        renewalDate: "2024-01-01",
      },
    ]);
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleAdd = () => {
    console.log("Add button clicked");
  };

  return (
    <div className="container mx-auto p-6">
      <Tape
        title="Subscriptions"
        filterOptions={["Ecommerce Website", "Domain Registration"]}
        filterValue={filter}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
      />
      <Button />
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                ID
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Plan Name
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Price
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Renewal Date
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.length > 0 ? (
              subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {subscription.id}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {subscription.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {subscription.price}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {subscription.status}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {subscription.renewalDate}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <button className="text-blue-600 hover:underline">
                      View
                    </button>
                    <button className="ml-4 text-red-600 hover:underline">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-3 px-4 text-center text-sm text-gray-500"
                >
                  No subscriptions available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscriptions;
