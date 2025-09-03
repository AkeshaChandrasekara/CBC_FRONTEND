import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import uploadMediaToSupabase from "../../utils/mediaUpload";

export default function EditProductForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) {
    navigate("/admin/products");
    return null;
  }

  const [formData, setFormData] = useState({
    productId: product.productId,
    productName: product.productName,
    alternativeNames: product.altNames.join(","),
    imageFiles: [],
    price: product.price,
    lastPrice: product.lastPrice,
    stock: product.stock,
    description: product.description,
    existingImages: product.images
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, imageFiles: e.target.files }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const altNames = formData.alternativeNames.split(",").map(name => name.trim());
      
      let imgUrls = [...formData.existingImages];
      if (formData.imageFiles.length > 0) {
        const promisesArray = Array.from(formData.imageFiles).map(file => 
          uploadMediaToSupabase(file)
        );
        const newImgUrls = await Promise.all(promisesArray);
        imgUrls = [...imgUrls, ...newImgUrls];
      }

      const productData = {
        productId: formData.productId,
        productName: formData.productName,
        altNames: altNames,
        images: imgUrls,
        price: formData.price,
        lastPrice: formData.lastPrice,
        stock: formData.stock,
        description: formData.description
      };

      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${product.productId}`,
        productData,
        { headers: { Authorization: "Bearer " + token } }
      );
      
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  }

  
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
            <button 
              onClick={() => navigate("/admin/products")}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product ID *
                </label>
                <input
                  name="productId"
                  type="text"
                  required
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  value={formData.productId}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  name="productName"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.productName}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternative Names
                </label>
                <input
                  name="alternativeNames"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Comma separated values"
                  value={formData.alternativeNames}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                {formData.existingImages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Existing Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.existingImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={img} 
                            alt={`Product ${index}`} 
                            className="h-20 w-20 object-cover rounded"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload additional files</span>
                        <input
                          name="imageFiles"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </p>
                    {formData.imageFiles.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        {formData.imageFiles.length} additional file(s) selected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs</span>
                  </div>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs</span>
                  </div>
                  <input
                    name="lastPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    value={formData.lastPrice}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity *
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 border border-transparent rounded-md text-sm 
              font-medium text-white bg-pink-600 hover:bg-pink-700 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </div>
  );
}