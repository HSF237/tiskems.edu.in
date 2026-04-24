import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { FaFilePdf, FaDownload, FaExternalLinkAlt } from 'react-icons/fa'

const TC = () => {
  const { user } = useAuth()
  const [tcs, setTCs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchAdmission, setSearchAdmission] = useState('')

  useEffect(() => {
    fetchTCs()
  }, [])

  const fetchTCs = async () => {
    try {
      const q = query(collection(db, 'transferCertificates'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const tcList = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
      setTCs(tcList)
    } catch (error) {
      console.error('Error fetching TCs:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadTC = (tc) => {
    if (tc.link || tc.fileUrl) {
      window.open(tc.link || tc.fileUrl, '_blank')
    } else {
      toast.error('No document available for download')
    }
  }


  const filteredTCs = tcs.filter((tc) => {
    if (!searchAdmission.trim()) return true
    return tc.admissionNumber?.toLowerCase().includes(searchAdmission.trim().toLowerCase())
  })

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
          <h2 className="text-4xl font-bold text-primary">Transfer Certificates</h2>
          <div className="divider mx-auto w-24 h-1 bg-accent my-4"></div>
          <p className="text-gray-600 mt-4 text-lg">
            View and download official transfer certificates. Verified and stored globally.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            value={searchAdmission}
            onChange={(e) => setSearchAdmission(e.target.value)}
            placeholder="Search by Admission Number"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/60"
          />
        </div>

        {filteredTCs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTCs.map((tc) => (
              <motion.div
                key={tc._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100 flex flex-col items-center text-center transition-all"
              >
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 text-accent">
                  <FaFilePdf size={32} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{tc.studentName}</h3>
                <div className="space-y-1 mb-6 text-sm text-gray-500">
                  <p>TC Number: <span className="font-semibold text-gray-700">{tc.tcNumber}</span></p>
                  <p>Class: <span className="font-semibold text-gray-700">{tc.class}</span></p>
                  <p>Date: <span className="font-semibold text-gray-700">{new Date(tc.dateOfLeaving).toLocaleDateString()}</span></p>
                </div>

                {tc.link ? (
                  <a
                    href={tc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-accent text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-accent-light transition-all shadow-md active:scale-95"
                  >
                    <FaExternalLinkAlt /> View Document
                  </a>
                ) : (
                  <button
                    onClick={() => downloadTC(tc._id)}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-primary-light transition-all shadow-md active:scale-95"
                  >
                    <FaDownload /> Download PDF
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
            <FaFilePdf className="text-6xl text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchAdmission.trim()
                ? 'No transfer certificates found for this admission number.'
                : 'No transfer certificates found for your account.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TC
