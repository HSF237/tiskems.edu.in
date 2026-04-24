import { useState } from 'react'
import { motion } from 'framer-motion'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '../config/firebase'
import toast from 'react-hot-toast'
import { FaUpload, FaFilePdf, FaCheckCircle } from 'react-icons/fa'

const Admissions = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: 'male',
    classApplied: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    previousSchool: ''
  })
  const [files, setFiles] = useState({
    birthCertificate: null,
    previousMarksheet: null,
    photo: null,
    aadhar: null
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const fileUrls = {}
      
      // Upload files to Firebase Storage
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          const storageRef = ref(storage, `admissions/${Date.now()}_${file.name}`)
          const snapshot = await uploadBytes(storageRef, file)
          fileUrls[key] = await getDownloadURL(snapshot.ref)
        }
      }

      // Save application data to Firestore
      await addDoc(collection(db, 'admissions'), {
        ...formData,
        ...fileUrls,
        status: 'pending',
        submittedAt: serverTimestamp()
      })

      toast.success('Admission application submitted successfully!')
      setFormData({
        studentName: '', dateOfBirth: '', gender: 'male', classApplied: '',
        parentName: '', parentEmail: '', parentPhone: '', address: '', previousSchool: ''
      })
      setFiles({ birthCertificate: null, previousMarksheet: null, photo: null, aadhar: null })
    } catch (error) {
      console.error("Submission error:", error)
      toast.error('Failed to submit application')
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-head"
        >
          <h2>Online Admission</h2>
          <div className="divider"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Fill in the details below to apply for admission
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Student Name *</label>
                <input
                  type="text"
                  name="studentName"
                  required
                  value={formData.studentName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Gender *</label>
                <select
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Class Applied *</label>
                <select
                  name="classApplied"
                  required
                  value={formData.classApplied}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Class</option>
                  <option value="Nursery">Nursery</option>
                  <option value="LKG">LKG</option>
                  <option value="UKG">UKG</option>
                  <option value="Class I">Class I</option>
                  <option value="Class II">Class II</option>
                  <option value="Class III">Class III</option>
                  <option value="Class IV">Class IV</option>
                  <option value="Class V">Class V</option>
                  <option value="Class VI">Class VI</option>
                  <option value="Class VII">Class VII</option>
                  <option value="Class VIII">Class VIII</option>
                  <option value="Class IX">Class IX</option>
                  <option value="Class X">Class X</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-primary mb-4">Parent/Guardian Details</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Parent Name *</label>
                  <input
                    type="text"
                    name="parentName"
                    required
                    value={formData.parentName}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Parent Email *</label>
                  <input
                    type="email"
                    name="parentEmail"
                    required
                    value={formData.parentEmail}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Parent Phone *</label>
                  <input
                    type="tel"
                    name="parentPhone"
                    required
                    value={formData.parentPhone}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">Previous School</label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-primary mb-2">Address *</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                ></textarea>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-primary mb-4">Documents Upload</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    <FaFilePdf className="inline mr-2" />
                    Birth Certificate
                  </label>
                  <input
                    type="file"
                    name="birthCertificate"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    <FaFilePdf className="inline mr-2" />
                    Previous Marksheet
                  </label>
                  <input
                    type="file"
                    name="previousMarksheet"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    <FaUpload className="inline mr-2" />
                    Student Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-2">
                    <FaFilePdf className="inline mr-2" />
                    Aadhar Card
                  </label>
                  <input
                    type="file"
                    name="aadhar"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn btn-gold"
            >
              {submitting ? 'Submitting...' : (
                <>
                  <FaCheckCircle /> Submit Application
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Admissions

