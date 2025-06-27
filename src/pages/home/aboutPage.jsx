import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <section className="relative h-[50vh]  bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-opacity-50 bg-black"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Story</h1>
            <div className="w-20 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The journey of Crystal Beauty and our passion for radiant skin
            </p>
          </motion.div>
        </div>
      </section>

    
<section className="py-16 bg-white">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center gap-12">
      <motion.div 
        className="md:w-1/2 flex justify-center"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="relative w-64 h-64 bg-gray-50 rounded-full p-6 shadow-lg flex items-center justify-center">
          <img 
            src="/logo.png" 
            alt="Crystal Beauty Logo" 
            className="w-full h-auto object-contain"
          />
          <div className="absolute inset-0 border-2 border-yellow-400 rounded-full opacity-20"></div>
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
        <div className="w-20 h-1 bg-yellow-500 mb-6"></div>
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
          className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors duration-300"
        >
          Discover Our Products
        </Link>
      </motion.div>
    </div>
  </div>
</section>

      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800">
  <div className="container mx-auto px-6">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
      <div className="w-20 h-1 bg-yellow-500 mx-auto mb-4"></div>
      <p className="text-gray-300 max-w-2xl mx-auto">
        The principles that guide everything we do
      </p>
    </motion.div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {[
        { 
          icon: "🌿",
          title: "Natural Purity", 
          description: "We use only the cleanest, most effective natural ingredients combined with responsibly-sourced crystals." 
        },
        { 
          icon: "✨",
          title: "Visible Results", 
          description: "Our products are clinically tested to deliver real, measurable improvements to your skin's health." 
        },
        { 
          icon: "💎",
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
          className="bg-gradient-to-b from-slate-800 to-slate-700 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-slate-600/30 hover:border-yellow-400/30"
        >
          <div className="text-4xl mb-4">{value.icon}</div>
          <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
          <p className="text-gray-300">{value.description}</p>
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
      <div className="w-20 h-1 bg-yellow-500 mx-auto mb-3"></div>
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
          className="flex flex-col items-center text-center"
        >
          <img 
            src={founder.image} 
            alt={founder.name}
            className="w-40 h-40 rounded-full object-cover mb-4 shadow-md"
          />
          <h3 className="text-xl font-bold text-gray-900 mb-1">{founder.name}</h3>
          <p className="text-yellow-500 text-sm font-medium mb-3">{founder.role}</p>
          <p className="text-gray-600 text-sm">{founder.bio}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Skincare Journey?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Discover the transformative power of crystal-infused skincare
            </p>
            <Link
              to="/products"
              className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full transition-colors duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}