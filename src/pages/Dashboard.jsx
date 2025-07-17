import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';

const { 
  FiUsers, FiCalendar, FiActivity, FiDollarSign, 
  FiTrendingUp, FiTrendingDown, FiClock, FiAlertTriangle
} = FiIcons;

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Patients',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: FiUsers,
      color: 'primary'
    },
    {
      title: 'Today\'s Appointments',
      value: '45',
      change: '+8%',
      trend: 'up',
      icon: FiCalendar,
      color: 'success'
    },
    {
      title: 'Active Cases',
      value: '89',
      change: '-5%',
      trend: 'down',
      icon: FiActivity,
      color: 'warning'
    },
    {
      title: 'Revenue (MTD)',
      value: '$125,430',
      change: '+15%',
      trend: 'up',
      icon: FiDollarSign,
      color: 'primary'
    }
  ];

  const recentPatients = [
    { id: 1, name: 'John Doe', age: 45, condition: 'Hypertension', status: 'Active', time: '2 hours ago' },
    { id: 2, name: 'Jane Smith', age: 32, condition: 'Diabetes', status: 'Discharged', time: '4 hours ago' },
    { id: 3, name: 'Bob Johnson', age: 67, condition: 'Chest Pain', status: 'Critical', time: '6 hours ago' },
    { id: 4, name: 'Alice Brown', age: 28, condition: 'Pregnancy', status: 'Active', time: '1 day ago' }
  ];

  const appointments = [
    { id: 1, patient: 'Sarah Wilson', time: '09:00 AM', type: 'Consultation', status: 'Confirmed' },
    { id: 2, patient: 'Mike Davis', time: '10:30 AM', type: 'Follow-up', status: 'Pending' },
    { id: 3, patient: 'Lisa Garcia', time: '02:00 PM', type: 'Surgery', status: 'Confirmed' },
    { id: 4, patient: 'Tom Anderson', time: '03:30 PM', type: 'Check-up', status: 'Cancelled' }
  ];

  const patientFlowData = {
    title: { text: 'Patient Flow - Last 7 Days' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Admissions',
        type: 'line',
        data: [23, 28, 31, 25, 29, 22, 18],
        smooth: true,
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: 'Discharges',
        type: 'line',
        data: [18, 24, 26, 22, 25, 20, 15],
        smooth: true,
        itemStyle: { color: '#22c55e' }
      }
    ]
  };

  const departmentData = {
    title: { text: 'Department Occupancy' },
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 35, name: 'Emergency' },
          { value: 28, name: 'Cardiology' },
          { value: 22, name: 'Orthopedics' },
          { value: 18, name: 'Pediatrics' },
          { value: 12, name: 'Neurology' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-success-100 text-success-800';
      case 'critical': return 'bg-danger-100 text-danger-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-primary-100 text-primary-800';
      case 'pending': return 'bg-warning-100 text-warning-800';
      case 'cancelled': return 'bg-danger-100 text-danger-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your healthcare system</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Generate Report
          </button>
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
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <SafeIcon 
                      icon={stat.trend === 'up' ? FiTrendingUp : FiTrendingDown} 
                      className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`} 
                    />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <SafeIcon icon={stat.icon} className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Patient Flow">
          <ReactECharts option={patientFlowData} style={{ height: '300px' }} />
        </Card>
        <Card title="Department Occupancy">
          <ReactECharts option={departmentData} style={{ height: '300px' }} />
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card title="Recent Patients" subtitle="Latest patient admissions">
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.condition} • Age {patient.age}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{patient.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card title="Today's Appointments" subtitle="Scheduled appointments">
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                    <SafeIcon icon={FiClock} className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{appointment.time}</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card title="System Alerts" subtitle="Important notifications">
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-warning-50 rounded-lg">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-warning-600" />
            <div>
              <p className="text-sm font-medium text-warning-800">Low Inventory Alert</p>
              <p className="text-xs text-warning-600">Paracetamol stock is running low (5 units remaining)</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-danger-50 rounded-lg">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-danger-600" />
            <div>
              <p className="text-sm font-medium text-danger-800">Critical Patient</p>
              <p className="text-xs text-danger-600">Patient Bob Johnson requires immediate attention</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;