import React from "react";
import OverallPerformance from "../components/OverallPerformance";
import CalendarCard from "../components/CalendarCard";
import LineChartCard from "../components/LineChartCard";

const RevenueAnalysis = () => {
  return (
    <div>
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

export default RevenueAnalysis;
