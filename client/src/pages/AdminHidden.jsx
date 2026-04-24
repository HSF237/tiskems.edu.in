import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'
import { useAuth } from '../context/AuthContext'

const AdminHidden = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // Gallery State
  const [galleryLink, setGalleryLink] = useState('')
  const [galleryTitle, setGalleryTitle] = useState('')

  // TC State
  const [tcFile, setTCFile] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [tcClass, setTCClass] = useState('')
  const [admissionNo, setAdmissionNo] = useState('')

  const addGallery = async () => {
    if (!galleryLink || !galleryTitle) return toast.error('Please enter link and title')
    setLoading(true)
    try {
      await addDoc(collection(db, 'gallery'), {
        title: galleryTitle,
        filePath: galleryLink,
        category: 'general',
        createdAt: serverTimestamp()
      })
      setGalleryLink('')
      setGalleryTitle('')
      toast.success('Gallery Image Added to Database')
    } catch (error) {
      toast.error('Failed to add to database')
    } finally {
      setLoading(false)
    }
  }

  const addTC = async () => {
    if (!tcFile || !studentName || !admissionNo) {
      return toast.error('Please provide student name, admission number and select a TC PDF')
    }
    setLoading(true)
    try {
      // Upload PDF to Firebase Storage
      const storageRef = ref(storage, `tc_files/${Date.now()}_${tcFile.name}`)
      const snapshot = await uploadBytes(storageRef, tcFile)
      const fileUrl = await getDownloadURL(snapshot.ref)

      // Save TC record to Firestore
      await addDoc(collection(db, 'transferCertificates'), {
        studentName,
        admissionNumber: admissionNo,
        class: tcClass || 'N/A',
        link: fileUrl,
        createdAt: serverTimestamp()
      })

      setTCFile(null)
      setStudentName('')
      setTCClass('')
      setAdmissionNo('')
      toast.success('TC file uploaded to database')
    } catch (error) {
      toast.error('Failed to upload TC')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="pt-24 min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary">Professional Staff Admin</h1>
            <p className="text-gray-500 mt-2">Upload Google Drive links directly to the school database</p>

            {!user || user.role !== 'admin' ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-6 mt-6 text-left">
                <p className="text-red-700 font-semibold">Access Denied</p>
                <p className="text-red-600 text-sm mt-1">
                  You must be logged in as an <strong>Admin</strong> to save changes.
                </p>
                <a href="/login" className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-700 transition-all">
                  Click here to Login
                </a>
              </div>
            ) : (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4 text-left">
                <p className="text-green-700 text-sm">
                  <strong>Authorized:</strong> You can now save updates globally.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-12">
            {/* Gallery Section */}
            <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                📸 Add Gallery Image
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={galleryTitle}
                  onChange={(e) => setGalleryTitle(e.target.value)}
                  placeholder="Image Title (e.g. Science Fair 2024)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                />
                <input
                  type="text"
                  value={galleryLink}
                  onChange={(e) => setGalleryLink(e.target.value)}
                  placeholder="Paste Google Drive Image Link"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                />
                <button
                  disabled={loading}
                  onClick={addGallery}
                  className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Save to Gallery'}
                </button>
              </div>
            </section>

            {/* TC Section */}
            <section className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                📄 Add TC File
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                />
                <input
                  type="text"
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                  placeholder="Admission Number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                />
              </div>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setTCFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
                />
                <p className="text-xs text-gray-500">
                  Upload the signed TC PDF (max 5MB). It will be stored permanently in the system.
                </p>
                <button
                  disabled={loading}
                  onClick={addTC}
                  className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-accent/90 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload TC File'}
                </button>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminHidden
