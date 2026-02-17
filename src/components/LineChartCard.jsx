import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LineChartCard = () => {
  const data = [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 65 },
    { name: "Wed", value: 55 },
    { name: "Thu", value: 80 },
    { name: "Fri", value: 70 },
    { name: "Sat", value: 95 },
    { name: "Sun", value: 85 },
  ];

  return (
    // <div className=" w-full h-[320px]">
    <ResponsiveContainer width="100%" height="85%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#f97316"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
    // {/* </div> */}
  );
};

export default LineChartCard;
