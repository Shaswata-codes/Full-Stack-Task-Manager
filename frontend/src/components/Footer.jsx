import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Copyright */}
        <div className="text-sm text-gray-500">
          &copy; {currentYear} TaskSync. All rights reserved.
        </div>

        {/* Navigation Links */}
        <div className="flex gap-6 text-sm text-gray-500">
          <Link to="/privacy" className="hover:text-indigo-600 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-indigo-600 transition-colors">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition-colors">
            Contact
          </Link>
        </div>

      </div>
    </footer>
  )
}

export default Footer
