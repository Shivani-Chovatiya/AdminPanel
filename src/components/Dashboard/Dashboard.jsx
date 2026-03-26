import React, { useEffect, useState } from "react";
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
  Info,
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
  Legend,
} from "recharts";
import { db } from "../../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

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

const COLORS = ["#D04500", "#F8B08A"];

const stats2 = [
  { label: "Total Questions", value: "4,852", color: "text-gray-900" },
  { label: "1 Credit QS", value: "2,104", color: "text-gray-900" },
  { label: "2 Credit QS", value: "1,540", color: "text-gray-900" },
  { label: "3 Credit QS", value: "1,208", color: "text-gray-900" },
  { label: "Refund Count", value: "42", color: "text-red-600" },
  { label: "Pending Apprv.", value: "142", color: "text-orange-600" },
];
const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [domesticData, setDomesticData] = useState(0);
  const [overseasData, setOverseasData] = useState(0);
  const [allAmountData, setAllAmountData] = useState();
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [sessionCount, setSessionCount] = useState({
    ongoing: 0,
    completed: 0,
    scheduled: 0,
  });
  const [stats, setStats] = useState([]);

  const fetchUsers = async (startDate, endDate) => {
    const q = query(
      collection(db, "users"),
      where("createdAt", ">=", new Date(startDate)),
      where("createdAt", "<=", new Date(endDate)),
    );

    const snapshot = await getDocs(q);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  };

  const getRangeType = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= 15) return "daily";
    // if (diffDays <= 30) return "weekly";
    if (diffDays <= 365) return "monthly";
    return "yearly";
  };

  const processUserGrowth = (users, startDate, endDate) => {
    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    const rangeType =
      startDate && endDate ? getRangeType(startDate, endDate) : "monthly";

    console.log(rangeType, diffDays, startDate, endDate);
    const grouped = {};

    // count users
    users.forEach((user) => {
      const date = user.createdAt.toDate();
      let key = "";

      if (rangeType === "daily") {
        key = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
      }

      if (rangeType === "weekly") {
        const week = Math.ceil(date.getDate() / 7);
        key = `Week ${week}`;
      }

      if (rangeType === "monthly") {
        key = date.toLocaleString("default", { month: "short" });
      }

      if (rangeType === "yearly") {
        key = date.getFullYear().toString();
      }

      grouped[key] = (grouped[key] || 0) + 1;
    });

    let timeline = [];

    // DAILY
    if (rangeType === "daily") {
      let current = new Date(startDate);

      while (current <= new Date(endDate)) {
        const label = current.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });

        timeline.push({
          label,
          users: grouped[label] || 0,
        });

        current.setDate(current.getDate() + 1);
      }
    }

    // WEEKLY
    if (rangeType === "weekly") {
      for (let i = 1; i <= 5; i++) {
        const label = `Week ${i}`;
        timeline.push({
          label,
          users: grouped[label] || 0,
        });
      }
    }

    // MONTHLY
    if (rangeType === "monthly") {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      months.forEach((month) => {
        timeline.push({
          label: month,
          users: grouped[month] || 0,
        });
      });
    }

    // YEARLY
    if (rangeType === "yearly") {
      const startYear = new Date(startDate).getFullYear();
      const endYear = new Date(endDate).getFullYear();

      for (let y = startYear; y <= endYear; y++) {
        const label = y.toString();
        timeline.push({
          label,
          users: grouped[label] || 0,
        });
      }
    }

    return timeline;
  };

  const handleApplyFilter = async () => {
    // If no date selected → use current year
    let start;
    let end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // include full end day
    } else {
      const year = new Date().getFullYear();
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
    }
    console.log(start, end);
    const users = await fetchUsers(start, end);

    const userchartData = processUserGrowth(users, start, end);
    console.log(userchartData);
    setUserGrowthData(userchartData);
    const totalUsers = userchartData.reduce((sum, item) => sum + item.users, 0);
    setUserCount(totalUsers);
  };

  useEffect(() => {
    handleApplyFilter();
  }, [startDate, endDate]);

  const fetchTotalSpending = async () => {
    try {
      const paymentsRef = collection(db, "payments");

      let start;
      let end;

      if (startDate && endDate) {
        start = new Date(startDate);
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // include full end day
      } else {
        const year = new Date().getFullYear();
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
      }
      console.log(start, end);
      const q = query(
        paymentsRef,
        where("status", "==", "success"),
        where("createdAt", ">=", start),
        where("createdAt", "<=", end),
      );

      const snapshot = await getDocs(q);

      let total = {
        INR: 0,
        USD: 0,
        AssINR: 0,
        AssUSD: 0,
        TherapyINR: 0,
        TherapyUSD: 0,
        CreditsINR: 0,
        CreditsUSD: 0,
      };
      const grouped = {};

      const rangeType =
        startDate && endDate ? getRangeType(start, end) : "monthly";

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt.toDate();
        const amount = Number(data.amount) || 0;
        const type1 = data.credits;
        const type2 = data.paidAssessments;
        const type3 = data.paidSessionBooking;
        // normalize currency (fix undefined issue)
        const currency = (data.currency || "INR").toUpperCase().trim();

        // PIE CALCULATION
        if (currency === "INR") total.INR += amount;
        if (currency === "USD") total.USD += amount;
        if (currency === "INR" && type2 !== "Not Applicable")
          total.AssINR += amount;
        if (currency === "USD" && type2 !== "Not Applicable")
          total.AssUSD += amount;
        if (currency === "INR" && type3 !== "Not Applicable")
          total.TherapyINR += amount;
        if (currency === "USD" && type3 !== "Not Applicable")
          total.TherapyUSD += amount;
        if (currency === "INR" && type1 !== "Not Applicable")
          total.CreditsINR += amount;
        if (currency === "USD" && type1 !== "Not Applicable")
          total.CreditsUSD += amount;
        // LINE CHART CALCULATION
        let key = "";

        if (rangeType === "daily") {
          key = date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });
        }

        // if (rangeType === "weekly") {
        //   const week = Math.ceil(date.getDate() / 7);
        //   key = `Week ${week}`;
        // }
        if (rangeType === "weekly") {
          const diffDays = Math.floor((date - start) / (1000 * 60 * 60 * 24));
          const weekIndex = Math.floor(diffDays / 7);

          const weekStart = new Date(start);
          weekStart.setDate(start.getDate() + weekIndex * 7);

          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);

          const startLabel = weekStart.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });

          const endLabel = weekEnd.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });

          key = `${startLabel} - ${endLabel}`;
        }
        if (rangeType === "monthly") {
          key = date.toLocaleString("default", { month: "short" });
        }

        if (rangeType === "yearly") {
          key = date.getFullYear().toString();
        }
        console.log(grouped[key], amount);
        // grouped[key] = (grouped[key] || 0) + amount;
        if (!grouped[key]) {
          grouped[key] = { INR: 0, USD: 0 };
        }

        if (currency === "INR") {
          grouped[key].INR += amount;
        }

        if (currency === "USD") {
          grouped[key].USD += amount;
        }
        console.log(grouped[key]);
      });
      console.log(
        "Line total:",
        grouped,
        Object.values(grouped).reduce((a, b) => a + b, 0),
      );
      let trendData = [];

      if (rangeType === "monthly") {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        trendData = months.map((month) => ({
          label: month,
          revenue: grouped[month] || { INR: 0, USD: 0 },
        }));
      }

      if (rangeType === "yearly") {
        const startYear = start.getFullYear();
        const endYear = end.getFullYear();

        for (let y = startYear; y <= endYear; y++) {
          trendData.push({
            label: y.toString(),
            revenue: grouped[y] || { INR: 0, USD: 0 },
          });
        }
      }

      // if (rangeType === "weekly") {
      //   for (let i = 1; i <= 5; i++) {
      //     const label = `Week ${i}`;
      //     trendData.push({
      //       label,
      //       revenue: grouped[label] || { INR: 0, USD: 0 },
      //     });
      //   }
      // }
      if (rangeType === "weekly") {
        let current = new Date(start);

        while (current <= end) {
          const startOfWeek = new Date(current);
          const endOfWeek = new Date(current);
          endOfWeek.setDate(current.getDate() + 6);

          const startLabel = startOfWeek.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });

          const endLabel = endOfWeek.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });

          const label = `${startLabel} - ${endLabel}`;

          trendData.push({
            label,
            revenue: grouped[label] || { INR: 0, USD: 0 },
          });

          current.setDate(current.getDate() + 7);
        }
      }
      console.log(trendData);
      if (rangeType === "daily") {
        let current = new Date(start);

        while (current <= end) {
          const label = current.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          });

          trendData.push({
            label,
            revenue: grouped[label] || { INR: 0, USD: 0 },
          });

          current.setDate(current.getDate() + 1);
        }
      }

      setRevenueTrend(trendData);

      // PIE CHART
      const totalAmount = total.INR + total.USD;

      const pieDetails = [
        {
          name: "Domestic",
          value: totalAmount ? (total.INR / totalAmount) * 100 : 0,
          totalAmount: total.INR,
        },
        {
          name: "Overseas",
          value: totalAmount ? (total.USD / totalAmount) * 100 : 0,
          totalAmount: total.USD,
        },
      ];

      setPieData(pieDetails);
      setDomesticData(total.INR);
      setOverseasData(total.USD);
      setAllAmountData(total);
    } catch (error) {
      console.error("Failed to fetch total spending:", error);
    }
  };

  useEffect(() => {
    fetchTotalSpending();
  }, [startDate, endDate]);

  console.log(pieData, revenueTrend);

  const processSessionChartData = (sessions, startDate, endDate) => {
    const rangeType = getRangeType(startDate, endDate);
    const map = {};

    let current = new Date(startDate);
    const end = new Date(endDate);

    // 1️⃣ Create default labels with 0 values
    while (current <= end) {
      let label = "";

      if (rangeType === "daily") {
        label = current.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });
        current.setDate(current.getDate() + 1);
      }
      //  else if (rangeType === "weekly") {
      //   const week = Math.ceil(current.getDate() / 7);
      //   label = `Week ${week}`;
      //   current.setDate(current.getDate() + 7);
      else if (rangeType === "weekly") {
        const weekStart = new Date(current);
        const weekEnd = new Date(current);

        weekEnd.setDate(weekEnd.getDate() + 6);

        const startLabel = weekStart.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });

        const endLabel = weekEnd.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });

        label = `${startLabel} - ${endLabel}`;

        current.setDate(current.getDate() + 7);
      } else if (rangeType === "monthly") {
        label = current.toLocaleDateString("en-IN", { month: "short" });
        current.setMonth(current.getMonth() + 1);
      } else if (rangeType === "yearly") {
        label = String(current.getFullYear()); // convert to string
        current.setFullYear(current.getFullYear() + 1);
      }

      if (!map[label]) {
        map[label] = {
          label,
          scheduled: 0,
          ongoing: 0,
          completed: 0,
        };
      }
    }

    // 2️⃣ Fill actual session counts
    sessions.forEach((session) => {
      const date = new Date(session.date);
      // const year = new Date(startDate).getFullYear();
      // const date = new Date(`${session.date} ${year}`);
      let label = "";

      if (rangeType === "daily") {
        label = date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        });
      }
      // else if (rangeType === "weekly") {
      //   const week = Math.ceil(date.getDate() / 7);
      //   label = `Week ${week}`;
      else if (rangeType === "weekly") {
        for (const key in map) {
          const [startStr, endStr] = key.split(" - ");

          const year = new Date(startDate).getFullYear();

          const start = new Date(`${startStr} ${year}`);
          const end = new Date(`${endStr} ${year}`);

          end.setHours(23, 59, 59, 999); // include full end day

          if (date >= start && date <= end) {
            label = key;
            break;
          }
        }
      } else if (rangeType === "monthly") {
        label = date.toLocaleDateString("en-IN", { month: "short" });
      } else if (rangeType === "yearly") {
        label = String(date.getFullYear());
      }

      if (!map[label]) return;

      if (session.status === "Scheduled") map[label].scheduled++;
      if (session.status === "Ongoing") map[label].ongoing++;
      if (session.status === "Completed") map[label].completed++;
    });

    const chartData = Object.values(map);

    console.log("Chart Data:", chartData);

    setChartData(chartData);
    const totals = chartData.reduce(
      (acc, item) => {
        acc.scheduled += item.scheduled;
        acc.ongoing += item.ongoing;
        acc.completed += item.completed;
        return acc;
      },
      { scheduled: 0, ongoing: 0, completed: 0 },
    );
    setSessionCount(totals);
  };
  const getSessionsAnalytics = async () => {
    let start;
    let end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // include full end day
    } else {
      const year = new Date().getFullYear();
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
    }
    const snapshot = await getDocs(collection(db, "therapists"));
    const sessions = [];

    const now = new Date();

    snapshot.forEach((docSnap) => {
      const therapist = docSnap.data();

      if (!therapist.slots) return;

      therapist.slots.forEach((slot) => {
        const slotDate = new Date(slot.date);

        // date range filter
        if (slotDate < start || slotDate > end) return;

        const startTime = new Date(`${slot.date} ${slot.start}`);
        const endTime = new Date(`${slot.date} ${slot.end}`);

        let status = "Scheduled";

        if (now >= startTime && now <= endTime) {
          status = "Ongoing";
        } else if (now > endTime) {
          status = "Completed";
        }

        sessions.push({
          date: slot.date,
          status,
        });
      });
    });

    processSessionChartData(sessions, start, end);
  };

  useEffect(() => {
    getSessionsAnalytics();
  }, [startDate, endDate]);
  console.log(chartData, userGrowthData, sessionCount);

  const kpiData = [
    // {
    //   title: "Today's Revenue",
    //   value: "₹12,450",
    //   change: "+12%",
    //   progress: "65%",
    //   color: "bg-green-500",
    //   badge: "bg-green-100 text-green-600",
    //   icon: DollarSign,
    // },
    // {
    //   title: "Monthly Revenue",
    //   value: "₹312k",
    //   change: "+18%",
    //   progress: "82%",
    //   color: "bg-blue-500",
    //   badge: "bg-green-100 text-green-600",
    //   icon: TrendingUp,
    // },
    {
      title: "Total Income",
      value: {
        inr: domesticData || 0,
        usd: overseasData || 0,
      },
      change: "+8%",
      progress: "48%",
      color: "bg-orange-500",
      badge: "bg-green-100 text-green-600",
      icon: Activity,
    },
    {
      title: "Total Users",
      value: userCount || 0,
      change: "+24%",
      progress: "76%",
      color: "bg-purple-500",
      badge: "bg-green-100 text-green-600",
      icon: Users,
    },
    // {
    //   title: "Registrations",
    //   value: "324",
    //   change: "-5%",
    //   progress: "35%",
    //   color: "bg-orange-500",
    //   badge: "bg-red-100 text-red-600",
    //   icon: UserPlus,
    // },
    {
      title: "Total Sessions",
      value:
        sessionCount.ongoing + sessionCount.completed + sessionCount.scheduled,
      change: "+10%",
      progress: "90%",
      color: "bg-indigo-500",
      badge: "bg-blue-100 text-blue-600",
      icon: Calendar,
    },
    // {
    //   title: "Pending Tickets",
    //   value: "28",
    //   change: "0%",
    //   progaress: "15%",
    //   color: "bg-gray-400",
    //   badge: "bg-gray-100 text-gray-500",
    //   icon: AlertCircle,
    // },
    // {
    //   title: "Ques. Appr.",
    //   value: "89",
    //   change: "+12%",
    //   progress: "88%",
    //   color: "bg-red-500",
    //   badge: "bg-orange-100 text-orange-600",
    //   icon: CheckCircle,
    // },
    {
      title: "Total Paid Ass. Income",
      value: {
        inr: allAmountData ? allAmountData.AssINR : 0,
        usd: allAmountData ? allAmountData.AssUSD : 0,
      },
      change: "+8%",
      progress: "48%",
      color: "bg-orange-500",
      badge: "bg-green-100 text-green-600",
      icon: Activity,
    },
    {
      title: "Total Paid Therapy Income",
      value: {
        inr: allAmountData ? allAmountData.TherapyINR : 0,
        usd: allAmountData ? allAmountData.TherapyUSD : 0,
      },
      change: "+8%",
      progress: "48%",
      color: "bg-orange-500",
      badge: "bg-green-100 text-green-600",
      icon: Activity,
    },
    {
      title: "Total Credits Purchased Income",
      value: {
        inr: allAmountData ? allAmountData.CreditsINR : 0,
        usd: allAmountData ? allAmountData.CreditsUSD : 0,
      },
      change: "+8%",
      progress: "48%",
      color: "bg-orange-500",
      badge: "bg-green-100 text-green-600",
      icon: Activity,
    },
  ];

  const fetchAnalytics = async () => {
    try {
      // 1. Get all prediction questions
      const snapshot = await getDocs(collection(db, "predictionQuestions"));
      const snapshot2 = await getDocs(collection(db, "compatibilityQuestions"));
      let total = 0;
      let credit1 = 0;
      let credit2 = 0;
      let credit3 = 0;
      let compatibility = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        total++;

        if (data.credits === 1) credit1++;
        if (data.credits === 2) credit2++;
        if (data.credits === 3) credit3++;
      });
      snapshot2.forEach((doc) => {
        const data = doc.data();
        compatibility++;
        total++;
      });
      // 2. Get refund count from users collection
      const usersSnap = await getDocs(collection(db, "users"));

      let refundCount = 0;

      usersSnap.forEach((doc) => {
        const user = doc.data();

        // adjust this based on your schema
        refundCount += user?.refundCredits || 0;
      });

      // 3. Pending approvals (example logic)
      let pending = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === "pending") {
          pending++;
        }
      });

      // 4. Set stats
      setStats([
        { label: "Total Questions", value: total, color: "text-gray-900" },
        { label: "1 Credit QS", value: credit1, color: "text-gray-900" },
        { label: "2 Credits QS", value: credit2, color: "text-gray-900" },
        { label: "3 Credits QS", value: credit3, color: "text-gray-900" },
        {
          label: "Compatibility QS",
          value: compatibility,
          color: "text-gray-900",
        },
        // { label: "Refund Count", value: refundCount, color: "text-red-600" },
        // { label: "Pending Apprv.", value: pending, color: "text-orange-600" },
      ]);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);
  return (
    <div className="font-inter">
      <div className="px-4 md:px-8 mt-8 gap-3 flex flex-col">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Section */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Title */}
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold text-gray-700">
                Filter & Search
              </span>
            </div>

            {/* Start Date */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Start</span>
              <input
                type="date"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 h-[34px] text-xs font-semibold text-black focus:outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">End</span>
              <input
                type="date"
                className="bg-gray-50 border border-gray-200 rounded-lg px-3 h-[34px] text-xs font-semibold text-black focus:outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Status */}
            {/* <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div> */}

            {/* Category */}
            {/* <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>Category</option>
                <option>Domestic</option>
                <option>Overseas</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div> */}
          </div>

          <div className="flex md:flex-row flex-col gap-2">
            {/* Apply Button */}
            <button
              onClick={() => {
                handleApplyFilter();
                fetchTotalSpending();
                getSessionsAnalytics();
              }}
              className="bg-primary hover:bg-[#b83d00] transition text-white text-sm font-bold px-6 py-2 rounded-lg"
            >
              Apply Filters
            </button>
            <button
              onClick={() => {
                setEndDate("");
                setStartDate("");
                handleApplyFilter();
                fetchTotalSpending();
                getSessionsAnalytics();
              }}
              className="bg-primary hover:bg-[#b83d00] transition text-white text-sm font-bold px-6 py-2 rounded-lg"
            >
              Clear
            </button>{" "}
          </div>
        </div>
        {/* Information Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-blue-900">
              Data Display Information
            </p>
            <p className="text-xs text-blue-700">
              By default, data for the{" "}
              <strong>current year ({new Date().getFullYear()})</strong> is
              displayed. Use the date filters above to view data by specific
              dates, months, or years:
            </p>
            <ul className="text-xs text-blue-700 list-disc list-inside ml-2 mt-1">
              <li>
                <strong>Daily view:</strong> Select dates within 15 days
              </li>
              <li>
                <strong>Monthly view:</strong> Select dates within 1 year
              </li>
              <li>
                <strong>Yearly view:</strong> Select dates spanning multiple
                years
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
        {kpiData.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-white border border-primary shadow-sm rounded-xl p-5 flex flex-col gap-3"
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
                {typeof item.value === "object" ? (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{item.value.inr}
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      ${item.value.usd}
                    </span>
                  </div>
                ) : (
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                )}
                {/* <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${item.badge}`}
                >
                  {item.change}
                </span> */}
                {item.title === "Total Sessions" && (
                  <div className="text-xs space-y-1">
                    <p className="text-green-600 font-semibold">
                      Completed: {sessionCount.completed}
                    </p>

                    <p className="text-blue-600 font-semibold">
                      Ongoing: {sessionCount.ongoing}
                    </p>

                    <p className="text-orange-500 font-semibold">
                      Scheduled: {sessionCount.scheduled}
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {/* <div className="w-full h-1 bg-gray-100 rounded-full">
                <div
                  className={`h-1 rounded-full ${item.color}`}
                  style={{ width: item.progress }}
                ></div>
              </div> */}
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
                {/* <p className="text-[10px] font-semibold text-gray-400 uppercase">
                  Last 30 Days
                </p> */}
              </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Gross Total
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{domesticData}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  GST Component (18%)
                </p>
                <p className="text-lg font-bold ">
                  ₹
                  {domesticData > 0
                    ? ((domesticData * 18) / 100).toFixed(2)
                    : "0.00"}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Net Revenue
                </p>
                <p className="text-lg font-bold ">
                  ₹
                  {domesticData > 0
                    ? (domesticData - (domesticData * 18) / 100).toFixed(2)
                    : "0.00"}
                </p>
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
                <p className="text-lg font-bold text-gray-900">
                  ${overseasData}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Total Receivables
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ${overseasData}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="px-4 md:px-8 mt-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
         
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-bold text-gray-700">
                Filter & Search
              </span>
            </div>

           
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>Category</option>
                <option>Domestic</option>
                <option>Overseas</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

           
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 pr-10 h-[34px] text-xs font-semibold text-black focus:outline-none">
                <option>Date Range</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          
          <div>
            <button className="bg-primary hover:bg-[#b83d00] transition text-white text-sm font-bold px-6 py-2 rounded-lg">
              Apply Filters
            </button>
          </div>
        </div>
      </div> */}
      <div className="px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-6">
              Revenue Trend
            </h3>

            <div className="h-72">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="label" />

                  <YAxis />

                  <Tooltip />

                  <Legend />

                  {/* INR Line */}
                  <Line
                    type="monotone"
                    dataKey="revenue.INR"
                    stroke="#6366F1"
                    strokeWidth={3}
                    name="INR Revenue"
                  />

                  {/* USD Line */}
                  <Line
                    type="monotone"
                    dataKey="revenue.USD"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="USD Revenue"
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
                    nameKey="name"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name, props) => {
                      const amount = props?.payload?.totalAmount || 0;
                      return [amount, name];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-900">
                  {pieData[0]?.value.toFixed(2) || 0}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm font-semibold">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  ></span>
                  <span className="text-gray-700">
                    {item.name} ({item.value.toFixed(2)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-8">
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
        {/* Revenue by Service */}
        {/* <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <h3 className="text-base font-bold text-gray-900 mb-8">
            Revenue by Service Type
          </h3>

          <div className="space-y-6">
         
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                <span>Therapy</span>
                <span>85%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-[#D04500] rounded-full w-[85%]"></div>
              </div>
            </div>

           
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-2">
                <span>Consultation</span>
                <span>45%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 bg-blue-400 rounded-full w-[45%]"></div>
              </div>
            </div>

            
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
        </div> */}

        {/* </div> */}
      </div>
      <div className="px-4 md:px-8 mt-8">
        {/* User Growth */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <h3 className="text-base font-bold text-gray-900 mb-8">
            User Growth
          </h3>

          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />

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
      <div className="px-4 md:px-8 mt-8">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-6">
            Session Volume Trend
          </h3>

          {/* Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              {/* <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="month" />
                <YAxis />

                <Tooltip />

                <Bar dataKey="sessions" radius={[6, 6, 0, 0]} fill="#D04500" />
              </BarChart> */}
              <BarChart width={600} height={300} data={chartData}>
                <XAxis dataKey="label" />
                <YAxis />

                <Tooltip />

                <Bar dataKey="scheduled" stackId="a" fill="#f59e0b" />
                <Bar dataKey="ongoing" stackId="a" fill="#3b82f6" />
                <Bar dataKey="completed" stackId="a" fill="#10b981" />
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
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
