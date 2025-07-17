import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../components/common/SafeIcon';
import FeatureOverview from '../components/dashboard/FeatureOverview';
import * as FiIcons from 'react-icons/fi';
import { useOrganization } from '../contexts/OrganizationContext';

const Dashboard = () => {
  const { selectedOrganization, features } = useOrganization();
  const [stats, setStats] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    // In a real app, these would come from API calls
    // For now, we'll use mock data based on organization type
    
    // Set organization-specific stats
    if (selectedOrganization?.type === 'individual') {
      setStats([
        {
          title: "Today's Patients",
          value: '12',
          change: '+2',
          changeType: 'positive',
          icon: FiIcons.FiUsers,
          color: 'bg-blue-500'
        },
        {
          title: 'Pending Labs',
          value: '5',
          change: '-1',
          changeType: 'positive',
          icon: FiIcons.FiFileText,
          color: 'bg-green-500'
        },
        {
          title: 'Prescriptions',
          value: '8',
          change: '+3',
          changeType: 'positive',
          icon: FiIcons.FiList,
          color: 'bg-purple-500'
        },
        {
          title: 'Notes to Complete',
          value: '4',
          change: '+1',
          changeType: 'negative',
          icon: FiIcons.FiEdit,
          color: 'bg-orange-500'
        }
      ]);
    } else if (selectedOrganization?.type === 'family_practice') {
      setStats([
        {
          title: "Today's Patients",
          value: '28',
          change: '+5',
          changeType: 'positive',
          icon: FiIcons.FiUsers,
          color: 'bg-blue-500'
        },
        {
          title: 'Family Visits',
          value: '7',
          change: '+2',
          changeType: 'positive',
          icon: FiIcons.FiHome,
          color: 'bg-green-500'
        },
        {
          title: 'Lab Results',
          value: '14',
          change: '+3',
          changeType: 'positive',
          icon: FiIcons.FiFileText,
          color: 'bg-purple-500'
        },
        {
          title: 'Referrals',
          value: '6',
          change: '+1',
          changeType: 'positive',
          icon: FiIcons.FiArrowRight,
          color: 'bg-orange-500'
        }
      ]);
    } else if (selectedOrganization?.type === 'hospital') {
      setStats([
        {
          title: 'Admissions',
          value: '18',
          change: '+3',
          changeType: 'positive',
          icon: FiIcons.FiUserPlus,
          color: 'bg-blue-500'
        },
        {
          title: 'Discharges',
          value: '15',
          change: '+2',
          changeType: 'positive',
          icon: FiIcons.FiUserMinus,
          color: 'bg-green-500'
        },
        {
          title: 'Bed Occupancy',
          value: '86%',
          change: '+2%',
          changeType: 'negative',
          icon: FiIcons.FiBriefcase,
          color: 'bg-purple-500'
        },
        {
          title: 'Critical Cases',
          value: '7',
          change: '-1',
          changeType: 'positive',
          icon: FiIcons.FiAlertCircle,
          color: 'bg-orange-500'
        }
      ]);
    } else {
      // Default stats if no organization selected
      setStats([
        {
          title: "Today's Patients",
          value: '0',
          change: '0',
          changeType: 'neutral',
          icon: FiIcons.FiUsers,
          color: 'bg-blue-500'
        },
        {
          title: 'Pending Tasks',
          value: '0',
          change: '0',
          changeType: 'neutral',
          icon: FiIcons.FiCheckSquare,
          color: 'bg-green-500'
        },
        {
          title: 'Appointments',
          value: '0',
          change: '0',
          changeType: 'neutral',
          icon: FiIcons.FiCalendar,
          color: 'bg-purple-500'
        },
        {
          title: 'Notes',
          value: '0',
          change: '0',
          changeType: 'neutral',
          icon: FiIcons.FiFileText,
          color: 'bg-orange-500'
        }
      ]);
    }

    // Mock upcoming appointments
    setUpcomingAppointments([
      {
        id: 1,
        patientName: 'John Doe',
        time: '9:00 AM',
        type: 'Check-up',
        doctor: 'Dr. Smith'
      },
      {
        id: 2,
        patientName: 'Sarah Johnson',
        time: '10:30 AM',
        type: 'Follow-up',
        doctor: 'Dr. Wilson'
      },
      {
        id: 3,
        patientName: 'Michael Brown',
        time: '11:45 AM',
        type: 'Consultation',
        doctor: 'Dr. Smith'
      },
      {
        id: 4,
        patientName: 'Emily Davis',
        time: '1:15 PM',
        type: 'Physical',
        doctor: 'Dr. Johnson'
      },
      {
        id: 5,
        patientName: 'Robert Miller',
        time: '2:30 PM',
        type: 'Follow-up',
        doctor: 'Dr. Smith'
      }
    ]);

    // Mock recent patients
    setRecentPatients([
      {
        id: 1,
        name: 'Alice Thompson',
        age: 45,
        date: '2023-11-19',
        reason: 'Hypertension'
      },
      {
        id: 2,
        name: 'James Wilson',
        age: 32,
        date: '2023-11-18',
        reason: 'Diabetes follow-up'
      },
      {
        id: 3,
        name: 'Linda Garcia',
        age: 28,
        date: '2023-11-18',
        reason: 'Pregnancy check-up'
      },
      {
        id: 4,
        name: 'Thomas Moore',
        age: 56,
        date: '2023-11-17',
        reason: 'Chest pain'
      }
    ]);

    // Mock pending tasks
    setPendingTasks([
      {
        id: 1,
        task: "Review lab results for John Doe",
        priority: 'High',
        due: '2023-11-20'
      },
      {
        id: 2,
        task: "Complete progress notes for Sarah Johnson",
        priority: 'Medium',
        due: '2023-11-20'
      },
      {
        id: 3,
        task: "Call pharmacy about Michael Brown's prescription",
        priority: 'Medium',
        due: '2023-11-21'
      },
      {
        id: 4,
        task: "Follow up on referral for Emily Davis",
        priority: 'Low',
        due: '2023-11-22'
      }
    ]);
  }, [selectedOrganization?.type]);

  // Get gradient colors based on organization type
  const getGradientColors = () => {
    switch (selectedOrganization?.type) {
      case 'individual':
        return 'from-blue-600 to-indigo-600';
      case 'family_practice':
        return 'from-green-600 to-teal-600';
      case 'hospital':
        return 'from-purple-600 to-indigo-600';
      default:
        return 'from-blue-600 to-purple-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* Welcome Banner */}
      <div className={`bg-gradient-to-r ${getGradientColors()} rounded-xl p-6 text-white shadow-lg`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome to {selectedOrganization?.name || 'MedLink EHR'}
            </h1>
            <p className="opacity-90">
              {selectedOrganization?.type === 'individual' && 'Your personal patient management system'}
              {selectedOrganization?.type === 'family_practice' && 'Your family practice clinic management system'}
              {selectedOrganization?.type === 'hospital' && 'Your comprehensive hospital management system'}
              {!selectedOrganization?.type && 'Healthcare Management Platform'}
            </p>
          </div>
          
          {!selectedOrganization && (
            <Link
              to="/organizations"
              className="mt-4 md:mt-0 px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2 w-fit"
            >
              <SafeIcon icon={FiIcons.FiBriefcase} className="w-5 h-5" />
              <span>Set Up Organization</span>
            </Link>
          )}
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
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <SafeIcon
                    icon={stat.changeType === 'positive' ? FiIcons.FiTrendingUp : FiIcons.FiTrendingDown}
                    className={`w-4 h-4 ${
                      stat.changeType === 'positive'
                        ? 'text-green-500'
                        : stat.changeType === 'negative'
                        ? 'text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                <SafeIcon
                  icon={stat.icon}
                  className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feature Overview */}
      <FeatureOverview />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        {features.appointments && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiIcons.FiCalendar} className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
              </div>
              <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map(appointment => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {appointment.type} • {appointment.doctor}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiIcons.FiCheckSquare} className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900">Pending Tasks</h2>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800">Add Task</button>
          </div>
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <div key={task.id} className="flex items-start space-x-3">
                <div className="mt-1">
                  <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{task.task}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        task.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-gray-500">Due: {task.due}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Patients */}
        {features.patientManagement && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiIcons.FiUsers} className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Patients</h2>
              </div>
              <Link to="/patients" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-3">Patient</th>
                    <th className="px-4 py-3">Age</th>
                    <th className="px-4 py-3">Last Visit</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentPatients.map(patient => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{patient.name}</div>
                      </td>
                      <td className="px-4 py-4 text-gray-600">{patient.age}</td>
                      <td className="px-4 py-4 text-gray-600">{patient.date}</td>
                      <td className="px-4 py-4 text-gray-600">{patient.reason}</td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
                            <SafeIcon icon={FiIcons.FiEye} className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-green-600 hover:text-green-800">
                            <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <SafeIcon icon={FiIcons.FiActivity} className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">EHR System</span>
              </div>
              <span className="text-sm text-green-600">Online</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Database</span>
              </div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">API Services</span>
              </div>
              <span className="text-sm text-green-600">Running</span>
            </div>
            
            {features.advancedLabIntegration && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Lab Integration</span>
                </div>
                <span className="text-sm text-green-600">Connected</span>
              </div>
            )}
            
            {features.billing && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Billing System</span>
                </div>
                <span className="text-sm text-yellow-600">Updating</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiIcons.FiClock} className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Last Updated</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;