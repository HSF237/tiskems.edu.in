import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase'
import { FaTimes, FaSearchPlus } from 'react-icons/fa'

const Gallery = () => {
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const galleryList = querySnapshot.docs.map(doc => {
        const item = { _id: doc.id, ...doc.data() }
        
        // Automatically convert Drive links to thumbnails for high quality display
        if (item.filePath && item.filePath.includes('drive.google.com')) {
          const id = item.filePath.split("/d/")[1]?.split("/")[0]
          return {
            ...item,
            displayPath: `https://drive.google.com/thumbnail?id=${id}&sz=w800`
          }
        }
        return {
          ...item,
          displayPath: item.filePath || item.url // handle both property names
        }
      })
      setItems(galleryList)
    } catch (error) {
      console.error('Error fetching gallery:', error)
      // Fallback if collection doesn't exist yet
      setItems([
        { _id: '1', displayPath: 'https://picsum.photos/seed/g1/800/600', title: 'Campus View', category: 'campus' },
        { _id: '2', displayPath: 'https://picsum.photos/seed/g2/800/600', title: 'Sports Day', category: 'sports' },
        { _id: '3', displayPath: 'https://picsum.photos/seed/g3/800/600', title: 'Science Fair', category: 'academics' },
      ])
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-head text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-primary">Campus Gallery</h2>
          <div className="divider mx-auto w-24 h-1 bg-accent my-4"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Glimpses of campus life, events, and student achievements. Professional database-driven display.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative h-72 rounded-3xl overflow-hidden cursor-pointer group shadow-lg"
              onClick={() => setSelectedItem(item)}
            >
              <img
                src={item.displayPath}
                alt={item.title || 'Gallery Image'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center">
                <FaSearchPlus className="text-white text-4xl mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform" />
                <h3 className="text-white font-bold text-xl">{item.title}</h3>
                <span className="text-accent text-sm mt-2 uppercase tracking-widest">{item.category}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Professional Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedItem.displayPath.replace('&sz=w800', '')} // Get full resolution
                alt={selectedItem.title || 'Gallery Image'}
                className="w-full h-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute -top-12 right-0 text-white text-4xl hover:text-accent transition-colors p-2"
              >
                <FaTimes />
              </button>
              {selectedItem.title && (
                <div className="absolute -bottom-16 left-0 right-0 text-white text-center">
                  <h3 className="text-2xl font-bold">{selectedItem.title}</h3>
                  <p className="text-gray-400 mt-1">{selectedItem.description}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Gallery
