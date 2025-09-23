import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

export function formatPhoneNumber(phoneNumber: string, countryCode = 'IN'): string | null {
  try {
    if (!isValidPhoneNumber(phoneNumber, countryCode as any)) {
      return null
    }
    
    const parsed = parsePhoneNumber(phoneNumber, countryCode as any)
    return parsed?.format('E.164') || null
  } catch {
    return null
  }
}

export function validatePhoneNumber(phoneNumber: string, countryCode = 'IN'): boolean {
  try {
    return isValidPhoneNumber(phoneNumber, countryCode as any)
  } catch {
    return false
  }
}

export function displayPhoneNumber(phoneNumber: string): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return parsed?.formatNational() || phoneNumber
  } catch {
    return phoneNumber
  }
}