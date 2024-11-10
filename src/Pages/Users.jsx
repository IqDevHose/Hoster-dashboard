import React, { useEffect, useState } from "react";
import Tape from "../components/Tape";

const CRMTable = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setLeads([
      {
        id: 1,
        leadName: "Ibrahim Muhsin",
        company: "Alseef",
        phoneNumber: "+971505553399",
        serviceRequired: "Ecommerce Website",
        date: "November 7, 2024",
        user: "Kadhim Maan, Ibrahim Almoushin",
      },
      {
        id: 2,
        leadName: "Hussain Jawad",
        company: "Madina",
        phoneNumber: "+971505555550",
        serviceRequired: "Domain Registration",
        date: "November 7, 2024",
        user: "Kadhim Maan, Ibrahim Almoushin",
      },
      {
        id: 3,
        leadName: "Ahmad Ali",
        company: "Forat Company",
        phoneNumber: "00971505359157",
        serviceRequired: "Domain Registration",
        date: "November 7, 2024",
        user: "Kadhim Maan, Ibrahim Almoushin",
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
        title="Sales CRM"
        filterOptions={["Ecommerce Website", "Domain Registration"]}
        filterValue={filter}
        onFilterChange={handleFilterChange}
        onAdd={handleAdd}
      />
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Lead Name
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Company
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Phone Number
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Service Required
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? (
              leads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {lead.leadName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {lead.company}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {lead.phoneNumber}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {lead.serviceRequired}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {lead.date}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {lead.user}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-3 px-4 text-center text-sm text-gray-500"
                >
                  No leads available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CRMTable;
