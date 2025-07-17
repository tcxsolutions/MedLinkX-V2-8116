import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/common/Card';
import SafeIcon from '../components/common/SafeIcon';
import ReactECharts from 'echarts-for-react';
import * as FiIcons from 'react-icons/fi';

const { 
  FiFileText, FiDownload, FiBarChart2, FiPieChart, 
  FiUsers, FiCalendar, FiActivity, FiDollarSign
} = FiIcons;

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('patient-demographics');
  const [dateRange, setDateRange] = useState('month');

  const reports = [
    { id: 'patient-demographics', name: 'Patient Demographics', icon: FiUsers },
    { id: 'appointment-statistics', name: 'Appointment Statistics', icon: FiCalendar },
    { id: 'revenue-analysis', name: 'Revenue Analysis', icon: FiDollarSign },
    { id: 'inventory-usage', name: 'Inventory Usage', icon: FiActivity },
    { id: 'prescription-trends', name: 'Prescription Trends', icon: FiActivity }
  ];

  const dateRanges = [
    { id: 'week', name: 'Last 7 Days' },
    { id: 'month', name: 'Last 30 Days' },
    { id: 'quarter', name: 'Last Quarter' },
    { id: 'year', name: 'Last Year' }
  ];

  // Sample data for patient demographics chart
  const patientDemographicsData = {
    title: { text: 'Patient Age Groups' },
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: 240, name: '0-18 years' },
          { value: 580, name: '19-35 years' },
          { value: 484, name: '36-50 years' },
          { value: 300, name: '51-65 years' },
          { value: 180, name: '65+ years' }
        ]
      }
    ]
  };

  // Sample data for appointment statistics chart
  const appointmentStatisticsData = {
    title: { text: 'Appointment Types' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Scheduled', 'Completed', 'Cancelled'] },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Scheduled',
        type: 'bar',
        data: [18, 23, 29, 27, 25, 12, 8],
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: 'Completed',
        type: 'bar',
        data: [15, 22, 26, 24, 22, 10, 7],
        itemStyle: { color: '#22c55e' }
      },
      {
        name: 'Cancelled',
        type: 'bar',
        data: [3, 1, 3, 3, 3, 2, 1],
        itemStyle: { color: '#ef4444' }
      }
    ]
  };

  // Sample data for revenue analysis chart
  const revenueAnalysisData = {
    title: { text: 'Monthly Revenue' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Insurance', 'Out of Pocket', 'Total'] },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Insurance',
        type: 'line',
        data: [25000, 28000, 32000, 30000, 35000, 38000],
        itemStyle: { color: '#3b82f6' }
      },
      {
        name: 'Out of Pocket',
        type: 'line',
        data: [5000, 5500, 6000, 5800, 6200, 6500],
        itemStyle: { color: '#22c55e' }
      },
      {
        name: 'Total',
        type: 'line',
        data: [30000, 33500, 38000, 35800, 41200, 44500],
        lineStyle: { width: 3 },
        itemStyle: { color: '#f59e0b' }
      }
    ]
  };

  // Sample data for inventory usage chart
  const inventoryUsageData = {
    title: { text: 'Top 5 Most Used Items' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['Surgical Gloves', 'Syringes', 'Gauze', 'Bandages', 'IV Fluids']
    },
    series: [
      {
        name: 'Usage Count',
        type: 'bar',
        data: [580, 480, 350, 320, 290],
        itemStyle: { color: '#3b82f6' }
      }
    ]
  };

  // Sample data for prescription trends chart
  const prescriptionTrendsData = {
    title: { text: 'Most Prescribed Medications' },
    tooltip: { trigger: 'item' },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          { value: 235, name: 'Lisinopril' },
          { value: 274, name: 'Metformin' },
          { value: 310, name: 'Amoxicillin' },
          { value: 335, name: 'Ibuprofen' },
          { value: 400, name: 'Atorvastatin' }
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

  // Helper function to render the appropriate chart based on selected report
  const renderReportChart = () => {
    switch (selectedReport) {
      case 'patient-demographics':
        return <ReactECharts option={patientDemographicsData} style={{ height: '400px' }} />;
      case 'appointment-statistics':
        return <ReactECharts option={appointmentStatisticsData} style={{ height: '400px' }} />;
      case 'revenue-analysis':
        return <ReactECharts option={revenueAnalysisData} style={{ height: '400px' }} />;
      case 'inventory-usage':
        return <ReactECharts option={inventoryUsageData} style={{ height: '400px' }} />;
      case 'prescription-trends':
        return <ReactECharts option={prescriptionTrendsData} style={{ height: '400px' }} />;
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
          <SafeIcon icon={FiDownload} className="w-5 h-5" />
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
              <p className={`mt-2 font-medium text-sm ${selectedReport === report.id ? 'text-primary-700' : 'text-gray-700'}`}>
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
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400" />
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
              <SafeIcon icon={FiBarChart2} className="w-4 h-4" />
              <span>Bar</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <SafeIcon icon={FiPieChart} className="w-4 h-4" />
              <span>Pie</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <SafeIcon icon={FiFileText} className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      <Card title={getReportTitle()} subtitle={`Data for ${dateRanges.find(r => r.id === dateRange)?.name || 'selected period'}`}>
        {renderReportChart()}
      </Card>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Key Findings">
          <div className="space-y-3">
            <div className="p-3 bg-primary-50 rounded-lg">
              <p className="text-sm font-medium text-primary-800">Primary Observation</p>
              <p className="text-sm text-primary-700">
                {selectedReport === 'patient-demographics' && 'Majority of patients are between 19-50 years old (67%)'}
                {selectedReport === 'appointment-statistics' && 'Wednesday has the highest appointment volume'}
                {selectedReport === 'revenue-analysis' && 'Revenue is growing steadily with 15% YOY increase'}
                {selectedReport === 'inventory-usage' && 'Surgical gloves are the most consumed inventory item'}
                {selectedReport === 'prescription-trends' && 'Atorvastatin is the most prescribed medication'}
              </p>
            </div>
            <div className="p-3 bg-success-50 rounded-lg">
              <p className="text-sm font-medium text-success-800">Positive Trend</p>
              <p className="text-sm text-success-700">
                {selectedReport === 'patient-demographics' && 'Patient retention rate improved by 12%'}
                {selectedReport === 'appointment-statistics' && 'Appointment completion rate is at 88%'}
                {selectedReport === 'revenue-analysis' && 'Insurance reimbursement time reduced by 15%'}
                {selectedReport === 'inventory-usage' && 'Inventory wastage reduced by 8%'}
                {selectedReport === 'prescription-trends' && 'Generic medication prescriptions increased by 15%'}
              </p>
            </div>
            <div className="p-3 bg-warning-50 rounded-lg">
              <p className="text-sm font-medium text-warning-800">Area of Concern</p>
              <p className="text-sm text-warning-700">
                {selectedReport === 'patient-demographics' && 'Low representation in 65+ age group'}
                {selectedReport === 'appointment-statistics' && 'Weekend appointments are significantly lower'}
                {selectedReport === 'revenue-analysis' && 'Increased claim denials in the last month'}
                {selectedReport === 'inventory-usage' && '3 critical items are near stock-out levels'}
                {selectedReport === 'prescription-trends' && 'High antibiotic prescription rate needs review'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Recommendations">
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-2">
              <span className="inline-block w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex-shrink-0 flex items-center justify-center font-medium">1</span>
              <span>
                {selectedReport === 'patient-demographics' && 'Develop targeted outreach programs for seniors'}
                {selectedReport === 'appointment-statistics' && 'Optimize scheduling to balance weekday appointments'}
                {selectedReport === 'revenue-analysis' && 'Review claim submission process to reduce denials'}
                {selectedReport === 'inventory-usage' && 'Implement automated reordering for high-use items'}
                {selectedReport === 'prescription-trends' && 'Conduct prescriber education on antibiotic stewardship'}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="inline-block w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex-shrink-0 flex items-center justify-center font-medium">2</span>
              <span>
                {selectedReport === 'patient-demographics' && 'Create specialized care packages for different age groups'}
                {selectedReport === 'appointment-statistics' && 'Implement SMS reminders to reduce cancellations'}
                {selectedReport === 'revenue-analysis' && 'Negotiate better rates with top insurance providers'}
                {selectedReport === 'inventory-usage' && 'Consider alternative suppliers for high-cost items'}
                {selectedReport === 'prescription-trends' && 'Review formulary to include more cost-effective options'}
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="inline-block w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex-shrink-0 flex items-center justify-center font-medium">3</span>
              <span>
                {selectedReport === 'patient-demographics' && 'Analyze patient satisfaction by demographic'}
                {selectedReport === 'appointment-statistics' && 'Extend hours on high-demand days'}
                {selectedReport === 'revenue-analysis' && 'Implement payment plans for patients with high balances'}
                {selectedReport === 'inventory-usage' && 'Train staff on proper inventory management'}
                {selectedReport === 'prescription-trends' && 'Implement drug interaction checking system'}
              </span>
            </li>
          </ul>
        </Card>

        <Card title="Related Reports">
          <div className="space-y-3">
            {reports.filter(report => report.id !== selectedReport).slice(0, 3).map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className="w-full flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 bg-gray-200 rounded-lg">
                  <SafeIcon icon={report.icon} className="w-4 h-4 text-gray-700" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">{report.name}</p>
                  <p className="text-xs text-gray-500">View related insights</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Reports;