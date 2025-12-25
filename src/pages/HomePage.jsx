import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import LoginPage from './loginPage';
import ProductOverview from './home/productOverview';
import ProductPage from './home/product';
import Cart from './home/cart';
import ShippingPage from './home/shipping';
import MyOrdersPage from './home/orders';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import AboutPage from './home/aboutPage';
import ContactPage from './home/contactUs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheck, FiTruck, FiShield, FiAward, FiStar, FiHeart, FiTrendingUp, FiClock, FiDroplet, FiSun } from 'react-icons/fi';
import { addToCart, getCurrentUserEmail } from '../utils/cartFunction';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/wishlistFunction';

export default function HomePage() {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({});

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
      .then((res) => {
        const products = res.data.slice(12, 16);
        setBestSellers(products);
        
        const trending = res.data.slice(0, 4);
        setTrendingProducts(trending);
        
        const status = {};
        [...products, ...trending].forEach(product => {
          status[product.productId] = isInWishlist(product.productId);
        });
        setWishlistStatus(status);
        setLoading(false);
        setTrendingLoading(false);
      })
      .catch((err) => {
        toast.error("Error loading products");
        setLoading(false);
        setTrendingLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login first to add products to your cart");
      navigate("/login");
      return;
    }

    const success = addToCart(product.productId, 1);
    if (success) {
      toast.success(`${product.productName} added to cart!`);
    }
  };

  const toggleWishlist = async (product) => {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login to add to wishlist");
      navigate("/login");
      return;
    }

    const productId = product.productId;
    const currentlyInWishlist = isInWishlist(productId);

    try {
      if (currentlyInWishlist) {
        await removeFromWishlist(productId);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(productId);
        toast.success("Added to wishlist");
      }
      
      setWishlistStatus(prev => ({
        ...prev,
        [productId]: !currentlyInWishlist
      }));
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error("Error updating wishlist");
    }
  };

  const renderProductCard = (product, index, isTrending = false) => {
    const isDiscounted = product.lastPrice < product.price;
    const discountPercentage = isDiscounted
      ? Math.round(((product.price - product.lastPrice) / product.price) * 100)
      : 0;
    const isInStock = product.stock > 0;
    const isProductInWishlist = wishlistStatus[product.productId] || false;

    return (
      <motion.div
        key={product.productId}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all 
        duration-300 overflow-hidden flex flex-col h-full border border-pink-100 hover:border-pink-200"
      >
        <div className="relative aspect-square overflow-hidden m-2 rounded-lg bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={() => toggleWishlist(product)}
            disabled={loading}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
              isProductInWishlist
                ? "bg-pink-600 text-white"
                : "bg-white text-pink-600 hover:bg-pink-50 hover:text-pink-600"
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isProductInWishlist ? "fill-current" : ""}`} />
          </button>

          {isDiscounted && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white w-10 h-10 flex items-center justify-center text-xs font-bold px-2 py-1 rounded-full shadow-lg z-10 border border-white/20">
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
            <h3 className="text-md font-bold text-gray-800 line-clamp-2 leading-tight mb-1">
              {product.productName}
            </h3>
            <p className="text-[10px] text-gray-400">ID: {product.productId}</p>
          </div>

          <div className="mt-auto mb-3">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-bold text-slate-950">
                LKR {product.lastPrice.toFixed(2)}
              </span>
              {isDiscounted && (
                <span className="text-lg font-bold text-red-500 line-through">
                  LKR {product.price.toFixed(2)}
                </span>
              )}
            </div>
            {isDiscounted ? (
              <p className="text-sm text-green-600 font-bold">
                Save LKR {(product.price - product.lastPrice).toFixed(2)}
              </p>
            ) : (
              <div className="h-4"></div>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
            <button
              className="text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-2 rounded-lg transition-all duration-300 text-sm hover:shadow-sm active:scale-95 flex items-center justify-center"
              onClick={() => navigate(`/productInfo/${product.productId}`)}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Details
            </button>
            <button
              className={`text-center ${
                isInStock
                  ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:from-pink-700 hover:to-pink-800"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              } font-medium py-2 px-2 rounded-lg transition-all duration-300 text-sm hover:shadow-sm active:scale-95 flex items-center justify-center`}
              onClick={() => handleAddToCart(product)}
              disabled={!isInStock}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {isInStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
            
              <section className="relative h-[45vh] md:h-[64vh] bg-white overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 3300 }}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    pagination={{ 
                      clickable: true,
                      el: '.hero-pagination',
                      type: 'bullets',
                    }}
                    loop
                    className="h-full w-full"
                  >
                    {[
                      {
                        title: "Illuminate Your Glow",
                        highlight: "Crystal Radiance",
                        description: "Discover our premium crystal-infused skincare collection",
                        buttonText: "Shop Now",
                        image: "/w668.png",
                      },
                      {
                        title: "Revitalize Your Skin",
                        highlight: "Diamond Elegance",
                        description: "Experience the transformative power of diamonds",
                        buttonText: "Shop Now",
                        image: "/iw88.png",
                      },
                      {
                        title: "Enhance Your Luminosity",
                        highlight: "Gold Infusion",
                        description: "24k gold skincare for celestial radiance",
                        buttonText: "Shop Now",
                        image: "/wmn3.png",
                      }
                    ].map((slide, index) => (
                      <SwiperSlide key={index} className="h-full w-full">
                        <div className="container mx-auto h-full flex items-center px-4 md:px-6 relative z-10">
                          <motion.div 
                            className="w-full md:w-1/2 pr-0 md:pr-12 text-center md:text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                          >
                            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-3 leading-tight">
                              {slide.title} <br />
                              <span className="text-pink-600">{slide.highlight}</span>
                            </h1>
                            
                            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-md leading-relaxed">
                              {slide.description}
                            </p>

                            <motion.button 
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: '0 10px 25px rgba(219, 39, 119, 0.3)'
                              }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800
                               text-white font-semibold mt-0 py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                              onClick={() => navigate('/products')}
                            >
                              {slide.buttonText}
                            </motion.button>
                          </motion.div>
                          
                          <motion.div 
                            className="hidden md:block w-1/2 h-full relative"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <img 
                                src={slide.image} 
                                alt={slide.title}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </motion.div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                <div className="hero-pagination absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2 
                  [&>.swiper-pagination-bullet]:bg-pink-600
                  [&>.swiper-pagination-bullet]:opacity-50 
                  [&>.swiper-pagination-bullet]:w-2 
                  [&>.swiper-pagination-bullet]:h-2 
                  [&>.swiper-pagination-bullet]:transition-opacity 
                  [&>.swiper-pagination-bullet]:duration-300
                  [&>.swiper-pagination-bullet-active]:!opacity-100">
                </div>
              </section>

              <section className="bg-pink-50 py-12 border-b border-gray-100">
                <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                      { icon: <FiTruck className="text-2xl" color='white' />, title: "Free Shipping", desc: "On orders over Rs 5000" },
                      { icon: <FiShield className="text-2xl" color='white'/>, title: "Secure Payment", desc: "100% protected" },
                      { icon: <FiAward className="text-2xl" color='white'/>, title: "Quality Guarantee", desc: "Premium products" },
                      { icon: <FiStar className="text-2xl" color='white' />, title: "5-Star Reviews", desc: "Customer loved" }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          {feature.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                  >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">TRENDING COLLECTION</h2>
                    <div className="w-20 h-1 bg-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Discover our exquisite range of crystal-infused skincare products
                    </p>
                  </motion.div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                          <div className="h-60 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                          <div className="p-4">
                            <div className="h-6 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded-xl"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestSellers.map((product, index) => renderProductCard(product, index))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative overflow-hidden bg-white border-2 border-pink-600 text-pink-600 font-bold py-3.5 px-8 rounded-md transition-all duration-300 group hover:bg-pink-600 hover:text-white hover:shadow-xl"
                          onClick={() => navigate('/products')}
                        >
                          <span className="relative z-10 flex items-center textt-md justify-center">
                            Explore Full Collection
                          </span>
                          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </div>
              </section>

              <section className="py-12 bg-gradient-to-r from-pink-50 to-white">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-pink-400/5"></div>
                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
                      <div className="text-left">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                          Summer Glow Collection
                          <span className="block text-pink-600">Limited Time Offer</span>
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-lg">
                          Get ready for summer with our special crystal-infused skincare collection. 
                          Achieve radiant, hydrated skin that glows under the sun.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300"
                          onClick={() => navigate('/products')}
                        >
                          Shop Summer Collection
                        </motion.button>
                      </div>
                      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-xl">
                        <img 
                          src="https://m.media-amazon.com/images/I/71mNRXbAKtL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg" 
                          alt="Summer Beauty Collection"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-transparent"></div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>


              <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                  >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">NEW ARRIVALS</h2>
                    <div className="w-20 h-1 bg-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                       Discover what everyone is loving right now

                    </p>
                  </motion.div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                          <div className="h-60 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                          <div className="p-4">
                            <div className="h-6 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded-xl"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingProducts.map((product, index) => renderProductCard(product, index))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative overflow-hidden bg-white border-2 border-pink-600 text-pink-600 font-bold py-3.5 px-8 rounded-md transition-all duration-300 group hover:bg-pink-600 hover:text-white hover:shadow-xl"
                          onClick={() => navigate('/products')}
                        >
                          <span className="relative z-10 flex items-center justify-center">
                            Explore Full Collection
                          </span>
                          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </div>
              </section>
         

              <section className="py-16 bg-gradient-to-br from-pink-50 via-white to-pink-50">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl"
                  >
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full -translate-x-32 -translate-y-32"></div>
                      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full translate-x-48 translate-y-48"></div>
                    </div>
                    
                    <div className="relative bg-gradient-to-r from-white to-pink-50 border-2 border-pink-100 rounded-3xl shadow-xl">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center p-8 md:p-12">
                        <div className="lg:col-span-2 text-center lg:text-left">
                          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            <span className="text-pink-600">Exclusive</span> Crystal Beauty Bundle
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-2xl text-lg">
                            Get our best-selling crystal skincare set at <span className="font-bold text-pink-600">30% off</span>. 
                            Limited time offer for our loyal customers.
                          </p>
                          <div className="flex flex-wrap gap-4 mb-8">
                            <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
                              <FiCheck className="text-pink-500" />
                              <span className="text-gray-800 font-medium">Free Crystal Roller</span>
                            </div>
                            <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
                              <FiCheck className="text-pink-500" />
                              <span className="text-gray-800 font-medium">Premium Gift Packaging</span>
                            </div>
                            <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full">
                              <FiCheck className="text-pink-500" />
                              <span className="text-gray-800 font-medium">Free Shipping</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-gradient-to-r from-pink-600 to-pink-700 text-white font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 shadow-md"
                              onClick={() => navigate('/products')}
                            >
                              Shop Now - 30% OFF
                            </motion.button>
                            <button
                              className="border-2 border-pink-600 text-pink-600 font-bold py-3 px-8 rounded-full hover:bg-pink-50 transition-all duration-300"
                              onClick={() => navigate('/about')}
                            >
                              Learn More
                            </button>
                          </div>
                        </div>
                        <div className="relative h-80 lg:h-72">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/50 rounded-2xl"></div>
                          <img 
                            src="https://m.media-amazon.com/images/I/610SdOjWrsL.jpg" 
                            alt="Crystal Beauty Bundle"
                            className="w-full h-full object-cover rounded-2xl shadow-xl border-2 border-white"
                          />
                          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                            SPECIAL OFFER
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>
               <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                  >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">PRODUCTS MAY YOU LIKE</h2>
                    <div className="w-20 h-1 bg-pink-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Discover our exquisite range of crystal-infused skincare products
                    </p>
                  </motion.div>

                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                          <div className="h-60 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                          <div className="p-4">
                            <div className="h-6 bg-gray-200 rounded-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded-full mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded-xl"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestSellers.map((product, index) => renderProductCard(product, index))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="relative overflow-hidden bg-white border-2 border-pink-600 text-pink-600 font-bold py-3.5 px-8 rounded-md transition-all duration-300 group hover:bg-pink-600 hover:text-white hover:shadow-xl"
                          onClick={() => navigate('/products')}
                        >
                          <span className="relative z-10 flex items-center textt-md justify-center">
                            Explore Full Collection
                          </span>
                          <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                        </motion.button>
                      </motion.div>
                    </>
                  )}
                </div>
              </section>

              <section className="py-12 bg-gradient-to-b from-white to-pink-50 overflow-hidden">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-r from-pink-50 to-white rounded-3xl shadow-xl overflow-hidden"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      <div className="p-12 lg:p-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                          Start Your Crystal Skincare Journey Today
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                          Join over 10,000 customers who have transformed their skin with our crystal-infused products. 
                          Experience the difference that natural, effective skincare can make.
                        </p>
                        
                        <div className="space-y-2 mb-5">
                          {[
                            { icon: <FiDroplet />, text: "Hydration & Nourishment" },
                            { icon: <FiSun />, text: "Radiant Glow" },
                            { icon: <FiClock />, text: "Long-lasting Results" }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
                                {item.icon}
                              </div>
                              <span className="font-medium text-gray-800">{item.text}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-pink-600 text-white font-bold py-3 px-8 rounded-full hover:bg-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={() => navigate('/products')}
                          >
                            Shop Collection
                          </motion.button>
                          <button
                            className="border-2 border-pink-600 text-pink-600 font-bold py-3 px-8 rounded-full hover:bg-pink-50 transition-all duration-300"
                            onClick={() => navigate('/about')}
                          >
                            Our Story
                          </button>
                        </div>
                      </div>

                      <div className="relative lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
                        <div className="h-64 lg:h-full w-full">
                          <img
                            src="https://people.com/thmb/1vIBxlbtmKiXR76Dcd8hEULe-eE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(672x518:674x520)/Sydney-Sweeney-beauty-essentials-031025-tout-fa0a853052d544108f9f4d84d3457d4f.jpg"
                            alt="Woman with beauty products"
                            className="w-full h-full object-cover lg:object-left"
                          />
                          
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>


            </>
          } />
          <Route path="/products" element={<ProductPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/about" element={<AboutPage/>} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/contact" element={<ContactPage/>}/>
          <Route path="/shipping" element={<ShippingPage/>}/>   
          <Route path='/orders' element={<MyOrdersPage/>}/>      
          <Route path="/productInfo/:id" element={<ProductOverview/>} />
        </Routes>  
      </main>
      
      <Footer />
    </div>
  );
}