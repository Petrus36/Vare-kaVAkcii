'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-white/98 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 group relative"
          >
            <div className="relative">
              <span className="text-4xl group-hover:rotate-12 transition-transform duration-300 inline-block">
                🍳
              </span>
              <span className="absolute inset-0 text-4xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300">
                🍳
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-primary-800 transition-all duration-300">
                Vareška v Akcii
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Najlepšie recepty
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-2">
            <Link 
              href="/" 
              className={`relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isActive('/')
                  ? 'text-primary-700 bg-primary-50 shadow-sm'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2">📖</span>
                Recepty
              </span>
              {isActive('/') && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-full"></span>
              )}
            </Link>
            
            <Link 
              href="/about" 
              className={`relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isActive('/about')
                  ? 'text-primary-700 bg-primary-50 shadow-sm'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2">👨‍🍳</span>
                O mne
              </span>
              {isActive('/about') && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-full"></span>
              )}
            </Link>
            
            <Link 
              href="/admin" 
              className={`relative px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                isActive('/admin')
                  ? 'text-primary-700 bg-primary-50 shadow-sm'
                  : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50/50'
              }`}
            >
              <span className="relative z-10 flex items-center">
                <span className="mr-2">⚙️</span>
                Admin
              </span>
              {isActive('/admin') && (
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-full"></span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

