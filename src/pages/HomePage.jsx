import { Route, Routes ,useNavigate } from 'react-router-dom';
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

export default function HomePage() {
   const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <>
    <section className="relative h-[45vh] md:h-[68vh] bg-white overflow-hidden">
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
          description: "Experience the transformative power of diamond particles",
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
              <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 whitespace-nowrap">
                {slide.title}
              </h1>
              <h2 className="text-yellow-500 text-xl sm:text-3xl md:text-5xl lg:text-5xl font-bold mb-4 md:mb-6">
                {slide.highlight}
              </h2>
              
              <p className="text-base md:text-xl text-gray-600 mb-6 md:mb-8">
                {slide.description}
              </p>
              
              <motion.button 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 md:py-4 md:px-10 rounded-full transition-all duration-300"
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
    [&>.swiper-pagination-bullet]:bg-slate-900
    [&>.swiper-pagination-bullet]:opacity-50 
    [&>.swiper-pagination-bullet]:w-2 
    [&>.swiper-pagination-bullet]:h-2 
    [&>.swiper-pagination-bullet]:transition-opacity 
    [&>.swiper-pagination-bullet]:duration-300
    [&>.swiper-pagination-bullet-active]:!opacity-100">
  </div>
</section>
<section className="py-16 bg-slate-900">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl font-bold text-white mb-4">Crystal Beauty Clear Collections</h2>
      <div className="w-20 h-1 bg-yellow-500 mx-auto mb-4"></div>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Pure crystal-infused formulations for radiant, clarified skin
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {[
        { 
          name: "Clarifying Ritual Set", 
          crystal: "Clear Quartz",
          description: "Complete regimen to purify skin", 
          image: "/set3.jpg",
          benefits: [
            "Gently removes impurities",
            "Reduces appearance of pores",
            "Enhances skin clarity"
          ]
        },
        { 
          name: "Crystal Glow Serum", 
          crystal: "Diamond Dust",
          description: "Illuminating treatment for luminous skin", 
          image: "/crset.jpg",
          benefits: [
            "Boosts radiance",
            "Smooths texture",
            "Protects from pollution"
          ]
        },
        { 
          name: "Overnight Renewal", 
          crystal: "Moonstone",
          description: "Nighttime repair with crystal energy", 
          image: "/sus22.jpg",
          benefits: [
            "Intensive hydration",
            "Supports natural renewal",
            "Calms skin overnight"
          ]
        }
      ].map((product, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group"
        >
          <div className="relative h-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700  transition-all duration-300">
            <div className="relative h-60 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
                {product.crystal}
              </div>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white">{product.name}</h3>
              </div>
              <p className="text-gray-300 text-sm mb-5">{product.description}</p>
              
              <div className="mb-6">

                <ul className="space-y-2">
                  {product.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-gray-400 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                className="w-full py-3 bg-gray-700 hover:bg-yellow-500 text-white hover:text-black font-medium rounded-lg transition-colors duration-300 flex items-center justify-center"
                onClick={() => navigate('/products')}
              >
                <span>Discover</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>
           
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
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-white  p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center border border-yellow-50 hover:border-yellow-400/30 "
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
                        author: "Senulya Perera",
                       
                      },
                      {
                        quote: "As someone with sensitive skin, I'm amazed at how gentle yet effective these products are. Worth every penny!",
                        author: "Devni Vihara",
                        
                      },
                      {
                        quote: "The Clear Quartz collection gave me back my youthful skin, and I'm still amazed at how much it glow. My skin has never looked better!",
                        author: "Adithya Perera",
                       
                      }
                    ].map((testimonial, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-slate-600/30 hover:border-yellow-400/30"
                      >
                        <div className="text-yellow-400 text-2xl mb-4">{testimonial.rating}</div>
                        <p className="text-lg text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                        <p className="font-medium text-yellow-400">— {testimonial.author}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

           
              <section className="py-16 bg-white">
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
                  onClick={() => navigate('/products')}
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