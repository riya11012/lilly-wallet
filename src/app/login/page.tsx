'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Smartphone, Send, Loader2, ArrowLeft, RotateCcw } from 'lucide-react'
import '../globals.css'

interface FormData {
  phoneNumber: string
  otp: string
}

interface FormErrors {
  phoneNumber?: string
  otp?: string
  general?: string
}

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [formData, setFormData] = useState<FormData>({
    phoneNumber: '',
    otp: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSendOTP = async (): Promise<void> => {
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({ ...prev, phoneNumber: data.phoneNumber }))
        setStep('otp')
      } else {
        setErrors({ general: data.error || 'Failed to send OTP' })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (): Promise<void> => {
  setLoading(true)
  setErrors({})

  try {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: formData.phoneNumber,
        otp: formData.otp,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // ADD: Force page reload and redirect
      window.location.href = '/dashboard'
      // OR use router.replace instead of router.push
      // router.replace('/dashboard')
    } else {
      setErrors({ general: data.error || 'Failed to verify OTP' })
    }
  } catch (error) {
    setErrors({ general: 'Network error. Please try again.' })
  } finally {
    setLoading(false)
  }
}

  const handleResendOTP = async (): Promise<void> => {
    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setErrors({ general: data.error || 'Failed to resend OTP' })
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSubmit = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && formData.phoneNumber.trim()) {
      handleSendOTP()
    }
  }

  const handleOTPSubmit = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && formData.otp.length === 6) {
      handleVerifyOTP()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 rounded-full p-4">
              <Smartphone className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 'phone' ? 'Welcome Back' : 'Verify Your Phone'}
          </h2>
          <p className="text-gray-600">
            {step === 'phone' 
              ? 'Enter your phone number to get started'
              : `We sent a 6-digit code to ${formData.phoneNumber}`
            }
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {step === 'phone' ? (
            // Phone Number Step
            <div className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    onKeyDown={handlePhoneSubmit}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
                    placeholder="+91 98765 43210"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <Smartphone className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={loading || !formData.phoneNumber.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send OTP</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            // OTP Verification Step
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={formData.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setFormData(prev => ({ ...prev, otp: value }))
                  }}
                  onKeyDown={handleOTPSubmit}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-center text-2xl tracking-widest font-mono"
                  placeholder="123456"
                />
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                    {errors.otp}
                  </p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              <button
                onClick={handleVerifyOTP}
                disabled={loading || formData.otp.length !== 6}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>Verify & Sign In</span>
                )}
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setStep('phone')}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Change Number</span>
                </button>
                
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50 transition-colors duration-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Resend OTP</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}