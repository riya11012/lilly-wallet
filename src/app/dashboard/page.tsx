'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, LogOut, Settings, Bell, Shield, Crown, Search, Plus, ChevronDown, MoreVertical, Calendar, Filter } from 'lucide-react'
import { getUserRole, isSuperAdmin, isAdmin, getUserName, logout as logoutUser, isAuthenticated, UserRole } from '@/lib/userUtils'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  status: 'Active' | 'Inactive'
  role: string
  startDate: string
  endDate?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [userRole, setUserRole] = useState<string>('USER')
  const [search, setSearch] = useState('')
  const [trialFilter, setTrialFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [expandedTrials, setExpandedTrials] = useState<Record<string, boolean>>({ 'Clinical Trial 1': true })
  const [isAuth, setIsAuth] = useState<boolean>(true) // Start as true to prevent flash
  const [mounted, setMounted] = useState<boolean>(false)
  const router = useRouter()

  // Sample data for the users table
  const sampleUsers: UserData[] = [
    {
      id: '1',
      firstName: 'Audra',
      lastName: 'Luettgen',
      email: 'Audra.Luettgen@domain.ext',
      status: 'Active',
      role: 'Study Coord.',
      startDate: '15/01/2024',
      endDate: '15/12/2024'
    },
    {
      id: '2',
      firstName: 'Augustus',
      lastName: 'Daugherty',
      email: 'Augustus.Daugherty@domain.ext',
      status: 'Active',
      role: 'Site Coord.',
      startDate: '20/02/2024',
      endDate: '20/11/2024'
    },
    {
      id: '3',
      firstName: 'Dessie',
      lastName: 'Grady',
      email: 'Dessie.Grady@domain.ext',
      status: 'Active',
      role: 'Site Coord.',
      startDate: '10/03/2024',
      endDate: '10/10/2024'
    },
    {
      id: '4',
      firstName: 'Selina',
      lastName: 'Abernathy',
      email: 'Selina.Abernathy@domain.ext',
      status: 'Active',
      role: 'Site Coord.',
      startDate: '05/04/2024',
      endDate: '05/09/2024'
    },
    {
      id: '5',
      firstName: 'Lyda',
      lastName: 'Gulgowski',
      email: 'Lyda.Gulgowski@domain.ext',
      status: 'Active',
      role: 'Site Coord.',
      startDate: '12/05/2024',
      endDate: '12/08/2024'
    },
    {
      id: '6',
      firstName: 'Lola',
      lastName: 'Rutherford',
      email: 'Lola.Rutherford@domain.ext',
      status: 'Inactive',
      role: 'Site Coord.',
      startDate: '01/06/2024',
      endDate: '01/07/2024'
    }
  ]

  const trials = [
    { name: 'Clinical Trial 1', count: 50 },
    { name: 'Clinical Trial 2', count: 20 }
  ]

  // Filter users based on search, filters, and date range
  const filteredUsers = sampleUsers.filter(user => {
    // Search filter
    if (search && !user.firstName.toLowerCase().includes(search.toLowerCase()) && 
        !user.lastName.toLowerCase().includes(search.toLowerCase()) && 
        !user.email.toLowerCase().includes(search.toLowerCase())) {
      return false
    }

    // Status filter
    if (statusFilter && user.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false
    }

    // Trial filter (you can add trial field to user data if needed)
    if (trialFilter) {
      // For now, we'll skip trial filtering since we don't have trial field
    }

    // Date range filter
    if (fromDate || toDate) {
      const userStartDate = parseDate(user.startDate)
      if (!userStartDate) return false

      if (fromDate && userStartDate < fromDate) return false
      if (toDate && userStartDate > toDate) return false
    }

    return true
  })

  // Helper function to parse date strings
  function parseDate(dateStr: string): Date | null {
    if (!dateStr) return null
    const parts = dateStr.split('/')
    if (parts.length !== 3) return null
    const day = parseInt(parts[0])
    const month = parseInt(parts[1]) - 1 // Month is 0-indexed
    const year = parseInt(parts[2])
    return new Date(year, month, day)
  }

  useEffect(() => {
    // Set mounted to true on client side
    setMounted(true)
    
    // Check authentication immediately on client side
    const authStatus = isAuthenticated()
    
    if (!authStatus) {
      // Redirect to login if not authenticated
      setIsAuth(false)
      router.push('/login')
      return
    }

    // Set authentication status
    setIsAuth(true)

    // Get user role and set state
    const role = getUserRole()
    setUserRole(role)

    // Set user data
        setUser({
          id: '1',
      firstName: 'Josh',
      lastName: 'Grey',
      email: 'jane.grey@eversana.com',
      status: 'Active',
      role: 'Admin',
      startDate: '01/01/2024'
    })

    // Set loading to false
        setLoading(false)
  }, [router])

  const handleLogout = async (): Promise<void> => {
    try {
      // Clear localStorage
      logoutUser()
        router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const toggleTrial = (trialName: string) => {
    setExpandedTrials(prev => ({
      ...prev,
      [trialName]: !prev[trialName]
    }))
  }

  const getStatusDot = (status: string) => {
    return (
      <div className={`w-2 h-2 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
    )
  }

  // Show loading state until mounted and authenticated
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!isAuth) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-[70px]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Page Title */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Admin // Users</h1>
          </div>

          {/* Filters Section - All in one line */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              {/* FILTER section */}
              <span className="text-sm font-medium text-gray-700">FILTER</span>
              
              <select
                value={trialFilter}
                onChange={(e) => setTrialFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Trial Name</option>
                <option value="trial1">Clinical Trial 1</option>
                <option value="trial2">Clinical Trial 2</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* DATE section */}
              <div className="flex items-center gap-2">
            <span className="font-bold">DATE</span>
            <div className="flex items-center bg-white h-9 w-24 border rounded-md px-2">
              <DatePicker
                selected={fromDate}
                onChange={(date: Date | null) => setFromDate(date)}
                placeholderText="Start"
                className="w-full font-normal text-xs bg-transparent outline-none"
                dateFormat="dd/MM/yyyy"
                wrapperClassName="date-picker-high-z-index"
              />
            </div>

            <div className="flex items-center bg-white h-9 w-24 border rounded-md px-2">
              <DatePicker
                selected={toDate}
                onChange={(date: Date | null) => setToDate(date)}
                placeholderText="End"
                className="w-full font-normal text-xs bg-transparent outline-none"
                dateFormat="dd/MM/yyyy"
                wrapperClassName="date-picker-high-z-index"
              />
            </div>
          </div>
              
              {/* Clear filters button */}
              {(trialFilter || statusFilter || fromDate || toDate) && (
                <button 
                  onClick={() => {
                    setTrialFilter('')
                    setStatusFilter('')
                    setFromDate(null)
                    setToDate(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  ✕
                </button>
              )}

              {/* Spacer to push search and add to the right */}
              <div className="flex-1"></div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              
              {/* Add User button */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Clinical Trials Sections */}
          {trials.map((trial) => (
            <div key={trial.name} className="border-b border-gray-200 last:border-b-0">
              <div className="px-6 py-4 bg-gray-50">
                <button
                  onClick={() => toggleTrial(trial.name)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center space-x-3">
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${expandedTrials[trial.name] ? 'rotate-180' : ''}`} />
                    <span className="font-medium text-gray-900">{trial.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{trial.count} Records</span>
                </button>
              </div>
              
              {expandedTrials[trial.name] && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          First name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.firstName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center space-x-2">
                              {getStatusDot(user.status)}
                              <span>{user.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.startDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.endDate || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
              )}
            </div>
          ))}

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{filteredUsers.length} records</span>
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}