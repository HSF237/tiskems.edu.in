import { createContext, useState, useEffect, useContext } from 'react'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...userDoc.data() })
        } else {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Login successful!')
      return { success: true, user: result.user }
    } catch (error) {
      toast.error(error.message || 'Login failed')
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    const { email, password, name, role, ...otherData } = userData
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        name,
        email,
        role: role || 'parent',
        ...otherData,
        createdAt: new Date().toISOString()
      })

      toast.success('Registration successful!')
      return { success: true, user: result.user }
    } catch (error) {
      toast.error(error.message || 'Registration failed')
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


