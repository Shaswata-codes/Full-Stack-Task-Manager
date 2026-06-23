import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiCheckSquare } from 'react-icons/fi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [currentHash, setCurrentHash] = useState(window.location.hash)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser({ name: 'User' })
      }
    }

    const handleHashChange = () => {
      setCurrentHash(window.location.hash)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsOpen(false)
    navigate('/login')
  }

  const handleNavClick = (path, label, e) => {
    if (label === 'Tasks') {
      e.preventDefault()
      setIsOpen(false)
      if (window.location.pathname === '/') {
        document.getElementById('tasks-section')?.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', '#tasks-section')
        // Force state update since history.pushState doesn't trigger hashchange event automatically
        setCurrentHash('#tasks-section')
      } else {
        navigate('/#tasks-section')
      }
    } else {
      setIsOpen(false)
      setCurrentHash('')
    }
  }

  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/#tasks-section', label: 'Tasks' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/teams', label: 'Teams' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-gray-900">
              <FiCheckSquare className="w-6 h-6 text-indigo-600" />
              <span>TaskSync</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, link.label, e)}
                className={({ isActive }) => {
                  const isLinkActive = link.label === 'Tasks'
                    ? currentHash === '#tasks-section'
                    : isActive && currentHash !== '#tasks-section';
                  return `text-sm font-medium transition-colors duration-150 ${
                    isLinkActive ? 'text-indigo-600 font-semibold' : 'text-gray-600 hover:text-indigo-600'
                  }`;
                }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 hover:text-rose-600 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer"
            >
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={(e) => handleNavClick(link.path, link.label, e)}
              className={({ isActive }) => {
                const isLinkActive = link.label === 'Tasks'
                  ? currentHash === '#tasks-section'
                  : isActive && currentHash !== '#tasks-section';
                return `block px-3 py-2 rounded-md text-base font-medium ${
                  isLinkActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`;
              }}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="border-t border-gray-100 my-2 pt-2">
            {user ? (
              <div className="px-3 py-2 space-y-2">
                <p className="text-sm text-gray-700">Hello, {user.name}</p>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-sm font-medium text-gray-600 hover:text-rose-600 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
