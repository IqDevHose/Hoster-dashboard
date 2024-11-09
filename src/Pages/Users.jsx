import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch data when the component mounts (replace this with your backend API call later)
  useEffect(() => {
    // Example data for now
    setUsers([
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
      { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com" },
    ]);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-700 mb-4">Users</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                ID
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Name
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Email
              </th>
              <th className="py-3 px-4 text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-600">{user.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <button className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="ml-4 text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="py-3 px-4 text-center text-sm text-gray-500"
                >
                  No users available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
