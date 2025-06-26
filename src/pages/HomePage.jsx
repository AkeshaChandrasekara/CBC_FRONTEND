import { Route, Routes } from 'react-router-dom';
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

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
         <section className="relative h-[70vh] bg-white overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Swiper
                    modules={[Autoplay, EffectFade, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
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
                        title: "Illuminate Your Natural Beauty",
                        highlight: "Crystal Radiance",
                        description: "Discover our premium crystal-infused skincare collection",
                        buttonText: "Shop Now",
                        image: "/himage1.png" // Add your image path
                      },
                      {
                        title: "Pure Crystal Elegance",
                        highlight: "Luxurious Formulas",
                        description: "Experience the transformative power of nature's minerals",
                        buttonText: "Explore Collection",
                        image: "/hero-image-2.jpg" // Add your image path
                      },
                      {
                        title: "Reveal Your Inner Glow",
                        highlight: "Premium Skincare",
                        description: "Harness the energy of crystals for radiant skin",
                        buttonText: "Discover More",
                        image: "/hero-image-3.jpg" // Add your image path
                      }
                    ].map((slide, index) => (
                      <SwiperSlide key={index} className="h-full w-full">
                        <div className="container mx-auto h-full flex items-center px-6 relative z-10">
                          {/* Text Content */}
                          <motion.div 
                            className="w-full md:w-1/2 pr-0 md:pr-12"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                          >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                              {slide.title}
                              <br />
                              <span className="text-yellow-500">
                                {slide.highlight}
                              </span>
                            </h1>
                            
                            <p className="text-xl text-gray-600 mb-8">
                              {slide.description}
                            </p>
                            
                            <motion.button 
                              whileHover={{ 
                                scale: 1.05,
                                boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                              }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full transition-all duration-300"
                            >
                              {slide.buttonText}
                            </motion.button>
                          </motion.div>
                          
                          {/* Image Content */}
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
                  
                  {/* Custom Pagination */}
                
                </div>
              </section>

              {/* Updated Featured Collections */}
            {/* Simplified Collection Design */}
<section className="py-16 bg-slate-900">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <h2 className="text-3xl font-bold text-white mb-3">Our Signature Collections</h2>
      <div className="w-20 h-1 bg-yellow-500 mx-auto mb-3"></div>
      <p className="text-gray-400 max-w-2xl mx-auto text-sm">
        Carefully crafted formulations infused with the power of crystals
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        { 
          title: "Rose Quartz", 
          description: "Hydrating formulas that promote skin's  glow", 
          image: "/r1.jpg",
          features: ["Hydrating Serum", "Night Cream", "Facial Mist"]
        },
        { 
          title: "Amethyst", 
          description: "Detoxifying solutions for clear complexion", 
          image: "/amethyst-collection.jpg",
          features: ["Cleansing Oil", "Toner", "Detox Mask"]
        },
        { 
          title: "Clear Quartz", 
          description: "Revitalizing treatments for vibrant skin", 
          image: "/clear-quartz-collection.jpg",
          features: ["Eye Cream", "Day Serum", "Moisturizer"]
        }
      ].map((collection, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="bg-gray-800 rounded-lg overflow-hidden"
        >
          {/* Centered Product Image */}
          <div className="h-48 flex items-center justify-center p-4">
            <img 
              src={collection.image} 
              alt={collection.title}
              className="h-40 object-contain"
            />
          </div>
          
          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-2">{collection.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{collection.description}</p>
            
            <div className="space-y-2 mb-5">
              {collection.features.map((feature, i) => (
                <div key={i} className="flex items-center text-gray-400 text-xs">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
            
            <button className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-md transition-colors duration-300">
              View Collection
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

              {/* Updated Benefits Section */}
              <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Crystal Beauty</h2>
                    <div className="w-20 h-1 bg-yellow-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Our commitment to quality and your skin's health
                    </p>
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto border-color-gray-400">
                    {[
                      { 
                        icon: (
                          <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        ), 
                        title: "Premium Ingredients", 
                        description: "Harnessing the power of genuine crystals and natural botanicals for maximum efficacy." 
                      },
                      { 
                        icon: (
                          <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ), 
                        title: "Clean Formula", 
                        description: "Free from parabens, sulfates, synthetic fragrances, and other harmful chemicals." 
                      },
                      { 
                        icon: (
                          <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        ), 
                        title: "Visible Results", 
                        description: "Clinically proven to enhance skin's natural radiance with consistent use." 
                      }
                    ].map((benefit, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
                      >
                        <div className="mb-6 p-4 bg-yellow-50 rounded-full">
                          {benefit.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>


              {/* Testimonials Section */}
              <section className="py-16 bg-gray-900 text-white">
                <div className="container mx-auto px-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
                     <div className="w-20 h-1 bg-yellow-500 mx-auto mb-4"></div>
                    <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
                      Join thousands of satisfied customers who trust our products
                    </p>
                    
                  </motion.div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      {
                        quote: "The Rose Quartz serum transformed my skin in just two weeks! I've never received so many compliments.",
                        author: "Sarah M.",
                        rating: "★★★★★"
                      },
                      {
                        quote: "As someone with sensitive skin, I'm amazed at how gentle yet effective these products are. Worth every penny!",
                        author: "Jessica T.",
                        rating: "★★★★★"
                      },
                      {
                        quote: "The Clear Quartz collection gave me back my youthful glow. My skin has never looked better!",
                        author: "Michael R.",
                        rating: "★★★★★"
                      }
                    ].map((testimonial, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 p-8 rounded-xl"
                      >
                        <div className="text-yellow-400 text-2xl mb-4">{testimonial.rating}</div>
                        <p className="text-lg text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                        <p className="font-medium text-yellow-400">— {testimonial.author}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-16 bg-gradient-to-r from-yellow-500 to-yellow-400">
                <div className="container mx-auto px-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Skin?</h2>
                    <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
                      Join the Crystal Beauty revolution and experience the difference today
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300"
                    >
                      Shop All Products
                    </motion.button>
                  </motion.div>
                </div>
              </section>
            </>
          } />
          <Route path="/products" element={<ProductPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/shipping" element={<ShippingPage/>}/>   
          <Route path='/orders' element={<MyOrdersPage/>}/>      
          <Route path="/productInfo/:id" element={<ProductOverview/>} />
        </Routes>  
      </main>
      
      <Footer />
    </div>
  );
}