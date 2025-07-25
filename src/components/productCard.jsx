import { Link } from "react-router-dom";
import { addToCart , getCurrentUserEmail} from "../utils/cartFunction";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductCard(props) {
  const product = props.product;
  const isDiscounted = product.lastPrice < product.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
    : 0;
  const isInStock = product.stock > 0;
  const navigate = useNavigate();

 const handleAddToCart = () => {
  const email = getCurrentUserEmail(); 
  if (!email) {
    toast.error("Please login first to add products to your cart");
    navigate('/login');
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

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-gray-200">
      
      <div className="relative aspect-square overflow-hidden m-2 rounded-lg bg-gray-50">
        <img
          src={product.images[0]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={product.productName}
        />
        
        {isDiscounted && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
            {discountPercentage}% OFF
          </div>
        )}
        <div className={`absolute bottom-2 left-2 text-xs font-bold px-2 py-1 rounded-full shadow-sm ${isInStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>

      <div className="p-3 pt-1 flex flex-col flex-grow">
        <div className="mb-2">
          <h2 className="text-m font-bold text-gray-800 line-clamp-2 leading-tight">
            {product.productName}
          </h2>
          <p className="text-[10px] text-gray-400 mt-0.5">ID: {product.productId}</p>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < (product.rating || 4) ? 'fill-current' : 'fill-gray-200'}`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product.reviews || 0})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
          
            <span className="text-lg font-bold text-gray-900">
              LKR {product.lastPrice.toFixed(2)}
            </span>
           
            {isDiscounted && (
              <span className="text-sm text-gray-500 line-through">
                LKR {product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          {isDiscounted && (
            <p className="text-xs text-green-700 mt-1 font-medium">
              You save LKR {(product.price - product.lastPrice).toFixed(2)}
            </p>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
          <Link 
            to={`/productInfo/${product.productId}`}
            className="text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-2 rounded-lg transition-all duration-300 text-xs hover:shadow-sm active:scale-95 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`text-center ${isInStock ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-gray-300 cursor-not-allowed'} text-gray-900 font-medium py-2 px-2 rounded-lg transition-all duration-300 text-xs hover:shadow-sm active:scale-95 flex items-center justify-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}