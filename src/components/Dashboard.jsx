import React from "react";
import StatCard from "./StatCard";
import OverallPerformance from "./OverallPerformance";
import CalendarCard from "./CalendarCard";
import LineChartCard from "./LineChartCard";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Today's Revenue" value="₹85,000" />
        <StatCard title="Monthly Revenue" value="₹1,850,000" />
        <StatCard title="Active Users" value="3162" />
        <StatCard title="New Registrations" value="50" />
        <StatCard title="Pending Tickets" value="30" />
        <StatCard title="Upcoming Sessions" value="27" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <OverallPerformance />

        <div className="md:col-span-2 ">
          <CalendarCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow h-64">
          <h2 className="font-semibold mb-3">Session Volume</h2>
          <div className="h-full flex items-center justify-center text-gray-400">
            <LineChartCard />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow h-64">
          <h2 className="font-semibold mb-3">Revenue by Region</h2>
          <div className="h-full flex items-center justify-center text-gray-400">
            <LineChartCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
