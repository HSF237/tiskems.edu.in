import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { FaUserGraduate, FaBookOpen } from 'react-icons/fa'

const Teachers = () => {
  const [teachers, setTeachers] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeachers()
  }, [filter])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const teachersRef = collection(db, 'teachers')
      const q = filter !== 'all' 
        ? query(teachersRef, where('subject', '==', filter))
        : teachersRef
      
      const querySnapshot = await getDocs(q)
      const teachersList = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }))
      setTeachers(teachersList)
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setLoading(false)
    }
  }


  const subjects = ['all', 'Mathematics', 'Science', 'English', 'Computer Science', 'Social Studies', 'Hindi', 'Malayalam']

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-head"
        >
          <h2>Our Faculty</h2>
          <div className="divider"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Highly qualified and dedicated educators committed to student excellence
          </p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setFilter(subject)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === subject
                  ? 'bg-accent text-white shadow-lg'
                  : 'bg-white text-primary border-2 border-gray-200 hover:border-accent'
              }`}
            >
              {subject === 'all' ? 'All Subjects' : subject}
            </button>
          ))}
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teachers.length > 0 ? (
            teachers.map((teacher, index) => (
              <motion.div
                key={teacher._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card text-center group"
              >
                <div className="relative mb-6">
                  <img
                    src={teacher.profileImage || `https://picsum.photos/seed/${teacher._id}/200/200`}
                    alt={teacher.name}
                    className="w-32 h-32 rounded-full mx-auto border-4 border-accent-light group-hover:border-gold transition-all object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-primary mb-2">{teacher.name}</h4>
                <div className="text-accent font-semibold text-sm uppercase mb-2 tracking-wide">
                  {teacher.subject || 'Teacher'}
                </div>
                {teacher.qualification && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm mb-1">
                    <FaUserGraduate />
                    <span>{teacher.qualification}</span>
                  </div>
                )}
                {teacher.experience > 0 && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                    <FaBookOpen />
                    <span>{teacher.experience}+ Years Experience</span>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No teachers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Teachers

