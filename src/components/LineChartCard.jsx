// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const LineChartCard = () => {
//   const data = [
//     { name: "Mon", value: 40 },
//     { name: "Tue", value: 65 },
//     { name: "Wed", value: 55 },
//     { name: "Thu", value: 80 },
//     { name: "Fri", value: 70 },
//     { name: "Sat", value: 95 },
//     { name: "Sun", value: 85 },
//   ];

//   return (
//     // <div className=" w-full h-[320px]">
//     <ResponsiveContainer width="100%" height="85%">
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Line
//           type="monotone"
//           dataKey="value"
//           stroke="#f97316"
//           strokeWidth={3}
//           dot={{ r: 4 }}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//     // {/* </div> */}
//   );
// };

// export default LineChartCard;
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 65 },
  { name: "Wed", value: 55 },
  { name: "Thu", value: 95 }, // Highlight point
  { name: "Fri", value: 70 },
  { name: "Sat", value: 85 },
  { name: "Sun", value: 75 },
];

const CustomDot = (props) => {
  const { cx, cy, payload } = props;

  if (payload.name === "Thu") {
    return (
      <>
        {/* Vertical Highlight */}
        <rect
          x={cx - 6}
          y={cy}
          width={12}
          height={150}
          fill="#f97316"
          opacity={0.2}
          rx={6}
        />
        <circle cx={cx} cy={cy} r={8} fill="#f97316" />
      </>
    );
  }

  return <circle cx={cx} cy={cy} r={4} fill="#f97316" />;
};

const LineChartCard = () => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
        >
          {/* Gradient */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="transparent" />
          {/* <XAxis dataKey="name" axisLine={false} tickLine={false} /> */}
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            padding={{ left: 20, right: 20 }}
          />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#f97316"
            strokeWidth={3}
            fill="url(#colorGradient)"
            dot={<CustomDot />}
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;
