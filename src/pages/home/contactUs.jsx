import { motion } from 'framer-motion';
import { IoMdMail, IoMdPin } from 'react-icons/io';
import { FiPhone } from 'react-icons/fi';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('_replyto', formData.email);
      formDataToSend.append('_subject', `New Contact Form Submission: ${formData.subject}`);

      const response = await fetch('https://formsubmit.co/ajax/akeshanawanjali23@gmail.com', {
        method: 'POST',
        body: formDataToSend,
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Try to parse as JSON, but fallback to text if needed
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
      
        data = { success: "true" };
      }

      if (data.success === "true") {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-gradient-to-r from-pink-600 to-pink-700 overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-xl text-pink-100 max-w-2xl mx-auto">
              We'd love to hear from you
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 max-w-6xl mx-auto">
         
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <div className="w-20 h-1 bg-pink-600 mb-6"></div>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-200">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                  Something went wrong. Please try again later.
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2 font-medium">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    placeholder="What's this about?"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2 font-medium">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message"
                    rows="5" 
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 bg-white p-8 rounded-xl shadow-lg border border-pink-100"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              <div className="w-20 h-1 bg-pink-600 mb-6"></div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-pink-600 p-3 rounded-full mr-4 flex-shrink-0">
                    <IoMdPin className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Our Location</h3>
                    <p className="text-gray-600">B11, Deens Road, Maradana, Sri Lanka</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-600 p-3 rounded-full mr-4 flex-shrink-0">
                    <IoMdMail className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">info@crystalbeauty.com</p>
                    <p className="text-gray-600">support@crystalbeauty.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-pink-600 p-3 rounded-full mr-4 flex-shrink-0">
                    <FiPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">011 222 3333</p>
                    <p className="text-gray-600">Mon-Fri: 9am - 6pm</p>
                  </div>
                </div>
                
                <div className="pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-pink-100 hover:bg-pink-600 text-pink-600 hover:text-white p-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
                      <FaFacebook className="text-xl" />
                    </a>
                    <a href="#" className="bg-pink-100 hover:bg-pink-600 text-pink-600 hover:text-white p-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
                      <FaInstagram className="text-xl" />
                    </a>
                    <a href="#" className="bg-pink-100 hover:bg-pink-600 text-pink-600 hover:text-white p-3 rounded-full transition-all duration-300 shadow-sm hover:shadow-md">
                      <FaTwitter className="text-xl" />
                    </a>
                  </div>
                </div>
              </div>
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
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Our Store</h2>
            <div className="w-20 h-1 bg-pink-600 mx-auto mb-4"></div>
          </motion.div>
          
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-pink-100">
            <div className="h-96 w-full bg-pink-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoMdPin className="text-white text-2xl" />
                </div>
                <p className="text-gray-600 font-medium">UPDATE SOON !</p>
                <p className="text-gray-500 text-sm mt-2">B11, Deens Road, Maradana, Sri Lanka</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-pink-600 to-pink-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Have More Questions?</h2>
            <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
              Our customer care team is always ready to assist you
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white hover:bg-pink-50 text-pink-600 font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Contact Support
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}