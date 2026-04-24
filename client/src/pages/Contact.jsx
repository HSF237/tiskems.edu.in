import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp, FaPaperPlane } from 'react-icons/fa'
import toast from 'react-hot-toast'


const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // WhatsApp integration
    const whatsappNumber = '914972812349'
    const message = `Hello TISK School Administration,%0A%0ANew Website Enquiry:%0A-----------------------%0A*Name:* ${formData.name}%0A*Phone:* ${formData.phone}%0A*Subject:* ${formData.subject}%0A%0A*Message:*%0A${formData.message}`
    const url = `https://wa.me/${whatsappNumber}?text=${message}`
    
    window.open(url, '_blank')
    toast.success('Opening WhatsApp...')
    
    setFormData({ name: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-head"
        >
          <h2>Contact Us</h2>
          <div className="divider"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="card mb-6">
              <h3 className="text-2xl font-bold text-primary mb-6">Get In Touch</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <FaMapMarkerAlt className="text-accent text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary mb-1">Address</p>
                    <p className="text-gray-600">
                      CP X/390, Kovvapuram (PO), Kunhimangalam,<br />
                      Kannur, Kerala – 670309
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaPhone className="text-accent text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary mb-1">Phone</p>
                    <a href="tel:+914972812349" className="text-accent font-semibold hover:underline">
                      +91 497 281 2349
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FaEnvelope className="text-accent text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-primary mb-1">Email</p>
                    <a href="mailto:tiskprincipal@yahoo.com" className="text-accent font-semibold hover:underline">
                      tiskprincipal@yahoo.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Placeholder */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-64 rounded-2xl flex items-center justify-center border-2 border-gray-200">
              <div className="text-center">
                <FaMapMarkerAlt className="text-accent text-4xl mx-auto mb-3" />
                <p className="text-gray-600 font-semibold">Google Map Coming Soon</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2">
                <FaWhatsapp className="inline-block mr-2 text-green-500" />
                Send Message
              </h3>
              <p className="text-gray-600 text-sm">
                Fill the form and send your message directly via WhatsApp
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="Your mobile number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  Subject / Purpose
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Admission Enquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn btn-accent bg-green-500 hover:bg-green-600"
              >
                <FaPaperPlane /> Send on WhatsApp
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact

