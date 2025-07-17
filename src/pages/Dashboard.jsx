import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '../components/common/Card'
import SafeIcon from '../components/common/SafeIcon'
import { useAuth } from '../contexts/AuthContext'
import { useOrganization } from '../contexts/OrganizationContext'
import * as FiIcons from 'react-icons/fi'

const { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp, FiActivity, FiHeart, FiPackage, FiAlertCircle } = FiIcons

const Dashboard = () => {
  const { user } = useAuth()
  const { selectedOrganization } = useOrganization()
  const [timeRange, setTimeRange] = useState('today')

  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: FiUsers,
      color: 'bg-blue-500'
    },
    {
      title: 'Today\'s Appointments',
      value: '45',
      change: '+5%',
      changeType: 'positive',
      icon: FiCalendar,
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Revenue',
      value: '$125,430',
      change: '+8%',
      changeType: 'positive',
      icon: FiDollarSign,
      color: 'bg-purple-500'
    },
    {
      title: 'Bed Occupancy',
      value: '78%',
      change: '+2%',
      changeType: 'positive',
      icon: FiActivity,
      color: 'bg-orange-500'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment scheduled with Dr. Smith',
      time: '2 minutes ago',
      icon: FiCalendar
    },
    {
      id: 2,
      type: 'patient',
      message: 'Patient John Doe checked in',
      time: '5 minutes ago',
      icon: FiUsers
    },
    {
      id: 3,
      type: 'inventory',
      message: 'Low inventory alert: Surgical gloves',
      time: '10 minutes ago',
      icon: FiPackage
    },
    {
      id: 4,
      type: 'billing',
      message: 'Payment received from Jane Smith',
      time: '15 minutes ago',
      icon: FiDollarSign
    }
  ]

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'Alice Johnson',
      doctor: 'Dr. Smith',
      time: '09:00 AM',
      type: 'Consultation'
    },
    {
      id: 2,
      patient: 'Bob Wilson',
      doctor: 'Dr. Brown',
      time: '10:30 AM',
      type: 'Follow-up'
    },
    {
      id: 3,
      patient: 'Carol Davis',
      doctor: 'Dr. Johnson',
      time: '02:00 PM',
      type: 'Check-up'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening at {selectedOrganization?.name || 'your organization'} today
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    <SafeIcon 
                      icon={stat.changeType === 'positive' ? FiTrendingUp : FiTrendingUp} 
                      className={`w-4 h-4 ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`} 
                    />
                    <span className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                  <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card title="Recent Activities" className="xl:col-span-2">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <SafeIcon icon={activity.icon} className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card title="Today's Appointments">
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{appointment.patient}</p>
                  <p className="text-sm text-gray-600">{appointment.doctor}</p>
                  <p className="text-xs text-gray-500">{appointment.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-600">{appointment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-primary-700">Add Patient</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <SafeIcon icon={FiCalendar} className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-700">Schedule</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <SafeIcon icon={FiDollarSign} className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-700">Billing</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <SafeIcon icon={FiPackage} className="w-6 h-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-700">Inventory</span>
            </button>
          </div>
        </Card>

        {/* System Status */}
        <Card title="System Status">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Database</span>
              </div>
              <span className="text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">API Services</span>
              </div>
              <span className="text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Backup</span>
              </div>
              <span className="text-sm text-yellow-600">Running</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard