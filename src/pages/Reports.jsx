import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('patient-demographics');
  const [dateRange, setDateRange] = useState('month');

  // Sample data for patient demographics chart
  const patientDemographicsData = [
    { name: '0-18 years', value: 240 },
    { name: '19-35 years', value: 580 },
    { name: '36-50 years', value: 484 },
    { name: '51-65 years', value: 300 },
    { name: '65+ years', value: 180 }
  ];

  // Sample data for appointment statistics
  const appointmentStatisticsData = [
    { name: 'Mon', Scheduled: 18, Completed: 15, Cancelled: 3 },
    { name: 'Tue', Scheduled: 23, Completed: 22, Cancelled: 1 },
    { name: 'Wed', Scheduled: 29, Completed: 26, Cancelled: 3 },
    { name: 'Thu', Scheduled: 27, Completed: 24, Cancelled: 3 },
    { name: 'Fri', Scheduled: 25, Completed: 22, Cancelled: 3 },
    { name: 'Sat', Scheduled: 12, Completed: 10, Cancelled: 2 },
    { name: 'Sun', Scheduled: 8, Completed: 7, Cancelled: 1 }
  ];

  // Sample data for revenue analysis
  const revenueAnalysisData = [
    { name: 'Jan', Insurance: 25000, OutOfPocket: 5000, Total: 30000 },
    { name: 'Feb', Insurance: 28000, OutOfPocket: 5500, Total: 33500 },
    { name: 'Mar', Insurance: 32000, OutOfPocket: 6000, Total: 38000 },
    { name: 'Apr', Insurance: 30000, OutOfPocket: 5800, Total: 35800 },
    { name: 'May', Insurance: 35000, OutOfPocket: 6200, Total: 41200 },
    { name: 'Jun', Insurance: 38000, OutOfPocket: 6500, Total: 44500 }
  ];

  // Sample data for inventory usage
  const inventoryUsageData = [
    { name: 'Surgical Gloves', value: 580 },
    { name: 'Syringes', value: 480 },
    { name: 'Gauze', value: 350 },
    { name: 'Bandages', value: 320 },
    { name: 'IV Fluids', value: 290 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const reports = [
    { id: 'patient-demographics', name: 'Patient Demographics', icon: FiIcons.FiUsers },
    { id: 'appointment-statistics', name: 'Appointment Statistics', icon: FiIcons.FiCalendar },
    { id: 'revenue-analysis', name: 'Revenue Analysis', icon: FiIcons.FiDollarSign },
    { id: 'inventory-usage', name: 'Inventory Usage', icon: FiIcons.FiActivity },
    { id: 'prescription-trends', name: 'Prescription Trends', icon: FiIcons.FiActivity }
  ];

  const dateRanges = [
    { id: 'week', name: 'Last 7 Days' },
    { id: 'month', name: 'Last 30 Days' },
    { id: 'quarter', name: 'Last Quarter' },
    { id: 'year', name: 'Last Year' }
  ];

  // Helper function to render the appropriate chart based on selected report
  const renderReportChart = () => {
    switch (selectedReport) {
      case 'patient-demographics':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={patientDemographicsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {patientDemographicsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'appointment-statistics':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={appointmentStatisticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Scheduled" fill="#0088FE" />
              <Bar dataKey="Completed" fill="#00C49F" />
              <Bar dataKey="Cancelled" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'revenue-analysis':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={revenueAnalysisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Insurance" stroke="#0088FE" />
              <Line type="monotone" dataKey="OutOfPocket" stroke="#00C49F" />
              <Line type="monotone" dataKey="Total" stroke="#FFBB28" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'inventory-usage':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={inventoryUsageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Select a report to view</div>;
    }
  };

  // Helper function to get report title
  const getReportTitle = () => {
    const report = reports.find(r => r.id === selectedReport);
    return report ? report.name : '';
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
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and view detailed reports on various metrics</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          <SafeIcon icon={FiIcons.FiDownload} className="w-5 h-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Report Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            hover
            onClick={() => setSelectedReport(report.id)}
            className={`${selectedReport === report.id ? 'border-primary-500 bg-primary-50' : ''}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-lg ${selectedReport === report.id ? 'bg-primary-100' : 'bg-gray-100'}`}>
                <SafeIcon
                  icon={report.icon}
                  className={`w-6 h-6 ${selectedReport === report.id ? 'text-primary-600' : 'text-gray-600'}`}
                />
              </div>
              <p className={`mt-2 font-medium text-sm ${
                selectedReport === report.id ? 'text-primary-700' : 'text-gray-700'
              }`}>
                {report.name}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Date Range Selection */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiIcons.FiCalendar} className="w-5 h-5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {dateRanges.map(range => (
                <option key={range.id} value={range.id}>{range.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <SafeIcon icon={FiIcons.FiBarChart2} className="w-4 h-4" />
              <span>Bar</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <SafeIcon icon={FiIcons.FiPieChart} className="w-4 h-4" />
              <span>Pie</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      <Card
        title={getReportTitle()}
        subtitle={`Data for ${dateRanges.find(r => r.id === dateRange)?.name || 'selected period'}`}
      >
        {renderReportChart()}
      </Card>
    </motion.div>
  );
};

export default Reports;