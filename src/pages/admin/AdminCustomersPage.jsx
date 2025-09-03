import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSearch, FiTrash2, FiUserX } from "react-icons/fi";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 8;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
       
        const customerUsers = response.data.filter(user => user.type === "customer");
        setCustomers(customerUsers);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching customers");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName} ${customer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCustomers(customers.filter((customer) => customer._id !== customerId));
        toast.success("Customer deleted successfully");
      } catch (error) {
        toast.error("Error deleting customer");
      }
    }
  };

  const toggleBlockStatus = async (customerId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${customerId}/block`,
        { isBlocked: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCustomers(
        customers.map((customer) =>
          customer._id === customerId
            ? { ...customer, isBlocked: !currentStatus }
            : customer
        )
      );
      toast.success(
        `Customer ${!currentStatus ? "blocked" : "unblocked"} successfully`
      );
    } catch (error) {
      toast.error("Error updating customer status");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">Manage Customers</h3>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-pink-300 rounded-lg
             bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm md:text-base"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 md:py-20">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCustomers.length > 0 ? (
                  currentCustomers.map((customer) => (
                    <tr key={customer._id}>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                            <img
                              className="h-8 w-8 md:h-10 md:w-10 rounded-full"
                              src={customer.profilePicture || "/default-avatar.png"}
                              alt={`${customer.firstName} ${customer.lastName}`}
                            />
                          </div>
                          <div className="ml-2 md:ml-4">
                            <div className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1">
                              {customer.firstName} {customer.lastName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                        {customer.email}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            toggleBlockStatus(customer._id, customer.isBlocked)
                          }
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.isBlocked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {customer.isBlocked ? "Blocked" : "Active"}
                        </button>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                        <div className="flex space-x-1 md:space-x-2">
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDelete(customer._id)}
                          >
                            <FiTrash2 size={16} className="md:size-[18px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-xs md:text-sm text-gray-500"
                    >
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length > customersPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
              <div className="text-xs md:text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstCustomer + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastCustomer, filteredCustomers.length)}
                </span>{" "}
                of <span className="font-medium">{filteredCustomers.length}</span> customers
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-xs md:text-sm ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-xs md:text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}