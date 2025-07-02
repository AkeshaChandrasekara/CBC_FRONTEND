import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!productsLoaded) {
      axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products").then((res) => {
        setProducts(res.data);
        setProductsLoaded(true);
      });
    }
  }, [productsLoaded]);

  const filteredProducts = products.filter(product => 
    product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      setProductsLoaded(false);
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Product Management</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your product inventory</p>
          </div>
          <Link 
            to="/admin/products/addProduct"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            <FaPlus className="mr-2" />
            Add Product
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-3 md:p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              {filteredProducts.length} products found
            </div>
          </div>

          {productsLoaded ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th scope="col" className="px-3 py-2 md:px-6 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.images?.[0] && (
                            <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10">
                              <img className="h-8 w-8 md:h-10 md:w-10 rounded-md object-cover" src={product.images[0]} alt={product.productName} />
                            </div>
                          )}
                          <div className="ml-2 md:ml-4">
                            <div className="text-xs md:text-sm font-medium text-gray-900 line-clamp-1">{product.productName}</div>
                            <div className="text-xs md:text-sm text-gray-500 truncate max-w-[120px] md:max-w-xs">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {product.productId}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <div className="text-xs md:text-sm text-gray-900">Rs{product.price}</div>
                        {product.lastPrice && (
                          <div className="text-xs md:text-sm text-gray-500 line-through">Rs{product.lastPrice}</div>
                        )}
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${product.stock > 10 ? 'bg-green-100 text-green-800' : 
                            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-3 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate("/admin/products/editProduct", { state: { product } })}
                          className="text-blue-600 hover:text-blue-900 mr-2 md:mr-4"
                        >
                          <FaPencil className="text-sm md:text-base" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.productId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash className="text-sm md:text-base" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-full py-8 md:py-12 flex justify-center items-center">
              <div className="w-8 h-8 md:w-12 md:h-12 border-4 border-gray-200 border-t-blue-500 animate-spin rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}