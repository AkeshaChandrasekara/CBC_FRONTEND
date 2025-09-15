import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("default");

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

  const sortProducts = (products, sortType) => {
    switch (sortType) {
      case "price-low":
        return [...products].sort((a, b) => a.lastPrice - b.lastPrice);
      case "price-high":
        return [...products].sort((a, b) => b.lastPrice - a.lastPrice);
      case "name":
        return [...products].sort((a, b) => a.productName.localeCompare(b.productName));
      case "newest":
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return products;
    }
  };

  const sortedProducts = sortProducts(products, sortBy);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
       
        <div className="relative mb-6 mt-0">

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-pink-100 p-0">
              <div className="pl-4 pr-2">
                <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full p-3 border-0 focus:ring-0 text-gray-700 placeholder-gray-400"
                placeholder="Discover something beautiful..."
                onChange={search}
                value={query}
              />
              <div className="flex items-center">
                <div className="h-6 w-px bg-gray-200 mx-2"></div>
                <div className="relative">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center px-4 py-4 text-md text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    <span>Sort</span>
                    <svg className="w-4 h-4 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-pink-100 py-1 z-20">
                      <button
                        onClick={() => { setSortBy("default"); setShowFilters(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "default" ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Default Sorting
                      </button>
                      <button
                        onClick={() => { setSortBy("price-low"); setShowFilters(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "price-low" ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => { setSortBy("price-high"); setShowFilters(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "price-high" ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Price: High to Low
                      </button>
                      <button
                        onClick={() => { setSortBy("name"); setShowFilters(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "name" ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Name A-Z
                      </button>
                      <button
                        onClick={() => { setSortBy("newest"); setShowFilters(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm ${sortBy === "newest" ? "text-pink-600 bg-pink-50" : "text-gray-700 hover:bg-gray-50"}`}
                      >
                        Newest First
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        
         
        </div>

        {loadingStatus === "loading" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-600 mb-4"></div>
           
          </div>
        )}

      
        {loadingStatus === "loaded" && (
          <>
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {query ? `No results for "${query}". Try a different search term.` : 'No products available at the moment.'}
                  </p>
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("");
                        search({ target: { value: "" } });
                      }}
                      className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors duration-300"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

      
      </div>
    </div>
  );
}