import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLeaf, FaFlask, FaGem} from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
     
      <section className="relative h-[40vh] bg-gradient-to-r from-pink-600 to-pink-700 overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Story</h1>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              The journey of Crystal Beauty and our passion for radiant skin
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              className="md:w-1/2 flex justify-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative w-64 h-64 bg-pink-50 rounded-full p-4 
              shadow-lg flex items-center justify-center border border-pink-100">
                <img 
                  src="/cbclgo.png" 
                  alt="Crystal Beauty Logo" 
                  className="w-full h-auto object-contain mt-0"
                />
                <div className="absolute inset-0 border-2 border-pink-200 rounded-full opacity-30"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <div className="w-20 h-1 bg-pink-600 mb-6"></div>
              <p className="text-gray-600 mb-6">
                At Crystal Beauty, we believe in harnessing the natural power of crystals combined with 
                scientifically-proven ingredients to create skincare that truly transforms. Our mission 
                is to help you reveal your most radiant, healthy skin.
              </p>
              <p className="text-gray-600 mb-8">
                Every product is crafted with intention, blending ancient wisdom with modern dermatology 
                to deliver visible results you can feel proud of.
              </p>
              <Link 
                to="/products" 
                className="inline-block bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Discover Our Products
              </Link>
            </motion.div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: <FaLeaf className="w-12 h-12" />,
                title: "Natural Purity", 
                description: "We use only the cleanest, most effective natural ingredients combined with responsibly-sourced crystals." 
              },
              { 
                icon: <FaFlask className="w-12 h-12" />,
                title: "Visible Results", 
                description: "Our products are clinically tested to deliver real, measurable improvements to your skin's health." 
              },
              { 
                icon: <FaGem className="w-12 h-12" />,
                title: "Luxury Experience", 
                description: "From packaging to formulation, every detail is crafted to provide a sensorial, luxurious experience." 
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-pink-100 hover:border-pink-200 group"
              >
                <div className="flex justify-center text-pink-600 mb-4 group-hover:scale-110 transition-transform duration-300">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet Our Founders</h2>
            <div className="w-20 h-1 bg-pink-600 mx-auto mb-3"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm">
              The passionate minds behind Crystal Beauty
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              { 
                image: "/doc1.jpg",
                name: "Dr. Shanaya Perera",
                role: "Chief Dermatologist",
                bio: "Board-certified dermatologist with 15 years of experience in cosmetic chemistry and natural skincare formulations."
              },
              { 
                image: "/doc2.jpeg",
                name: "Rashi Pereis",
                role: "Crystal Healing Expert",
                bio: "Master herbalist and crystal therapy practitioner who bridges ancient wisdom with modern skincare science."
              }
            ].map((founder, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center bg-pink-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="w-45 h-40 rounded-full bg-white p-1 shadow-inner mb-4 border border-pink-200">
                  <img 
                    src={founder.image} 
                    alt={founder.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{founder.name}</h3>
                <p className="text-pink-600 text-sm font-medium mb-3">{founder.role}</p>
                <p className="text-gray-600 text-sm">{founder.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-pink-600 to-pink-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Happy Customers" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "50+", label: "Products" },
              { number: "15", label: "Years of Excellence" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-pink-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  
      <section className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Begin Your Skincare Journey?</h2>
            <p className="text-gray-600 mb-8">
              Discover the transformative power of crystal-infused skincare
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg mx-2 mb-4"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="inline-block bg-white border-2 border-pink-600 hover:bg-pink-50 text-pink-600 font-bold py-3 px-8 rounded-full transition-all duration-300 mx-2"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}