'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Lock, Loader2 } from 'lucide-react'
import { isAuthenticated } from '@/lib/userUtils'
import '../globals.css'

interface FormData {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [mounted, setMounted] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Redirect to dashboard if already authenticated
    if (isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Simulate login process - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Superadmin credentials
      const superadminCredentials = {
        username: 'superadmin',
        password: 'lilly2024'
      }
      
      // Check for superadmin login
      if (formData.username === superadminCredentials.username && 
          formData.password === superadminCredentials.password) {
        // Store superadmin status in localStorage
        localStorage.setItem('userRole', 'SUPERADMIN')
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userName', 'Super Admin')
        router.push('/dashboard')
        return
      }
      
      // Regular user login - accept any non-empty credentials
      if (formData.username.trim() && formData.password.trim()) {
        localStorage.setItem('userRole', 'USER')
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userName', formData.username)
        router.push('/dashboard')
      } else {
        setErrors({ general: 'Please enter both username and password' })
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 relative flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 lilly-background-pattern opacity-5"></div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex">
          {/* Left Red Panel */}
          <div className="bg-red-600 w-2/5 flex items-center justify-center p-12">
            <div className="text-center">
              <img 
                src="/lilly-logo.svg" 
                alt="Lilly Logo" 
                className="h-20 w-auto mx-auto"
              />
            </div>
          </div>

          {/* Right White Panel - Login Form */}
          <div className="w-3/5 p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-red-600 mb-8">Login</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                    placeholder="Username"
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-colors"
                    placeholder="Password"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Login'
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm underline">
                  Forgot Password
                </a>
              </div>

              {/* Support Text */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  For help logging in or access portal please contact{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700">lilly support contact</a>
                </p>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Demo Credentials:</strong><br/>
                    Superadmin: <code className="bg-blue-100 px-1 rounded">superadmin</code> / <code className="bg-blue-100 px-1 rounded">lilly2024</code><br/>
                    Regular User: Any username/password
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

    </div>
  )
}