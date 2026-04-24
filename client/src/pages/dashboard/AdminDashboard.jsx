import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { FaUsers, FaGraduationCap, FaRupeeSign, FaFileAlt, FaChartLine } from 'react-icons/fa'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    admissions: 0,
    payments: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [studentsSnap, teachersSnap, admissionsSnap, paymentsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'teachers')),
        getDocs(collection(db, 'admissions')),
        getDocs(collection(db, 'payments'))
      ])
      setStats({
        students: studentsSnap.size,
        teachers: teachersSnap.size,
        admissions: admissionsSnap.size,
        payments: paymentsSnap.size
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }


  const statCards = [
    { icon: FaGraduationCap, label: 'Total Students', value: stats.students, color: 'bg-blue-500' },
    { icon: FaUsers, label: 'Teachers', value: stats.teachers, color: 'bg-green-500' },
    { icon: FaFileAlt, label: 'Pending Admissions', value: stats.admissions, color: 'bg-yellow-500' },
    { icon: FaRupeeSign, label: 'Total Revenue', value: `₹${stats.payments.toLocaleString()}`, color: 'bg-purple-500' },
  ]

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage school operations</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-full text-white`}>
                  <stat.icon className="text-2xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card cursor-pointer hover:shadow-xl transition-all"
          >
            <FaGraduationCap className="text-4xl text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Manage Students</h3>
            <p className="text-gray-600">View and manage student records</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card cursor-pointer hover:shadow-xl transition-all"
          >
            <FaUsers className="text-4xl text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Manage Teachers</h3>
            <p className="text-gray-600">Add, edit, or remove teachers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card cursor-pointer hover:shadow-xl transition-all"
          >
            <FaFileAlt className="text-4xl text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Admissions</h3>
            <p className="text-gray-600">Review and approve applications</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card cursor-pointer hover:shadow-xl transition-all"
          >
            <FaRupeeSign className="text-4xl text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Fee Management</h3>
            <p className="text-gray-600">View payments and generate reports</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card cursor-pointer hover:shadow-xl transition-all"
          >
            <FaFileAlt className="text-4xl text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Generate TC</h3>
            <p className="text-gray-600">Create transfer certificates</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card cursor-pointer hover:shadow-xl transition-all"
          >
            <FaChartLine className="text-4xl text-accent mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Reports</h3>
            <p className="text-gray-600">View analytics and reports</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

