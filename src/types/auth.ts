export interface User {
  id: string
  phoneNumber: string
  isVerified: boolean
  firstName?: string
  lastName?: string
  email?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  message: string
  user?: User
  token?: string
}

export interface OTPResponse {
  message: string
  phoneNumber: string
}

export interface ApiError {
  error: string
  details?: string
}

export interface LoginFormData {
  phoneNumber: string
  otp: string
}

export interface ProfileUpdateData {
  firstName?: string
  lastName?: string
  email?: string
}

export type AuthStep = 'phone' | 'otp'

export interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phoneNumber: string, otp: string) => Promise<boolean>
  logout: () => Promise<void>
  sendOTP: (phoneNumber: string) => Promise<boolean>
  updateProfile: (data: ProfileUpdateData) => Promise<boolean>
}