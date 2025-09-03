import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductNotFound from "./productNotFound";
import ImageSlider from "../../components/imgeSlider";
import { addToCart, getCurrentUserEmail } from "../../utils/cartFunction";
import toast from "react-hot-toast";
import ReviewForm from "../../components/ReviewForm";

export default function ProductOverview() {
  const params = useParams();
  const productId = params.id;
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigate = useNavigate();
  const isInStock = product?.stock > 0;
  const isDiscounted = product?.lastPrice < product?.price;
  const discountPercentage = isDiscounted 
    ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
    : 0;

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


    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${productId}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));

    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/average/${productId}`)
      .then(res => {
        setAverageRating(res.data.averageRating || 0);
        setReviewCount(res.data.count || 0);
      })
      .catch(err => console.error(err));
  }, [productId]);

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

  const handleReviewSubmit = (rating, comment) => {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login to submit a review");
      return;
    }

    axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/reviews`, {
      productId,
      rating,
      comment
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => {
      setReviews([res.data.review, ...reviews]);
      setAverageRating(((averageRating * reviewCount) + rating) / (reviewCount + 1));
      setReviewCount(reviewCount + 1);
      setShowReviewForm(false);
      toast.success("Review submitted successfully!");
    })
    .catch(err => {
      toast.error(err.response?.data?.message || "Failed to submit review");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-8 px-2 sm:px-4 lg:px-6">
      {status == "loading" && (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      )}
      
      {status == "not-found" && <ProductNotFound />}
      
      {status == "found" && (
        <div className="max-w-6xl mx-auto">
      

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
                        className="px-2 py-1 bg-pink-50 text-pink-500 text-xs rounded-full font-medium"
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
                          className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
                  </div>
                </div>
               
                <div className="mb-6 bg-white">
                  {isDiscounted ? (
                    <div>
                      <div className="flex items-baseline mb-1">
                        <span className="text-3xl font-bold text-gray-900 mr-3">
                          LKR {product.lastPrice.toFixed(2)}
                        </span>
                        <span className="text-3xl text-red-500 line-through">
                          LKR {product.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="px-0 py-1 text-red-500 text-md font-bold rounded mr-2">
                          {discountPercentage}% OFF
                        </span>
                        <span className="text-md font-semibold text-green-600">
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

                <div className="mb-6">
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

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={onAddtoCartClick}
                    disabled={!isInStock}
                    className={`flex-1 flex items-center justify-center gap-2 ${isInStock ? 'bg-gradient-to-r from-pink-600 to-pink-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium py-3 px-6 rounded-lg transition-all text-sm`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    {isInStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={onBuyNowClick}
                    disabled={!isInStock}
                    className={`flex-1 flex items-center justify-center gap-2 ${isInStock ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-pink-300 cursor-not-allowed'} text-white font-medium py-3 px-6 rounded-lg transition-all text-sm`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    {isInStock ? 'Buy Now' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              {getCurrentUserEmail() && (
                <button 
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-pink-500 hover:bg-pink-400 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
                >
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              )}
            </div>

            {showReviewForm && (
              <ReviewForm 
                onSubmit={handleReviewSubmit}
                onCancel={() => setShowReviewForm(false)}
              />
            )}

            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-lg font-medium text-gray-900">
                  {averageRating.toFixed(1)} out of 5
                </span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{reviewCount} reviews</span>
              </div>
            </div>

            <div className="space-y-6">
              {reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center mr-2">
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
                      <span className="text-sm font-medium text-gray-900">
                        {review.email.split('@')[0]} 
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}