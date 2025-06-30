import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductNotFound from "./productNotFound";
import ImageSlider from "../../components/imgeSlider";
import { addToCart, getCurrentUserEmail } from "../../utils/cartFunction";
import toast from "react-hot-toast";

export default function ProductOverview() {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId)
      .then((res) => {
        if (res.data == null) {
          setStatus("not-found");
        } else {
          setProduct(res.data);
          setStatus("found");
        }
      });
  }, []);

  function onAddtoCartClick() {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login to add items to cart");
      navigate('/login');
      return;
    }
    addToCart(product.productId, 1);
    toast.success(`${product.productName} added to cart`);
  }

  function onBuyNowClick() {
    navigate("/shipping", {
      state: {
        items: [{ productId: product.productId, qty: 1 }]
      }
    });
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8">
      {status == "loading" && (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}
      
      {status == "not-found" && <ProductNotFound />}
      
      {status == "found" && (
        <div className="max-w-4xl w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="flex flex-col lg:flex-row">
    
              <div className="lg:w-2/5 p-4 bg-gray-50 flex items-center justify-center">
                <div className="w-full aspect-square max-w-xs">
                  <ImageSlider images={product.images} />
                </div>
              </div>

              <div className="lg:w-3/5 p-6">
                <div className="mb-4 border-b border-gray-100 pb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {product.productName}
                  </h1>
                  <div className="mt-2 space-y-1">
                    {product.altNames.slice(0, 3).map((name, index) => (
                      <p 
                        key={index}
                        className="text-sm text-yellow-500 font-medium italic"
                      >
                        {name}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                  {product.price > product.lastPrice ? (
                    <div className="flex flex-col">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900 mr-3">
                          LKR {product.lastPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          LKR {product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        Save LKR {(product.price - product.lastPrice).toFixed(2)} ({Math.round(((product.price - product.lastPrice)/product.price)*100)}% off)
                      </p>
                    </div>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      LKR {product.lastPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 uppercase tracking-wider">
                    Description
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mb-6 text-center">
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Product ID: {product.productId}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onAddtoCartClick}
                    className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={onBuyNowClick}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}