import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../../components/productCard";
import { 
  FiSearch, 
  FiX
} from "react-icons/fi";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [availability, setAvailability] = useState("all");

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

  const filterProducts = (products) => {
    let filtered = products;

    if (priceRange !== "all") {
      switch (priceRange) {
        case "under-1000":
          filtered = filtered.filter(product => product.lastPrice < 1000);
          break;
        case "1000-5000":
          filtered = filtered.filter(product => product.lastPrice >= 1000 && product.lastPrice <= 5000);
          break;
        case "5000-10000":
          filtered = filtered.filter(product => product.lastPrice > 5000 && product.lastPrice <= 10000);
          break;
        case "above-10000":
          filtered = filtered.filter(product => product.lastPrice > 10000);
          break;
        default:
          break;
      }
    }

    
    if (availability !== "all") {
      switch (availability) {
        case "in-stock":
          filtered = filtered.filter(product => product.stock > 0);
          break;
        case "out-of-stock":
          filtered = filtered.filter(product => product.stock === 0);
          break;
        default:
          break;
      }
    }

    return filtered;
  };

  const filteredAndSortedProducts = sortProducts(filterProducts(products), sortBy);

  const clearFilters = () => {
    setPriceRange("all");
    setAvailability("all");
    setSortBy("default");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 p-6">
      <div className="max-w-9xl mx-auto">
       
        <div className="relative mb-8 mt-0">
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg border border-pink-100 p-0 transition-all duration-300 hover:shadow-xl hover:border-pink-200">
              <div className="pl-5 pr-3">
                <FiSearch className="w-5 h-5 text-pink-500 transform transition-transform duration-300 hover:scale-110" />
              </div>
              <input
                type="text"
                className="w-full p-4 border-0 focus:ring-0 text-gray-700 placeholder-gray-400 text-lg bg-transparent"
                placeholder="Discover Our Collection..."
                onChange={search}
                value={query}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="pr-4 text-gray-400 hover:text-pink-600 transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
         
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-pink-100 p-5 sticky top-6 transition-all duration-300 hover:shadow-xl">
            
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
              FILTER PRODUCTS
                </h3>
                <button
                  onClick={clearFilters}
                  className="px-2 py-1 text-xs font-semibold bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-full hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-sm"
                >
                 CLEAR
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Sort By</h4>
                <div className="space-y-2">
                  {[
                    { value: "default", label: "Default", color: "bg-gray-400" },
                    { value: "price-low", label: "Price: Low to High", color: "bg-green-500" },
                    { value: "price-high", label: "Price: High to Low", color: "bg-red-500" },
                    { value: "name", label: "Name A-Z", color: "bg-blue-500" },
                    { value: "newest", label: "Newest First", color: "bg-purple-500" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-pink-400 ${
                          sortBy === option.value 
                            ? 'border-pink-600 bg-pink-600 shadow-sm' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {sortBy === option.value && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Prices", color: "bg-gray-400" },
                    { value: "under-1000", label: "Under LKR 1,000", color: "bg-green-400" },
                    { value: "1000-5000", label: "LKR 1,000 - 5,000", color: "bg-blue-400" },
                    { value: "5000-10000", label: "LKR 5,000 - 10,000", color: "bg-purple-400" },
                    { value: "above-10000", label: "Above LKR 10,000", color: "bg-pink-500" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="price"
                          value={option.value}
                          checked={priceRange === option.value}
                          onChange={(e) => setPriceRange(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-pink-400 ${
                          priceRange === option.value 
                            ? 'border-pink-600 bg-pink-600 shadow-sm' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {priceRange === option.value && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Availability</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Products", color: "bg-gray-400" },
                    { value: "in-stock", label: "In Stock", color: "bg-green-500" },
                    { value: "out-of-stock", label: "Out of Stock", color: "bg-red-400" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="radio"
                          name="availability"
                          value={option.value}
                          checked={availability === option.value}
                          onChange={(e) => setAvailability(e.target.value)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 border-2 rounded-full flex items-center justify-center transition-all duration-300 group-hover:border-pink-400 ${
                          availability === option.value 
                            ? 'border-pink-600 bg-pink-600 shadow-sm' 
                            : 'border-gray-300 bg-white'
                        }`}>
                          {availability === option.value && (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

        
          <div className="flex-1">
            {loadingStatus === "loading" && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-pink-600 mb-4"></div>
                
                </div>
             
              </div>
            )}

            {loadingStatus === "loaded" && (
              <>
                {filteredAndSortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product.productId} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                      <div className="relative w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <svg className="w-12 h-12 text-pink-600 transform hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 animate-pulse"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent">
                        No products found
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {query || priceRange !== "all" || availability !== "all" 
                          ? "No results match your filters. Try adjusting your search criteria." 
                          : 'No products available at the moment.'}
                      </p>
                      {(query || priceRange !== "all" || availability !== "all") && (
                        <button
                          onClick={clearFilters}
                          className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl hover:from-pink-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}