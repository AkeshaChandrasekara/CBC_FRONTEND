import { Link } from "react-router-dom";
import { addToCart, getCurrentUserEmail } from "../utils/cartFunction";
import { addToWishlist, removeFromWishlist, isInWishlist } from "../utils/wishlistFunction";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiHeart, FiEye, FiShoppingCart } from "react-icons/fi";

export default function ProductCard(props) {
  const product = props.product;
  const isDiscounted = product.lastPrice < product.price;
  const discountPercentage = isDiscounted
    ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
    : 0;
  const isInStock = product.stock > 0;
  const navigate = useNavigate();
  const [isInWishlistState, setIsInWishlistState] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsInWishlistState(isInWishlist(product.productId));
  }, [product.productId]);

  const handleAddToCart = () => {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login first to add products to your cart");
      navigate("/login");
      return;
    }

    const success = addToCart(product.productId, 1);
    if (success) {
      toast.success(`${product.productName} added to cart!`);
      if (props.onCartUpdate) {
        props.onCartUpdate();
      }
    }
  };

  const toggleWishlist = async () => {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    setLoading(true);
    
    if (isInWishlistState) {
      await removeFromWishlist(product.productId);
      toast.success("Removed from wishlist");
      setIsInWishlistState(false);
    } else {
      await addToWishlist(product.productId);
      toast.success("Added to wishlist");
      setIsInWishlistState(true);
    }
    
    setLoading(false);
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
    overflow-hidden flex flex-col h-full border border-pink-100 hover:border-pink-200">
      <div className="relative aspect-square overflow-hidden m-2 rounded-lg bg-gray-50">
        <img
          src={product.images[0]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={product.productName}
        />
     
        <button
          onClick={toggleWishlist}
          disabled={loading}
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
            isInWishlistState 
              ? "bg-pink-600 text-white" 
              : "bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-600"
          }`}
        >
          <FiHeart className={`w-4 h-4 ${isInWishlistState ? "fill-current" : ""}`} />
        </button>

        {isDiscounted && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            {discountPercentage}% OFF
          </div>
        )}
        <div
          className={`absolute bottom-2 left-2 text-xs font-bold px-2 py-1 rounded-full shadow-sm ${
            isInStock ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isInStock ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      <div className="p-3 pt-1 flex flex-col flex-grow">
       
        <div className="mb-2">
          <h2 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
            {product.productName}
          </h2>
          <p className="text-[10px] text-gray-400">ID: {product.productId}</p>
        </div>

        <div className="mt-auto mb-3">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-bold text-slate-950">
              LKR {product.lastPrice.toFixed(2)}
            </span>
            {isDiscounted && (
              <span className="text-md font-semibold text-red-500 line-through">
                LKR {product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          
          {isDiscounted ? (
            <p className="text-sm text-green-600 font-medium">
              Save LKR {(product.price - product.lastPrice).toFixed(2)}
            </p>
          ) : (
         
            <div className="h-4"></div>
          )}
        </div>

        
        <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
          <Link
            to={`/productInfo/${product.productId}`}
            className="text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-2 rounded-lg transition-all duration-300 text-xs hover:shadow-sm active:scale-95 flex items-center justify-center"
          >
            <FiEye className="w-3 h-3 mr-1" />
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`text-center ${
              isInStock 
                ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800" 
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            } font-medium py-2 px-2 rounded-lg transition-all duration-300 text-xs hover:shadow-sm active:scale-95 flex items-center justify-center`}
          >
            <FiShoppingCart className="w-3 h-3 mr-1" />
            {isInStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
}