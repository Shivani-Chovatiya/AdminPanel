import React from "react";
import StatCard from "../StatCard";
import OverallPerformance from "../OverallPerformance";
import CalendarCard from "../CalendarCard";
import LineChartCard from "../LineChartCard";
import Header from "../Header";
import triangle from "../../assets/triangle.png";
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  UserPlus,
  Calendar,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  Globe,
  ChevronDown,
  Search,
  Landmark,
  Triangle,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const revenueData = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Apr", revenue: 4500 },
  { name: "May", revenue: 6000 },
  { name: "Jun", revenue: 5500 },
  { name: "Jul", revenue: 5500 },
  { name: "Aug", revenue: 5500 },
  { name: "Sep", revenue: 5500 },
  { name: "Oct", revenue: 5500 },
  { name: "Nov", revenue: 5500 },
  { name: "Dec", revenue: 5500 },
];

const pieData = [
  { name: "Domestic", value: 65 },
  { name: "Overseas", value: 35 },
];

const COLORS = ["#D04500", "#F3F4F6"];

const userGrowthData = [
  { month: "Jan", users: 400 },
  { month: "Feb", users: 600 },
  { month: "Mar", users: 800 },
  { month: "Apr", users: 1000 },
  { month: "May", users: 1300 },
  { month: "Jun", users: 1600 },
  { month: "Jul", users: 5500 },
  { month: "Aug", users: 5500 },
  { month: "Sep", users: 5500 },
  { month: "Oct", users: 5500 },
  { month: "Nov", users: 5500 },
  { month: "Dec", users: 5500 },
];

const data = [
  { month: "Jan", sessions: 40 },
  { month: "Feb", sessions: 65 },
  { month: "Mar", sessions: 55 },
  { month: "Apr", sessions: 75 },
  { month: "May", sessions: 95 },
  { month: "Jun", sessions: 16 },
  { month: "Jul", sessions: 55 },
  { month: "Aug", sessions: 55 },
  { month: "Sep", sessions: 55 },
  { month: "Oct", sessions: 55 },
  { month: "Nov", sessions: 55 },
  { month: "Dec", sessions: 55 },
];

const kpiData = [
  {
    title: "Today's Revenue",
    value: "₹12,450",
    change: "+12%",
    progress: "65%",
    color: "bg-green-500",
    badge: "bg-green-100 text-green-600",
    icon: DollarSign,
  },
  {
    title: "Monthly Revenue",
    value: "₹312k",
    change: "+18%",
    progress: "82%",
    color: "bg-blue-500",
    badge: "bg-green-100 text-green-600",
    icon: TrendingUp,
  },
  {
    title: "Net Profit",
    value: "₹42,840",
    change: "+8%",
    progress: "48%",
    color: "bg-orange-500",
    badge: "bg-green-100 text-green-600",
    icon: Activity,
  },
  {
    title: "Active Users",
    value: "1,245",
    change: "+24%",
    progress: "76%",
    color: "bg-purple-500",
    badge: "bg-green-100 text-green-600",
    icon: Users,
  },
  {
    title: "New Registrations",
    value: "324",
    change: "-5%",
    progress: "35%",
    color: "bg-orange-500",
    badge: "bg-red-100 text-red-600",
    icon: UserPlus,
  },
  {
    title: "Total Sessions",
    value: "1,540",
    change: "+10%",
    progress: "90%",
    color: "bg-indigo-500",
    badge: "bg-blue-100 text-blue-600",
    icon: Calendar,
  },
  {
    title: "Pending Tickets",
    value: "28",
    change: "0%",
    progress: "15%",
    color: "bg-gray-400",
    badge: "bg-gray-100 text-gray-500",
    icon: AlertCircle,
  },
  {
    title: "Ques. Appr.",
    value: "89",
    change: "+12%",
    progress: "88%",
    color: "bg-red-500",
    badge: "bg-orange-100 text-orange-600",
    icon: CheckCircle,
  },
];
const stats = [
  { label: "Total Questions", value: "4,852", color: "text-gray-900" },
  { label: "1 Credit QS", value: "2,104", color: "text-gray-900" },
  { label: "2 Credit QS", value: "1,540", color: "text-gray-900" },
  { label: "3 Credit QS", value: "1,208", color: "text-gray-900" },
  { label: "Refund Count", value: "42", color: "text-red-600" },
  { label: "Pending Apprv.", value: "142", color: "text-orange-600" },
];
const Dashboard = () => {
  return (
    <div className="font-inter">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
        {kpiData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold uppercase text-gray-500 tracking-tight">
                  {item.title}
                </h3>
                <Icon className="w-4 h-4 text-gray-400" />
              </div>

              {/* Value */}
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {item.value}
                </h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${item.badge}`}
                >
                  {item.change}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-gray-100 rounded-full">
                <div
                  className={`h-1 rounded-full ${item.color}`}
                  style={{ width: item.progress }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ================= Domestic Revenue Card ================= */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Domestic Revenue
                </h3>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">
                  Last 30 Days
                </p>
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Gross Total
                </p>
                <p className="text-lg font-bold text-gray-900">₹45,200.00</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  GST Component (18%)
                </p>
                <p className="text-lg font-bold text-primary">₹8,136.00</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Net Revenue
                </p>
                <p className="text-lg font-bold text-gray-900">₹37,064.00</p>
              </div>
            </div>
          </div>

          {/* ================= Overseas Revenue Card ================= */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <img src={triangle} className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Overseas Revenue
                </h3>
                <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-0.5 rounded">
                  GST NOT APPLICABLE
                </span>
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Foreign Remittance
                </p>
                <p className="text-lg font-bold text-gray-900">$18,450.00</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Total Receivables
                </p>
                <p className="text-lg font-bold text-gray-900">$18,450.00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Title */}
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold text-gray-700">
                Filter & Search
              </span>
            </div>

            {/* Dropdown 1 */}
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 2 */}
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>Category</option>
                <option>Domestic</option>
                <option>Overseas</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Dropdown 3 */}
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>Date Range</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Right Section Button */}
          <div>
            <button className="bg-primary hover:bg-[#b83d00] transition text-white text-sm font-bold px-6 py-2 rounded-lg">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-6">
              Revenue Trend
            </h3>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#D04500"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col items-center">
            <h3 className="text-base font-bold text-gray-900 mb-8 self-start">
              Domestic vs Overseas
            </h3>

            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">65%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Service */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-8">
              Revenue by Service Type
            </h3>

            <div className="space-y-6">
              {/* Therapy */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                  <span>Therapy</span>
                  <span>85%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-[#D04500] rounded-full w-[85%]"></div>
                </div>
              </div>

              {/* Consultation */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                  <span>Consultation</span>
                  <span>45%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-400 rounded-full w-[45%]"></div>
                </div>
              </div>

              {/* Assessment */}
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                  <span>Assessment</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div className="h-2 bg-indigo-400 rounded-full w-[65%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* User Growth */}
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-8">
              User Growth
            </h3>

            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData}>
                  <XAxis dataKey="month" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#D04500"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-6">
            Session Volume Trend
          </h3>

          {/* Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="month" />
                <YAxis />

                <Tooltip />

                <Bar dataKey="sessions" radius={[6, 6, 0, 0]} fill="#D04500" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-8 mb-16">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8  w-full">
          {/* Header */}
          <div className="flex items-center mb-8">
            <div className="bg-orange-600 p-1.5 rounded-md">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>

            <h3 className="ml-2 text-lg font-bold text-gray-900">
              Future Prediction Analytics
            </h3>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((item, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wide">
                  {item.label}
                </span>
                <span className={`text-2xl font-bold ${item.color}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default Dashboard;
// const Dashboard = () => {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <StatCard title="Today's Revenue" value="₹85,000" />
//         <StatCard title="Monthly Revenue" value="₹1,850,000" />
//         <StatCard title="Active Users" value="3162" />
//         <StatCard title="New Registrations" value="50" />
//         <StatCard title="Pending Tickets" value="30" />
//         <StatCard title="Upcoming Sessions" value="27" />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//         <OverallPerformance />

//         <div className="md:col-span-2 ">
//           <CalendarCard />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
//         <div className="bg-white p-6 rounded-xl shadow ">
//           <h2 className="font-semibold mb-3">Session Volume</h2>
//           <div className="h-full flex items-center justify-center text-gray-400">
//             <LineChartCard />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow ">
//           <h2 className="font-semibold mb-3">Revenue by Region</h2>
//           <div className="h-full flex items-center justify-center text-gray-400">
//             <LineChartCard />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// {/* <div className="space-y-6">
//       {/* PAGE TITLE */}

//       {/* TOP METRIC CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {[
//           { title: "Today's Revenue", value: "₹12,450", change: "+2.4%" },
//           { title: "Monthly Revenue", value: "₹312k", change: "+4.2%" },
//           { title: "Net Profit", value: "₹42,840", change: "+1.8%" },
//           { title: "Active Users", value: "45.2k", change: "+3.1%" },
//         ].map((item, i) => (
//           <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
//             <p className="text-sm text-gray-500">{item.title}</p>
//             <div className="flex justify-between items-center mt-2">
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {item.value}
//               </h3>
//               <span className="text-xs text-green-500 font-medium">
//                 {item.change}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* SECOND ROW SMALL CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {[
//           { title: "New Registrations", value: "1,204" },
//           { title: "Total Sessions", value: "8,452" },
//           { title: "Pending Tickets", value: "28" },
//           { title: "Open Issues", value: "142" },
//         ].map((item, i) => (
//           <div key={i} className="bg-white rounded-xl p-5 shadow-sm">
//             <p className="text-sm text-gray-500">{item.title}</p>
//             <h3 className="text-xl font-semibold text-gray-800 mt-2">
//               {item.value}
//             </h3>
//           </div>
//         ))}
//       </div>

//       {/* DOMESTIC & OVERSEAS REVENUE */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-3">Domestic Revenue</h3>
//           <div className="flex justify-between text-sm text-gray-500">
//             <span>₹45,200</span>
//             <span className="text-red-500">-₹816.00</span>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-3">Overseas Revenue</h3>
//           <div className="flex justify-between text-sm text-gray-500">
//             <span>$18,450</span>
//             <span>$18,450</span>
//           </div>
//         </div>
//       </div>

//       {/* ANALYTICS FILTER BAR */}
//       <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div className="flex flex-wrap gap-3">
//           <select className="border rounded-md px-3 py-1 text-sm">
//             <option>Last 30 Days</option>
//           </select>
//           <select className="border rounded-md px-3 py-1 text-sm">
//             <option>All Regions</option>
//           </select>
//           <select className="border rounded-md px-3 py-1 text-sm">
//             <option>All Services</option>
//           </select>
//         </div>
//         <button className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm">
//           Apply View
//         </button>
//       </div>

//       {/* CHARTS SECTION */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Revenue Trend */}
//         <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
//           <h3 className="font-semibold mb-4">Revenue Trend</h3>
//           <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
//             Line Chart Here
//           </div>
//         </div>

//         {/* Donut Chart */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h3 className="font-semibold mb-4">Domestic vs Overseas</h3>
//           <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
//             Donut Chart
//           </div>
//         </div>
//       </div>

//       {/* SERVICE TYPE + USER GROWTH */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-4">Revenue by Service Type</h3>
//           <div className="space-y-3">
//             <div>
//               <div className="flex justify-between text-sm">
//                 <span>Counselling</span>
//                 <span>$84k</span>
//               </div>
//               <div className="h-2 bg-gray-200 rounded mt-1">
//                 <div className="h-2 bg-orange-500 rounded w-3/4"></div>
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between text-sm">
//                 <span>Hypnotherapy</span>
//                 <span>$52k</span>
//               </div>
//               <div className="h-2 bg-gray-200 rounded mt-1">
//                 <div className="h-2 bg-blue-500 rounded w-2/3"></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow-sm">
//           <h3 className="font-semibold mb-4">User Growth</h3>
//           <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
//             Growth Chart
//           </div>
//         </div>
//       </div>

//       {/* SESSION VOLUME TREND */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h3 className="font-semibold mb-4">Session Volume Trend</h3>
//         <div className="grid grid-cols-6 gap-3">
//           <div className="h-12 bg-gray-200 rounded"></div>
//           <div className="h-16 bg-gray-200 rounded"></div>
//           <div className="h-20 bg-gray-200 rounded"></div>
//           <div className="h-14 bg-gray-200 rounded"></div>
//           <div className="h-18 bg-gray-200 rounded"></div>
//           <div className="h-24 bg-orange-500 rounded"></div>
//         </div>
//       </div>

//       {/* FUTURE PREDICTION */}
//       <div className="bg-white p-6 rounded-xl shadow-sm">
//         <h3 className="font-semibold mb-4">Future Prediction Analytics</h3>
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
//           {["4,852", "2,104", "1,540", "1,208", "142"].map((val, i) => (
//             <div key={i}>
//               <p className="text-lg font-semibold text-gray-800">{val}</p>
//               <p className="text-xs text-gray-500">Metric {i + 1}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div> */}
