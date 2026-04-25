import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaGraduationCap, FaBars, FaTimes, FaUser } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-accent transition-colors">
            <FaGraduationCap className="text-gold" />
            <span>TISK EMS</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/academics" className="nav-link">Academics</Link>
            <Link to="/teachers" className="nav-link">Faculty</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
            <Link to="/certificates" className="nav-link">Certificates</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/admissions" className="nav-link">Admissions</Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full hover:bg-accent-light transition-colors">
                  <FaUser />
                  <span>{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded-t-lg">Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-lg">
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-accent">Login</Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-2xl text-primary"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t">
            <Link to="/" className="block py-2 nav-link">Home</Link>
            <Link to="/about" className="block py-2 nav-link">About</Link>
            <Link to="/academics" className="block py-2 nav-link">Academics</Link>
            <Link to="/teachers" className="block py-2 nav-link">Faculty</Link>
            <Link to="/gallery" className="block py-2 nav-link" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link to="/certificates" className="block py-2 nav-link" onClick={() => setIsOpen(false)}>Certificates</Link>
            <Link to="/contact" className="block py-2 nav-link" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/admissions" className="block py-2 nav-link">Admissions</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block py-2 nav-link">Dashboard</Link>
                <button onClick={handleLogout} className="block py-2 nav-link">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block py-2 nav-link">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

