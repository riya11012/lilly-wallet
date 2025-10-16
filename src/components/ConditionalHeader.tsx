'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ConditionalHeader() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }
  
  // Hide header on login page
  if (pathname === '/login') {
    return null
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-red-600 text-2xl font-[cursive] italic">Lilly</h1>
              <span className="text-gray-600 text-sm">Lilly Clinical Resource Card Management</span>
            </div>
            <nav className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Clinical Trials</a>
              <a href="#" className="text-red-600 font-medium">Users</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Josh Grey</p>
              <p className="text-xs text-gray-500">jane.grey@eversana.com</p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
