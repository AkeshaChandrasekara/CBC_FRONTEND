import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import toast from "react-hot-toast";
import ProductCard from "../components/productCard";
import { FiHeart, FiArrowLeft } from "react-icons/fi";
import { getWishlistWithProducts, getWishlistFromStorage, removeFromWishlist } from "../utils/wishlistFunction";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCurrentUserEmail = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.email || payload.sub;
    } catch (e) {
      console.error("Error parsing token:", e);
      return null;
    }
  };

  const fetchWishlist = async () => {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login to view wishlist");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const products = await getWishlistWithProducts();
      setWishlistProducts(products);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist(); 
    window.addEventListener('wishlistUpdated', fetchWishlist); 

    return () => {
      window.removeEventListener('wishlistUpdated', fetchWishlist); 
    };
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
    
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-pink-50 min-h-screen">
            <div className="text-center py-12">
           
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const wishlistCount = getWishlistFromStorage().length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-white to-pink-50 min-h-screen">
          <div className="flex items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>

          {wishlistCount === 0 ? (
            <div className="flex items-center justify-center h-[40vh]">
              <div className="bg-white w-2/3 rounded-xl shadow-md p-6 text-center border border-pink-100">
                <FiHeart className="text-3xl text-pink-600 mx-auto mb-2" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Start adding products you love to your wishlist</p>
                <button
                  onClick={() => navigate('/products')}
                  className="bg-gradient-to-r from-pink-600 to-pink-700 text-white font-medium py-2 px-4 rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all duration-300"
                >
                  Browse Products
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistProducts.map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    onWishlistUpdate={fetchWishlist}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}