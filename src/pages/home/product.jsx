import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";


export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (loadingStatus === "loading") {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
        .then((res) => {
          setProducts(res.data);
          setLoadingStatus("loaded");
        })
        .catch((err) => toast.error("Error loading products"));
    }
  }, []);

  function search(e) {
    const query = e.target.value;
    setQuery(query);
    setLoadingStatus("loading");
    
    const endpoint = query === "" 
      ? "/api/products" 
      : `/api/products/search/${query}`;
    
    axios
      .get(import.meta.env.VITE_BACKEND_URL + endpoint)
      .then((res) => {
        setProducts(res.data);
        setLoadingStatus("loaded");
      })
      .catch((err) => toast.error("Error loading products"));
  }

  return (
    <div className="min-h-screen bg-white p-6">
     
      <div className="max-w-4xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search products..."
            onChange={search}
            value={query}
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

  
      {loadingStatus === "loading" && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

  
      {loadingStatus === "loaded" && (
        <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-700">
                No products found
              </h3>
              <p className="text-gray-500 mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}