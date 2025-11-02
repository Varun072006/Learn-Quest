import React, { useState, useEffect } from 'react'
import { Award, Mail, CheckCircle, Eye, Send } from 'lucide-react'
import { adminCertTestsAPI } from '../services/api'
import { toast } from 'sonner'

const CertificateManagement = () => {
  const [passedUsers, setPassedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState([])
  const [sendingEmails, setSendingEmails] = useState(false)

  useEffect(() => {
    fetchPassedUsers()
  }, [])

  const fetchPassedUsers = async () => {
    try {
      const response = await adminCertTestsAPI.getAllAttempts()
      // Filter only passed users
      const passed = response.data.filter(result => {
        const passPercentage = result.settings?.pass_percentage || 70
        return result.score >= passPercentage && result.status === 'completed'
      })
      setPassedUsers(passed)
    } catch (error) {
      console.error('Error fetching passed users:', error)
      toast.error('Failed to load passed users')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectUser = (attemptId) => {
    setSelectedUsers(prev => 
      prev.includes(attemptId) 
        ? prev.filter(id => id !== attemptId)
        : [...prev, attemptId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUsers.length === passedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(passedUsers.map(user => user.attempt_id))
    }
  }

  const sendBulkCertificates = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user')
      return
    }

    setSendingEmails(true)
    try {
      const response = await adminCertTestsAPI.sendBulkCertificates(selectedUsers)
      
      if (response.data) {
        const { success, failed, total, details } = response.data
        
        if (success === total) {
          toast.success(`✅ Certificates sent to all ${success} user(s)!`)
        } else if (success > 0) {
          // Show which users failed
          const failedUsers = details.filter(d => d.status === 'failed')
          const failedNames = failedUsers.map(u => {
            const userName = u.user_name || 'Unknown'
            const reason = u.error || 'Unknown error'
            return `${userName}: ${reason}`
          }).join('\n')
          
          toast.warning(
            <div>
              <div className="font-semibold">⚠️ Sent to {success} user(s), {failed} failed</div>
              <div className="text-sm mt-1 space-y-1">
                {failedUsers.map((u, i) => (
                  <div key={i} className="text-xs">
                    • {u.user_name || 'Unknown'}: {u.error}
                  </div>
                ))}
              </div>
            </div>,
            { duration: 8000 }
          )
        } else {
          // All failed - show detailed errors
          const failedUsers = details.filter(d => d.status === 'failed')
          toast.error(
            <div>
              <div className="font-semibold">❌ Failed to send certificates to all {total} user(s)</div>
              <div className="text-sm mt-1 space-y-1">
                {failedUsers.map((u, i) => (
                  <div key={i} className="text-xs">
                    • {u.user_name || u.attempt_id}: {u.error}
                  </div>
                ))}
              </div>
            </div>,
            { duration: 8000 }
          )
        }
        
        // Refresh data and clear selection on any success
        if (success > 0) {
          setSelectedUsers([])
          fetchPassedUsers()
        }
      }
    } catch (error) {
      console.error('Error sending certificates:', error)
      toast.error('Failed to send certificates: ' + (error.response?.data?.detail || error.message))
    } finally {
      setSendingEmails(false)
    }
  }

  const [stats, setStats] = useState({
    totalPassed: 0,
    thisMonth: 0,
    thisWeek: 0
  })

  useEffect(() => {
    const calculateStats = () => {
      const total = passedUsers.length
      const now = new Date()
      
      const thisMonth = passedUsers.filter(r => {
        const testDate = new Date(r.created_at)
        return testDate.getMonth() === now.getMonth() && testDate.getFullYear() === now.getFullYear()
      }).length
      
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      const thisWeek = passedUsers.filter(r => {
        const testDate = new Date(r.created_at)
        return testDate > weekAgo
      }).length
      
      setStats({ totalPassed: total, thisMonth, thisWeek })
    }
    
    if (passedUsers.length > 0) {
      calculateStats()
    }
  }, [passedUsers])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Certificate Management</h1>
          <p className="text-slate-400">Send certificates to passed users via email</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={sendBulkCertificates}
            disabled={selectedUsers.length === 0 || sendingEmails}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            {sendingEmails ? 'Sending...' : `Send Certificates (${selectedUsers.length})`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="text-green-400 mb-2">Total Passed Users</div>
          <div className="text-3xl font-bold text-white">{stats.totalPassed}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="text-blue-400 mb-2">This Month</div>
          <div className="text-3xl font-bold text-white">{stats.thisMonth}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="text-yellow-400 mb-2">This Week</div>
          <div className="text-3xl font-bold text-white">{stats.thisWeek}</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === passedUsers.length && passedUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Certification</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {passedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                  No passed users found
                </td>
              </tr>
            ) : (
              passedUsers.map((result) => (
                <tr key={result.attempt_id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(result.attempt_id)}
                      onChange={() => toggleSelectUser(result.attempt_id)}
                      className="w-4 h-4 text-green-600 bg-slate-700 border-slate-600 rounded focus:ring-green-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div>
                      <div className="font-semibold">{result.user_name}</div>
                      <div className="text-xs text-slate-400">{result.user_email || 'No email'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{result.cert_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    <span className="capitalize">{result.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                    {result.score}%
                    <span className="text-xs text-slate-400 ml-1">
                      / {result.settings?.pass_percentage || 70}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 w-fit bg-green-500/20 text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Passed
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                    {result.created_at ? new Date(result.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button 
                      className="text-blue-400 hover:text-blue-300" 
                      title="View Details"
                      onClick={() => toast.info('View details coming soon')}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      className="text-green-400 hover:text-green-300" 
                      title="Send Certificate"
                      onClick={() => {
                        setSelectedUsers([result.attempt_id])
                        sendBulkCertificates()
                      }}
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CertificateManagement

