export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN'
}

export const getUserRole = (): UserRole => {
  if (typeof window === 'undefined') return UserRole.USER
  const role = localStorage.getItem('userRole')
  return (role as UserRole) || UserRole.USER
}

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

export const isSuperAdmin = (): boolean => {
  return getUserRole() === UserRole.SUPERADMIN
}

export const isAdmin = (): boolean => {
  const role = getUserRole()
  return role === UserRole.ADMIN || role === UserRole.SUPERADMIN
}

export const getUserName = (): string => {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('userName') || 'User'
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('userRole')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userName')
}
