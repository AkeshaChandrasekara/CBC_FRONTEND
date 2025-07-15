import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FiSearch, FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
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
        const adminUsers = response.data.filter(user => user.type === "admin");
        setAdmins(adminUsers);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching admins");
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter((admin) =>
    `${admin.firstName} ${admin.lastName} ${admin.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/${adminId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAdmins(admins.filter((admin) => admin._id !== adminId));
        toast.success("Admin deleted successfully");
      } catch (error) {
        toast.error("Error deleting admin");
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">Manage Admins</h3>
        <div className="flex flex-col md:flex-row w-full md:w-auto space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm md:text-base"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link
            to="/admin/admins/add"
            className="flex items-center justify-center px-3 py-2 md:px-4 md:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm md:text-base"
          >
            <FiUserPlus className="mr-1 md:mr-2" />
            <span>Add Admin</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 md:py-20">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
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
              {filteredAdmins.length > 0 ? (
                filteredAdmins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                          <img
                            className="h-8 w-8 md:h-10 md:w-10 rounded-full"
                            src={admin.profilePicture || "/default-avatar.png"}
                            alt={`${admin.firstName} ${admin.lastName}`}
                          />
                        </div>
                        <div className="ml-2 md:ml-4">
                          <div className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1">
                            {admin.firstName} {admin.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                      {admin.email}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        admin.isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        {admin.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                      <div className="flex space-x-1 md:space-x-2">
                        <button
                          className="text-yellow-600 hover:text-yellow-900"
                          onClick={() => toast("Edit admin functionality coming soon")}
                        >
                          <FiEdit2 size={16} className="md:size-[18px]" />
                        </button>
                        <button
                        
                          className="text-red-500 hover:text-red-900"
                          onClick={() => handleDelete(admin._id)}
                        >
                          <FiTrash2 size={16} className="md:size-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-xs md:text-sm text-gray-500">
                    No admins found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}