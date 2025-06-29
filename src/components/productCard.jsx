import { Link } from "react-router-dom";

export default function ProductCard(props) {
  const product = props.product;
  const isDiscounted = product.lastPrice < product.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
    : 0;
 

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-200">
    
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={product.productName}
        />
        
 
        {isDiscounted && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
        )}
      </div>


      <div className="p-4 flex flex-col flex-grow">
  
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {product.productName}
        </h2>
        <p className="text-xs text-gray-500 mb-2">ID: {product.productId}</p>
        
      
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${i < (product.rating || 4) ? 'fill-current' : 'fill-gray-300'}`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews || 0})</span>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline">
            <span className="text-xl font-bold text-gray-900">
              LKR {product.lastPrice.toFixed(2)}
            </span>
            {isDiscounted && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                LKR {product.price.toFixed(2)}
              </span>
            )}
          </div>
          {isDiscounted && (
            <p className="text-xs text-green-600 mt-1">
              Save LKR {(product.price - product.lastPrice).toFixed(2)}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
          <Link 
            to={`/productInfo/${product.productId}`}
            className="text-sm font-medium text-gray-900 hover:text-primary-dark"
          >
            View Details
          </Link>
          <button 
            className="text-sm font-medium bg-yellow-500 text-white px-3 py-1 rounded hover:bg-primary-dark transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}