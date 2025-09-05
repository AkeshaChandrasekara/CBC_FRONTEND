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
import { FiCheck, FiTruck, FiShield, FiAward, FiStar,FiHeart } from 'react-icons/fi';
import { addToCart, getCurrentUserEmail } from '../utils/cartFunction';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../utils/wishlistFunction';


export default function HomePage() {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({}); 

  useEffect(() => {
axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/products")
      .then((res) => {
      
        const products = res.data.slice(12, 16);
        setBestSellers(products);
        const status = {};
        products.forEach(product => {
          status[product.productId] = isInWishlist(product.productId);
        });
        setWishlistStatus(status);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Error loading products");
        setLoading(false);
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
                      { icon: <FiShield className="text-2xl"  color='white'/>, title: "Secure Payment", desc: "100% protected" },
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
                        <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 ">
                          {feature.icon}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

  <section className="py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Collection</h2>
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
              {bestSellers.map((product, index) => {
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
                    className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full border border-pink-100 hover:border-pink-200"
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
                          className="text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-800
                           font-medium py-2 px-2 rounded-lg transition-all duration-300 text-sm hover:shadow-sm active:scale-95 flex items-center justify-center"
                          onClick={() => navigate(`/productInfo/${product.productId}`)}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          {isInStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
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
                className="relative overflow-hidden bg-white border-2 border-pink-600 text-pink-600 font-bold py-3.5 px-8 rounded-full transition-all duration-300 group hover:bg-pink-600 hover:text-white hover:shadow-xl"
                onClick={() => navigate('/products')}
              >
                <span className="relative z-10 flex items-center justify-center">
                  Explore Full Collection
                </span>
                <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-pink-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                <div className="absolute inset-0 flex justify-center items-center">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full opacity-0"
                      initial={{ opacity: 0 }}
                      whileHover={{
                        opacity: [0, 1, 0],
                        scale: [0, 2, 0],
                        transition: { duration: 0.8, delay: i * 0.2 },
                      }}
                      style={{
                        top: `${20 + i * 20}%`,
                        left: `${30 + i * 20}%`,
                      }}
                    />
                  ))}
                </div>
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </section>

<section className="py-16 bg-gradient-to-b from-white to-pink-50">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Crystal Beauty</h2>
      <div className="w-20 h-1 bg-pink-600 mx-auto mb-4"></div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Our commitment to quality and your skin's health
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        { 
          icon: (
            <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          ), 
          title: "Premium Ingredients", 
          description: "Harnessing the power of genuine crystals and natural botanicals for maximum efficacy and radiant skin." 
        },
        { 
          icon: (
            <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ), 
          title: "Clean Formula", 
          description: "Free from parabens, sulfates, synthetic fragrances, and other harmful chemicals for pure skincare." 
        },
        { 
          icon: (
            <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ), 
          title: "Visible Results", 
          description: "Clinically proven to enhance skin's natural radiance with consistent use and daily application." 
        }
      ].map((benefit, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative"
        >
       
          <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          
          <div className="relative bg-white p-8 rounded-lg flex flex-col items-center text-center border
           border-gray-100 group-hover:border-pink-100 transition-all duration-300 h-full">
        
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-pink-200 opacity-60"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-pink-200 opacity-60"></div>
            
            <div className="mb-6 p-4 rounded-full bg-pink-600 shadow-sm group-hover:shadow-md transition-all duration-300">
              {benefit.icon}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 relative">
              {benefit.title}
         
              <span className="absolute left-1/2 -bottom-2 w-10 h-0.5 bg-pink-600 -translate-x-1/2"></span>
            </h3>
            
            <p className="text-gray-600 leading-relaxed h-14 overflow-hidden">
              {benefit.description}
            </p>
            
            <div className="mt-6 w-12 h-0.5 bg-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
  
<section className="py-16 bg-gradient-to-b from-white to-pink-50">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Hear From Our Community</h2>
      <div className="w-20 h-1 bg-pink-600 mx-auto mb-4"></div>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Real stories from people who have experienced the difference our products make
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
      {[
        {
          quote: "The Rose Quartz serum transformed my skin in just two weeks! I've never received so many compliments.",
          author: "Senulya Perera",
          role: "Skincare Enthusiast"
        },
        {
          quote: "As someone with sensitive skin, I'm amazed at how gentle yet effective these products are. Worth every penny!",
          author: "Devni Vihara",
          role: "Beauty Blogger"
        },
        {
          quote: "The Clear Quartz collection gave me back my youthful skin. My skin has never looked better!",
          author: "Adithya Perera",
          role: "Makeup Artist"
        }
      ].map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="group relative"
        >
        
          <div className="relative bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border-2 border-transparent group-hover:border-pink-100 h-full flex flex-col overflow-hidden">
            
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-pink-100 opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-pink-200 opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
           
            <div className="flex justify-center mb-6">
              <div className="relative w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-300">
                <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="flex-grow mb-6 relative z-10">
              <p className="text-gray-700 text-lg italic text-center">"{testimonial.quote}"</p>
            </div>
            
            <div className="mt-auto text-center relative z-10">
              <div className="w-16 h-0.5 bg-pink-300 mx-auto mb-4"></div>
              <p className="font-semibold text-pink-700">{testimonial.author}</p>
              <p className="text-sm text-gray-500 mt-1">{testimonial.role}</p>
            </div>
            
            <div className="absolute inset-0 rounded-2xl border-2 border-pink-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
        </motion.div>
      ))}
    </div>
   
  </div>
</section>

              <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-pink-50">
                <div className="container mx-auto px-4 sm:px-6">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto"
                  >
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg sm:shadow-xl">
                      <div className="absolute inset-0 z-0 opacity-10">
                        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-pink-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-pink-300 rounded-full translate-x-1/2 translate-y-1/2"></div>
                      </div>

                      <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-16">
                        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
                          <div className="lg:w-2/3">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                              Ready to Transform Your <span className="text-pink-600">Skin</span> Today
                            </h2>
                            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                              Join thousands who've already found their ideal skincare through our platform.
                            </p>
                            
                            <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
                              {[
                                { value: "500+", label: "Happy Customers" },
                                { value: "50+", label: "Beauty Products" },
                                { value: "98%", label: "Satisfaction Rate" }
                              ].map((stat, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full"></div>
                                  <span className="font-medium text-gray-700 text-xs sm:text-sm">
                                    <span className="text-pink-600">{stat.value}</span> {stat.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="lg:w-1/3 w-full">
                            <div className="space-y-3 sm:space-y-4">
                              <button
                                onClick={() => navigate('/products')}
                                className="block w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg text-center text-sm sm:text-base"
                              >
                                Shop Now
                              </button>
                              <button
                                onClick={() => navigate('/about')}
                                className="block w-full bg-white border-2 border-pink-600 hover:bg-pink-50 text-pink-600 font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 text-center text-sm sm:text-base"
                              >
                                Learn More
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                          <p className="text-xs sm:text-sm text-gray-500">
                            Trusted by skincare enthusiasts worldwide
                          </p>
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            {["diamond", "crystal", "natural"].map((icon, i) => (
                              <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-50 rounded-lg flex items-center justify-center text-pink-600">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ))}
                          </div>
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