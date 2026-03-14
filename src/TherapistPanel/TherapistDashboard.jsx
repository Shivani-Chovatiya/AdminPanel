import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import triangle from "../assets/triangle.png";
import {
  Activity,
  AlertCircle,
  Calendar,
  Eye,
  Globe,
  Info,
  Search,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PaymentHistoryModal } from "../TherapistsPages/ViewTherapistPage";

const TherapistDashboard = () => {
  const stats2 = [
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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [pieData, setPieData] = useState([]);
  const [domesticData, setDomesticData] = useState(0);
  const [overseasData, setOverseasData] = useState(0);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [sessionCount, setSessionCount] = useState({
    ongoing: 0,
    completed: 0,
    scheduled: 0,
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [therapistData, setTherapistData] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const email = localStorage.getItem("therapistemail");
        if (!email) {
          toast.error("No therapist email found. Please log in again.");
          navigate("/");
          return;
        }

        const q = query(
          collection(db, "therapists"),
          where("email", "==", email),
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];

          setTherapistData({
            id: docSnap.id,
            ...docSnap.data(),
          });
        }
      } catch (error) {
        console.error("Error fetching therapist:", error);
      }
    };

    fetchTherapist();
  }, []);

  const [paymentsData, setPaymentsData] = useState(0);
  useEffect(() => {
    const fetchPayments = async () => {
      const q = query(
        collection(db, "payments"),
        where("therapistId", "==", therapistData.id),
        where("status", "==", "success"),
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      console.log(data);
      if (!data?.length) return;

      const successPayments = data.filter((p) => p.status === "success");
      // const total = successPayments.reduce((acc, p) => acc + (p.amount || 0), 0);
      const totals = successPayments.reduce(
        (acc, p) => {
          if (p.currency === "INR") acc.INR += Number(p.amount) || 0;
          if (p.currency === "USD") acc.USD += Number(p.amount) || 0;
          if (p.currency === "INR") acc.totalINRSession += 1 || 0;
          if (p.currency === "USD") acc.totalUSDSession += 1 || 0;
          if (p.currency === "USD")
            acc.totalTheapistAmountUSDToINR += Number(p.inrprice) || 0;
          return acc;
        },
        {
          INR: 0,
          USD: 0,
          totalINRSession: 0,
          totalUSDSession: 0,
          totalTheapistAmountUSDToINR: 0,
        },
      );
      setPaymentsData(totals);
    };

    if (therapistData) {
      console.log(therapistData);
      fetchPayments();
    }
  }, [therapistData]);

  const getRangeType = (start, end) => {
    const diffTime = Math.abs(new Date(end) - new Date(start));
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays <= 15) return "daily";
    // if (diffDays <= 30) return "weekly";
    if (diffDays <= 365) return "monthly";
    return "yearly";
  };

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
        where("therapistId", "==", therapistData.id),
      );

      const snapshot = await getDocs(q);

      let total = { INR: 0, USD: 0 };
      const grouped = {};

      const rangeType =
        startDate && endDate ? getRangeType(start, end) : "monthly";

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.createdAt.toDate();
        const amount = Number(data.amount) || 0;

        // normalize currency (fix undefined issue)
        const currency = (data.currency || "INR").toUpperCase().trim();

        // PIE CALCULATION
        if (currency === "INR") total.INR += amount;
        if (currency === "USD") total.USD += amount;

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
    } catch (error) {
      console.error("Failed to fetch total spending:", error);
    }
  };
  const calculateTotalClients = () => {
    if (!therapistData?.slots) {
      setUserCount(0);
      return;
    }

    let start;
    let end;

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
    } else {
      const year = new Date().getFullYear();
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    // Get unique bookedBy.uid values from slots within date range
    const uniqueClients = new Set();

    therapistData.slots.forEach((slot) => {
      // Check if slot is booked and has bookedBy data
      if (slot.isBooked && slot.bookedBy?.uid) {
        const slotDate = new Date(slot.date);

        // Check if slot is within date range
        if (slotDate >= start && slotDate <= end) {
          uniqueClients.add(slot.bookedBy.uid);
        }
      }
    });

    console.log("Total unique clients:", uniqueClients.size);
    setUserCount(uniqueClients.size);
  };

  useEffect(() => {
    if (therapistData) {
      fetchTotalSpending();
      calculateTotalClients();
    }
  }, [startDate, endDate, therapistData]);

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

    // snapshot.forEach((docSnap) => {
    //   const therapist = docSnap.data();

    if (!therapistData.slots) return;

    therapistData.slots.forEach((slot) => {
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
    // });

    processSessionChartData(sessions, start, end);
  };

  useEffect(() => {
    if (therapistData) {
      getSessionsAnalytics();
    }
  }, [startDate, endDate, therapistData]);

  const inrRevenue = domesticData || 0;
  const usdRevenue = overseasData || 0;

  // INR GST
  const gstAmount = inrRevenue * 0.18;
  const inrWithGst = inrRevenue - gstAmount;

  // Commission
  const inrCommission = inrWithGst * 0.3;
  const usdCommission = usdRevenue * 0.3;

  // Net earnings
  const inrNet = inrWithGst - inrCommission;
  const usdNet = usdRevenue - usdCommission;

  const inrRevenue2 = paymentsData?.INR || 0;
  const usdRevenue2 = paymentsData?.totalTheapistAmountUSDToINR || 0;

  // INR GST
  const gstAmount2 = inrRevenue2 * 0.18;
  const inrWithGst2 = inrRevenue2 - gstAmount2;

  // Commission
  const inrCommission2 = inrWithGst2 * 0.3;
  const usdCommission2 = usdRevenue2 * 0.3;

  // Net earnings
  const inrNet2 = inrWithGst2 - inrCommission2;
  const usdNet2 = usdRevenue2 - usdCommission2;
  const totalNetEarning = inrNet + usdNet * 80;
  const totalNetEarning2 = inrNet2 + usdNet2;
  //  * 80;
  const previousPayments = therapistData?.payments || [];

  const totalPaid = previousPayments.reduce(
    (sum, payment) => sum + (payment.amountPaid || 0),
    0,
  );
  console.log(inrNet2 + usdNet2, inrNet2, usdNet2);
  const remainingPayout = totalNetEarning2 - totalPaid;

  const stats = [
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
      // value: {
      //   inr: domesticData || 0,
      //   usd: overseasData || 0,
      // },
      value: `₹${inrRevenue2 + usdRevenue2}`,
      change: "+8%",
      progress: "48%",
      color: "bg-orange-500",
      badge: "bg-green-100 text-green-600",
      icon: Activity,
    },
    {
      title: "Total Net Earnings",
      value: `₹${totalNetEarning2}`,
      change: "+8%",
      progress: "48%",
      color: "bg-orange-500",
      badge: "bg-green-100 text-green-600",
      icon: Activity,
    },
    {
      title: "Total Clients",
      value: userCount,
      change: "+5%",
      progress: "70%",
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
    {
      title: "Total Paid",
      value: `₹${totalPaid}`,
      change: "0%",
      progress: "15%",
      color: "bg-gray-400",
      badge: "bg-gray-100 text-gray-500",
      icon: AlertCircle,
    },
    {
      title: "Pending Payout",
      value: `₹${remainingPayout}`,
      change: "0%",
      progress: "15%",
      color: "bg-gray-400",
      badge: "bg-gray-100 text-gray-500",
      icon: AlertCircle,
    },
    // {
    //   title: "Pending Tickets",
    //   value: "28",
    //   change: "0%",
    //   progress: "15%",
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
  ];
  const COLORS = ["#D04500", "#F8B08A"];
  return (
    <div className="font-inter">
      <div className="px-4 md:px-8 mt-8">
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
            <p className="text-xs text-blue-700 mt-2">
              <strong>Note:</strong>{" "}
              <span className="font-semibold">
                Total Income,Total Net Earnings,Total Paid
              </span>{" "}
              and
              <span className="font-semibold"> Pending Payout</span> values are
              calculated from overall therapist payments and{" "}
              <strong>
                are not affected by the Start Date and End Date filters.
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 p-4">
        {stats.map((item, index) => {
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
                {item.title === "Total Paid" && (
                  <div className="mt-1">
                    <button
                      onClick={() => setShowPaymentHistory(true)}
                      className="flex items-center gap-1 text-xs font-semibold hover:underline text-primary hover:text-orange-600 transition"
                    >
                      <Eye className="w-3 h-3" />
                      View Payments
                    </button>
                  </div>
                )}

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
      <PaymentHistoryModal
        open={showPaymentHistory}
        onClose={() => setShowPaymentHistory(false)}
        therapist={therapistData}
      />
      {/* <div className="px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-6">
           
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2 rounded-lg">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Domestic Revenue
                </h3>
               
              </div>
            </div>

           
            <div className="grid grid-cols-1   gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Gross Total
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{domesticData}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    GST Component (18%)
                  </p>
                  <p className="text-lg font-bold ">-₹{gstAmount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    Commission (30%)
                  </p>
                  <p className="text-lg font-bold ">-₹{inrCommission}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Net Revenue
                </p>
                <p className="text-lg font-bold ">₹{inrNet}</p>
              </div>
            </div>
          </div>

          
          <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex flex-col gap-6">
            
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

          
            <div className="grid grid-cols-1  gap-4">
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
                  Commission (30%)
                </p>
                <p className="text-lg font-bold ">-${usdCommission}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400">
                  Total Receivables
                </p>
                <p className="text-lg font-bold text-gray-900">${usdNet}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
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

                  
                  <Line
                    type="monotone"
                    dataKey="revenue.INR"
                    stroke="#6366F1"
                    strokeWidth={3}
                    name="INR Revenue"
                  />

                  
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
      </div> */}

      <div className="px-4 md:px-8 mt-8 mb-16">
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-6">
            Session Volume Trend
          </h3>

          {/* Chart */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
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
      {/* <div className="flex flex-col md:flex-row gap-4 p-4 mb-16">
        {weeklyStats.map((stat, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-white border rounded-lg shadow-sm p-4 w-full md:w-1/3 relative"
          >
           
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">{stat.title}</span>
              <span className="text-black font-bold text-xl mt-1">
                {stat.value}
              </span>
            </div>

         
            <div
              className={`absolute top-0 right-0 h-full w-2 rounded-r-lg ${stat.lineColor}`}
            ></div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default TherapistDashboard;
