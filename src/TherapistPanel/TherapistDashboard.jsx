import React from "react";

const TherapistDashboard = () => {
  const stats = [
    {
      title: "Total Income",
      value: "₹45,000",
      subtitle: "All time earnings",
      bg: "bg-green-50",
      iconColor: "bg-green-500",
    },
    {
      title: "Net Income",
      value: "₹38,250",
      subtitle: "After deductions",
      bg: "bg-blue-50",
      iconColor: "bg-blue-500",
    },
    {
      title: "Date Based Income",
      value: "₹12,500",
      subtitle: "Current Month",
      bg: "bg-orange-50",
      iconColor: "bg-orange-500",
    },
    {
      title: "Total Sessions",
      value: "156",
      subtitle: "Completed sessions",
      bg: "bg-purple-50",
      iconColor: "bg-purple-500",
    },
    {
      title: "Total Clients",
      value: "32",
      subtitle: "Active clients",
      bg: "bg-yellow-50",
      iconColor: "bg-yellow-500",
    },
    {
      title: "Payment Status",
      value: "Pending",
      subtitle: "Paid / Pending",
      bg: "bg-red-50",
      iconColor: "bg-red-500",
    },
    {
      title: "Domestic Income",
      value: "₹35,000",
      subtitle: "Local earnings",
      bg: "bg-teal-50",
      iconColor: "bg-teal-500",
    },
    {
      title: "Overseas Income",
      value: "₹10,000",
      subtitle: "International earnings",
      bg: "bg-indigo-50",
      iconColor: "bg-indigo-500",
    },
  ];
  const weeklyStats = [
    { title: "This Week", value: "12 Sessions", lineColor: "bg-orange-500" },
    {
      title: "Avg Session Rate",
      value: "15 Credits",
      lineColor: "bg-green-500",
    },
    { title: "New Clients", value: "5 This Month", lineColor: "bg-blue-500" },
  ];
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-lg shadow-sm border border-gray-200 bg-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">{stat.title}</span>
                <span className="text-black font-bold text-xl mt-1">
                  {stat.value}
                </span>
              </div>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}
              >
                <div className={`w-4 h-4 rounded-full ${stat.iconColor}`}></div>
              </div>
            </div>
            <span className="text-gray-400 text-xs mt-2">{stat.subtitle}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-4 p-4 mb-16">
        {weeklyStats.map((stat, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-white border rounded-lg shadow-sm p-4 w-full md:w-1/3 relative"
          >
            {/* Main content */}
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">{stat.title}</span>
              <span className="text-black font-bold text-xl mt-1">
                {stat.value}
              </span>
            </div>

            {/* Right thick line */}
            <div
              className={`absolute top-0 right-0 h-full w-2 rounded-r-lg ${stat.lineColor}`}
            ></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TherapistDashboard;
