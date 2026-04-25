import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { FaRupeeSign, FaCreditCard, FaCheckCircle, FaFileDownload } from 'react-icons/fa'

const Fees = () => {
  const { user } = useAuth()
  const [feeStructures, setFeeStructures] = useState([])
  const [payments, setPayments] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeeStructures()
    fetchPaymentHistory()
  }, [])

  const fetchFeeStructures = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'feeStructures'))
      const fees = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
      setFeeStructures(fees)
      if (user?.class) {
        setSelectedClass(user.class)
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      if (!user?.uid) return
      const q = query(
        collection(db, 'payments'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const paymentList = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
      setPayments(paymentList)
    } catch (error) {
      console.error('Error fetching payment history:', error)
    }
  }

  const handlePayment = async (feeStructure) => {
    try {
      // Record payment intent in Firestore
      await addDoc(collection(db, 'payments'), {
        userId: user?.uid,
        userName: user?.name || user?.email,
        feeClass: feeStructure.class,
        amount: feeStructure.totalFee,
        status: 'pending',
        createdAt: serverTimestamp()
      })

      toast.success('Payment recorded! Contact school office to complete payment.')
      fetchPaymentHistory()
    } catch (error) {
      toast.error('Failed to record payment')
    }
  }


  const selectedFee = feeStructures.find(f => f.class === selectedClass)

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
          className="section-head"
        >
          <h2>Fee Payment</h2>
          <div className="divider"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Fee Structure */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Fee Structure</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-primary mb-2">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input-field"
              >
                <option value="">Select Class</option>
                {feeStructures.map((fee) => (
                  <option key={fee._id} value={fee.class}>{fee.class}</option>
                ))}
              </select>
            </div>

            {selectedFee && (
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Tuition Fee</span>
                  <span className="font-semibold">₹{selectedFee.tuitionFee}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Development Fee</span>
                  <span className="font-semibold">₹{selectedFee.developmentFee}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Library Fee</span>
                  <span className="font-semibold">₹{selectedFee.libraryFee}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Lab Fee</span>
                  <span className="font-semibold">₹{selectedFee.labFee}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Sports Fee</span>
                  <span className="font-semibold">₹{selectedFee.sportsFee}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Other Fee</span>
                  <span className="font-semibold">₹{selectedFee.otherFee}</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-primary font-bold text-lg">
                  <span>Total Fee</span>
                  <span className="text-accent">₹{selectedFee.totalFee}</span>
                </div>

                <button
                  onClick={() => handlePayment(selectedFee)}
                  className="w-full btn btn-accent mt-6"
                >
                  <FaCreditCard /> Pay Now
                </button>
              </div>
            )}
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Payment History</h3>
            
            {payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-primary">
                          {payment.feeStructureId?.class || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-accent">₹{payment.amount}</span>
                      {payment.status === 'completed' && payment.receiptPath && (
                        <a
                          href={payment.receiptUrl || payment.receiptPath || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-2"
                        >
                          <FaFileDownload /> Receipt
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600">
                <FaRupeeSign className="text-5xl mx-auto mb-4 text-gray-300" />
                <p>No payment history found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Fees
