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
  const [canReview, setCanReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [hasCheckedOrders, setHasCheckedOrders] = useState(false);
  const navigate = useNavigate();
  const isInStock = product?.stock > 0;
  const isDiscounted = product?.lastPrice < product?.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
    : 0;

  useEffect(() => {
 
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((res) => {
        if (res.data == null) {
          setStatus("not-found");
        } else {
          setProduct(res.data);
          setStatus("found");
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        toast.error(`Failed to fetch product details: ${err.message}`);
        setStatus("not-found");
      });
  }, [productId]);

  useEffect(() => {

    if (hasCheckedOrders || !product) return;

    const email = getCurrentUserEmail();
    const token = localStorage.getItem("token");
    if (email && token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Orders response:", res.data);
          const hasOrdered = res.data.some((order) =>
            order.orderedItems.some((item) => {
              console.log("Checking item:", item);
              if (item.productId) {
                return item.productId === productId;
              } else if (item.name === product.productName) {
                console.log("Matched by name:", item.name);
                return true;
              }
              return false;
            })
          );
          setCanReview(hasOrdered);
          setHasCheckedOrders(true);
          if (!hasOrdered) {
            toast("No purchase found for this product", {
              style: { background: '#fefcbf', color: '#744210' },
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          toast.error(`Failed to verify purchase history: ${err.message}`);
          setHasCheckedOrders(true);
        });
    } else {
      console.log("No email or token found");
      toast.error("Please login to check review eligibility");
      setHasCheckedOrders(true);
    }
  }, [productId, product, hasCheckedOrders]);

 const handleReviewSubmit = async () => {
  const email = getCurrentUserEmail();
  const token = localStorage.getItem("token");
  
  if (!email || !token) {
    toast.error("Please login to submit a review");
    navigate('/login');
    return;
  }

  if (!reviewText.trim()) {
    toast.error("Please enter a review");
    return;
  }

  const reviewData = {
    productId,
    email,
    rating: reviewRating,
    comment: reviewText,
  };
  console.log('Submitting review with data:', reviewData);
    console.log('Using token:', token); 

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/reviews`,
      reviewData,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );
    console.log('Review submission response:', response.data);

    if (response.status === 201) {
      toast.success("Review submitted successfully");
      setReviewText("");
      setReviewRating(5);
      
      const productResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`
      );
      setProduct(productResponse.data);
    }
  } catch (err) {
    console.error("Review submission error:", err);
    const errorMessage = err.response?.data?.message || 
                        err.message || 
                        "Failed to submit review";
    toast.error(errorMessage);
    
    if (err.response?.status === 401) {
      navigate('/login');
    }
  }
};

  function onAddtoCartClick() {
    if (!isInStock) {
      toast.error("This product is out of stock");
      return;
    }
    
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
    if (!isInStock) {
      toast.error("This product is out of stock");
      return;
    }
    
    navigate("/shipping", {
      state: {
        items: [{ productId: product.productId, qty: 1 }]
      }
    });
  }

  return (
    <div className="min-h-screen bg-white py-8 px-2 sm:px-4 lg:px-6">
      {status == "loading" && (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      )}
      
      {status == "not-found" && <ProductNotFound />}
      
      {status == "found" && (
        <div className="max-w-6xl mx-auto">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <a href="/" className="text-gray-700 hover:text-yellow-500 text-sm font-medium">
                  Home
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <a href="#" className="ml-1 text-gray-700 hover:text-yellow-500 text-sm font-medium md:ml-2">
                    Products
                  </a>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-gray-500 text-sm font-medium md:ml-2">
                    {product.productName}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-1/2 p-4 bg-white flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className={`mt-2 text-center text-sm font-bold px-3 py-1 rounded-full inline-block ${isInStock ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {isInStock ? 'In Stock' : 'Out of Stock'}
                  </div>
                  <ImageSlider images={product.images} />
                </div>
              </div>
              <div className="lg:w-1/2 p-6">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.productName}
                  </h1>
                  <div className="flex items-center gap-2 mb-3">
                    {product.altNames.slice(0, 3).map((name, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-50 text-yellow-500 text-xs rounded-full font-medium"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < (product.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
               
                <div className="mb-6 bg-white">
                  {isDiscounted ? (
                    <div>
                      <div className="flex items-baseline mb-1">
                        <span className="text-3xl font-bold text-gray-900 mr-3">
                          LKR {product.lastPrice.toFixed(2)}
                        </span>
                        <span className="text-base text-gray-500 line-through">
                          LKR {product.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="px-2 py-1 text-yellow-800 text-xs font-bold rounded mr-2">
                          {discountPercentage}% OFF
                        </span>
                        <span className="text-sm text-yellow-700">
                          Save LKR {(product.price - product.lastPrice).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      LKR {product.lastPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                    About This Product
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="inline-flex items-center px-3 py-2 bg-gray-100 rounded-lg">
                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
                    </svg>
                    <span className="text-sm font-medium text-gray-600">
                      Product ID: {product.productId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={onAddtoCartClick}
                    disabled={!isInStock}
                    className={`flex-1 flex items-center justify-center gap-2 ${isInStock ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium py-3 px-6 rounded-lg transition-all text-sm`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={onBuyNowClick}
                    disabled={!isInStock}
                    className={`flex-1 flex items-center justify-center gap-2 ${isInStock ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-yellow-300 cursor-not-allowed'} text-gray-900 font-medium py-3 px-6 rounded-lg transition-all text-sm`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    {isInStock ? 'Buy Now' : 'Out of Stock'}
                  </button>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
                    Customer Reviews
                  </h3>
                  {canReview ? (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">Your Rating:</span>
                        <select
                          value={reviewRating}
                          onChange={(e) => setReviewRating(parseInt(e.target.value))}
                          className="border rounded px-2 py-1"
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <option key={num} value={num}>
                              {num} Star{num > 1 ? 's' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write your review here..."
                        className="w-full border rounded p-2 mb-2"
                        rows="4"
                      ></textarea>
                      <button
                        onClick={handleReviewSubmit}
                        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-medium py-2 px-4 rounded-lg"
                      >
                        Submit Review
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 mb-4">
                      Purchase this product to leave a review
                    </p>
                  )}
                  <div className="space-y-4">
                    {product.reviews?.map((review, index) => (
                      <div key={index} className="border-t pt-2">
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          By {review.email.split('@')[0]} on {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}