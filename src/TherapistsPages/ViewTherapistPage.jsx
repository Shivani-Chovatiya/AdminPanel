import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../config/firebase";
import Switch from "react-switch";
import container from "../assets/Container.png";
import whitecontainer from "../assets/whiteContainer.png";
import SessionsTable from "./SessionsTable";
import { toast } from "react-toastify";

const ProcessPaymentModal = ({
  open,
  onClose,
  totalNetEarning,
  therapist,
  fetchTherapist,
}) => {
  const [payAmount, setPayAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");

  const previousPayments = therapist?.payments || [];

  const totalPaid = previousPayments.reduce(
    (sum, payment) => sum + (payment.amountPaid || 0),
    0,
  );

  const remainingPayout = totalNetEarning - totalPaid;

  const handleAmountChange = (e) => {
    const value = Number(e.target.value);

    if (value > remainingPayout) {
      toast.error("Amount cannot exceed remaining payout");
      return;
    }

    setPayAmount(value);
  };

  const remainingAfterPayment = remainingPayout - (Number(payAmount) || 0);
  const handleConfirmPayment = async () => {
    try {
      if (!payAmount) {
        toast.warning("Enter payment amount");
        return;
      }
      if (!paymentMode) {
        toast.warning("Please select payment mode");
        return;
      }

      if (paymentMode !== "Cash" && !transactionId) {
        toast.warning("Enter transaction reference");
        return;
      }
      const paymentData = {
        amountPaid: Number(payAmount),
        paymentMode,
        transactionId,
        notes,
        createdAt: new Date(),
      };

      const updatedPayments = [...previousPayments, paymentData];

      await updateDoc(doc(db, "therapists", therapist.id), {
        payments: updatedPayments,
      });

      toast.success("Payment recorded successfully");
      setTransactionId("");
      setNotes("");
      setPaymentMode("");
      setPayAmount("");
      fetchTherapist();
      onClose();
    } catch (error) {
      toast.error("Payment failed");
      console.error(error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-900">Process Payment</h2>

          <p className="text-sm text-slate-500 mt-1">
            Settling accounts for{" "}
            <span className="font-semibold">Dr. Jane Smith</span>
          </p>

          {/* <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
              ACTIVE
            </span>

            <span className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded">
              Clinical Psychologist • Senior Associate
            </span>
          </div> */}
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">
          {/* EARNINGS CARDS */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border rounded-xl p-4">
              <p className="text-sm text-slate-500">Total Earnings (MTD)</p>
              <h3 className="text-xl font-bold">$12,450.00</h3>
            </div>

            <div className="bg-slate-50 border rounded-xl p-4">
              <p className="text-sm text-slate-500">Unpaid Balance</p>
              <h3 className="text-xl font-bold text-orange-600">$3,200.00</h3>
            </div>

            <div className="bg-slate-50 border rounded-xl p-4">
              <p className="text-sm text-slate-500">Last Payment</p>
              <h3 className="text-xl font-bold">Oct 15, 2023</h3>
            </div>
          </div> */}

          {/* DATE RANGE */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Period Start Date
              </label>
              <input
                type="date"
                className="w-full mt-1 border rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Period End Date
              </label>
              <input
                type="date"
                className="w-full mt-1 border rounded-lg px-3 py-2 bg-slate-50"
              />
            </div>
          </div> */}

          {/* AMOUNT */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Gross Amount
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 bg-slate-50">
              <span className="text-slate-400 mr-2">₹{totalNetEarning}</span>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Commission Deduction (30%)
            </p>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Enter Payment Amount
            </label>

            <div className="flex items-center border rounded-lg px-3 py-2 mt-1 bg-slate-50">
              <span className="text-slate-400 mr-2">₹</span>

              <input
                type="number"
                value={payAmount}
                onChange={handleAmountChange}
                max={totalNetEarning}
                min={0}
                onWheel={(e) => e.target.blur()}
                placeholder="Enter amount"
                className="w-full bg-transparent outline-none"
              />
            </div>

            <p className="text-xs text-slate-500 mt-1">
              Remaining payout: ₹{remainingPayout}
            </p>
          </div>
          {/* NET PAYABLE */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">
              Remaining Payout After Payment
            </p>

            <h3 className="text-3xl font-black text-orange-600 mt-1">
              ₹
              {remainingAfterPayment >= 0
                ? remainingAfterPayment.toFixed(2)
                : remainingPayout}
            </h3>

            <p className="text-xs text-orange-500 mt-1">
              Automatically updated after payment
            </p>
          </div>

          {/* PAYMENT MODE */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Payment Mode
            </label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full mt-1 border rounded-lg px-3 py-2 bg-slate-50"
            >
              <option value="">Select Payment Mode</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
              <option value="PayPal">PayPal</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          {/* TRANSACTION ID */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Transaction Reference
            </label>

            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="TXN-9928374-X"
              className="w-full mt-1 border rounded-lg px-3 py-2 bg-slate-50"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Notes & Comments
            </label>

            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details for the recipient..."
              className="w-full mt-1 border rounded-lg px-3 py-2 bg-slate-50"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t">
          <button
            onClick={() => {
              setTransactionId("");
              setNotes("");
              setPaymentMode("");
              setPayAmount("");
              onClose();
              fetchTherapist();
            }}
            className="px-5 py-2 rounded-lg border text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmPayment}
            className="px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow-md hover:opacity-90"
          >
            Confirm & Mark as Paid
          </button>
        </div>
      </div>
    </div>
  );
};
export const PaymentHistoryModal = ({ open, onClose, therapist }) => {
  if (!open) return null;

  const payments = therapist?.payments || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Payment History</h2>

          <button onClick={onClose} className="text-slate-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* TABLE */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100">
              <tr className="text-left text-sm text-slate-600">
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Transaction ID</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>

            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-slate-400">
                    No payments recorded
                  </td>
                </tr>
              ) : (
                payments.map((payment, index) => (
                  <tr
                    key={index}
                    className="border-t text-sm hover:bg-slate-50"
                  >
                    <td className="p-3">
                      {payment.createdAt?.toDate().toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="p-3 font-semibold text-green-600">
                      ₹{payment.amountPaid}
                    </td>

                    <td className="p-3">{payment.paymentMode}</td>

                    <td className="p-3">{payment.transactionId || "-"}</td>

                    <td className="p-3">{payment.notes || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const ViewTherapistPage = () => {
  const [therapist, setTherapist] = useState();
  const navigate = useNavigate();
  const [totalSlots, setTotalSlots] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const { id } = useParams();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const fetchTherapist = async () => {
    try {
      const finalid = id;
      const docRef = doc(db, "therapists", finalid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        setTherapist({ id, ...data });
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch therapist data");
    }
  };
  useEffect(() => {
    if (id) {
      fetchTherapist();
    }
  }, [id]);

  const [paymentsData, setPaymentsData] = useState([]);
  useEffect(() => {
    const fetchPayments = async () => {
      const q = query(
        collection(db, "payments"),
        where("therapistId", "==", therapist.id),
        where("status", "==", "success"),
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      console.log(data);
      setPaymentsData(data);
    };

    if (therapist) {
      console.log(therapist);
      fetchPayments();
    }
  }, [therapist]);

  const getSlotsRevenue = async (slots) => {
    let totalSlots = 0;
    let totalRevenue = 0;

    for (const slot of slots) {
      if (slot.isBooked && slot.bookedBy?.orderid) {
        totalSlots++;

        const q = query(
          collection(db, "payments"),
          where("orderid", "==", slot.bookedBy.orderid),
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((doc) => {
          const data = doc.data();
          totalRevenue += data.amount || 0;
        });
      }
    }

    return { totalSlots, totalRevenue };
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSlotsRevenue(therapist.slots);

      setTotalSlots(result.totalSlots);
      setRevenue(result.totalRevenue);
    };

    if (therapist?.slots) {
      fetchData();
    }
  }, [therapist]);

  const getCurrentWeek = () => {
    const today = new Date();
    const day = today.getDay(); // 0=Sun

    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const monday = new Date(today.setDate(diff));

    const week = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      week.push({
        day: d.toLocaleDateString("en-US", { weekday: "long" }),
        short: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.toISOString().split("T")[0],
        dayNumber: d.getDate(),
      });
    }

    return week;
  };

  const weekDays = getCurrentWeek();

  const slotsByDay = weekDays.map((day) => {
    const daySlots = therapist?.slots?.filter((slot) => slot.date === day.date);

    return {
      ...day,
      slots: daySlots || [],
    };
  });

  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const sessions = (therapist?.slots || [])
    .filter((slot) => slot.isBooked)
    .map((slot) => {
      const slotDateTime = new Date(`${slot.date}T${slot.start}`);
      const now = new Date();

      return {
        date: new Date(slot.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
        user: slot.bookedBy?.name || "Unknown",
        type: slot.meetingLink ? "Video Call" : "-",
        status: slotDateTime > now ? "Upcoming" : "Completed",
      };
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const formatJoinedDate = (timestamp) => {
    if (!timestamp) return "N/A";

    // Convert Firestore timestamp to JS Date if needed
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    // Format like: "January 12, 2022"
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `Joined ${formatted}`;
  };

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const payments = [
    {
      amount: 3200,
      status: "success",
      createdAt: { seconds: 1697366400 }, // Example: Oct 15, 2023
    },
    {
      amount: 12450,
      status: "success",
      createdAt: { seconds: 1695024000 }, // Example: Sep 18, 2023
    },
  ];

  useEffect(() => {
    if (!paymentsData?.length) return;

    const successPayments = paymentsData.filter((p) => p.status === "success");
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
    setTotalEarnings(totals);

    // const lastPayment = successPayments[successPayments.length - 1];
    // setLastPaymentDate(
    //   lastPayment?.createdAt
    //     ? new Date(lastPayment.createdAt.seconds * 1000)
    //     : null
    // );

    // const lastPaidAmount = lastPayment?.amount || 0;
    // setUnpaidBalance(total - lastPaidAmount);
  }, [paymentsData]);
  console.log(totalEarnings);

  const inrRevenue = totalEarnings.INR || 0;
  // const usdRevenue = totalEarnings.USD || 0;
  const usdRevenue = totalEarnings.totalTheapistAmountUSDToINR || 0;
  // INR GST
  const gstAmount = inrRevenue * 0.18;
  const inrWithGst = inrRevenue - gstAmount;

  // Commission
  const inrCommission = inrWithGst * 0.3;
  const usdCommission = usdRevenue * 0.3;

  // Net earnings
  const inrNet = inrWithGst - inrCommission;
  const usdNet = usdRevenue - usdCommission;

  // const totalNetEarning = inrNet + usdNet * 80;
  const totalNetEarning = inrNet + usdNet;
  const previousPayments = therapist?.payments || [];

  const totalPaid = previousPayments.reduce(
    (sum, payment) => sum + (payment.amountPaid || 0),
    0,
  );

  const remainingPayout = totalNetEarning - totalPaid;
  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      {/* Back Button */}
      <div className="p-4 md:p-6 gap-3 justify-between flex flex-col-reverse md:flex-row">
        <div>
          <h1 className="text-xl font-bold">{therapist?.name}</h1>
          <h1 className="text-xs text-gray-400 font-bold">
            {therapist?.createdAt ? formatJoinedDate(therapist?.createdAt) : ""}
          </h1>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <button
            className="border border-primary text-primary rounded-full px-6 py-2 hover:bg-primary hover:text-white transition"
            onClick={() => navigate("/therapist")}
          >
            Back
          </button>
          <button
            className="flex flex-row gap-2 border border-primary bg-white text-primary  rounded-full px-6 py-2 hover:bg-primary hover:text-white transition"
            onClick={() => setShowPaymentHistory(true)}
          >
            <h1>View Payment</h1>
          </button>
          <button
            className="flex flex-row gap-2 border border-primary bg-primary text-white rounded-full px-6 py-2 hover:bg-primary hover:text-white transition"
            onClick={() => setShowPaymentModal(true)}
          >
            <img src={whitecontainer} className="w-5 h-5" />
            <h1>Make Payment</h1>
          </button>
        </div>
      </div>
      <ProcessPaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalNetEarning={totalNetEarning}
        therapist={therapist}
        fetchTherapist={fetchTherapist}
      />
      <PaymentHistoryModal
        open={showPaymentHistory}
        onClose={() => setShowPaymentHistory(false)}
        therapist={therapist}
      />
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <p className="text-xs font-semibold text-blue-900">
          Revenue Calculation Note
        </p>

        <ul className="text-xs text-blue-700 list-disc ml-4 mt-1 space-y-1">
          <li>
            <strong>Domestic (INR):</strong> Session count × INR session price.
          </li>
          <li>
            <strong>Overseas (USD):</strong> For therapist payout, USD session
            count is calculated using the equivalent{" "}
            <strong>INR session price</strong>.<br></br>
            <strong>Overseas (USD):</strong> Therapist payout uses USD session
            count × INR price
          </li>
          <li>
            The <strong>original USD amount</strong> collected from overseas
            users is still displayed in <strong>USD</strong> for reference.
          </li>
          <li>
            Original USD payment from users:
            <span className="font-semibold"> ${totalEarnings.USD}</span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6">
        {/* Therapist Profile Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 ">
          {/* Profile Section */}
          <div className="flex flex-col items-center text-center gap-3">
            {therapist?.imageUrl ? (
              <img
                src={therapist?.imageUrl}
                alt={therapist?.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow"
              />
            ) : (
              <div className="justify-center items-center text-primary font-bold  text-xl md:text-4xl  flex w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow">
                {therapist?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800">
              {therapist?.name}
            </h2>

            <p className="text-gray-500 max-w-md">{therapist?.bio}</p>

            <p className="text-gray-600 text-sm">📞 {therapist?.phone}</p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6 mt-6 border-t pt-6">
            {/* Experience */}
            <div>
              <p className="text-sm text-gray-500 font-medium">Experience</p>
              <p className="text-lg font-semibold text-gray-800">
                {therapist?.experience}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500 font-medium mb-2">Status</p>
              <div className="flex items-center gap-3">
                <Switch
                  checked={therapist?.status === "Active"}
                  disabled
                  onColor="#22C55E"
                  offColor="#E5E7EB"
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={22}
                  width={48}
                />
                <span
                  className={`text-sm font-semibold ${
                    therapist?.status === "Active"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {therapist?.status}
                </span>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="mt-6 border-t pt-6">
            <p className="text-sm text-gray-500 font-medium mb-2">
              Qualifications
            </p>
            <p className="text-gray-700 leading-relaxed">
              {therapist?.qualifications}
            </p>
          </div>
        </div>

        {/* Right Side Card */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 ">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Earnings Overview
            </h3>

            <img src={container} alt="icon" className="w-5 h-4 opacity-60" />
          </div>

          {/* Total Revenue */}

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-[12px] font-bold text-orange-600 tracking-widest uppercase">
              Total Income
            </p>

            <h2 className="text-3xl font-black text-slate-900 mt-1">
              ₹{totalEarnings.INR ? totalEarnings.INR.toFixed(0) : 0}
              <span className="text-xs font-bold">(Domestic)</span>
            </h2>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              {/* ₹{totalEarnings.USD ? totalEarnings.USD.toFixed(0) : 0} */}₹
              {usdRevenue}
              <span className="text-xs font-bold">(Overseas)</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <p className="text-xs text-slate-400">Domestic Session Count</p>
              <p className="text-base font-bold text-rose-500">
                {/* -${usdCommission.toFixed(2)} */}
                {totalEarnings?.totalINRSession}
              </p>
            </div>{" "}
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-slate-400">Overseas Session Count</p>
                <p className="text-base font-bold text-rose-500">
                  {/* -${usdCommission.toFixed(2)} */}
                  {totalEarnings?.totalUSDSession}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col  justify-between mb-4">
            <p className="text-[12px] font-bold text-black tracking-widest uppercase">
              For Domestic Income
            </p>
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-xs text-slate-400">GST (18%)</p>
                <p className="text-base font-bold text-orange-500">
                  -₹{gstAmount.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Commission (30%)</p>
                <p className="text-base font-bold text-rose-500">
                  -₹{inrCommission.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Net Earnings</p>
                <p className="text-base font-bold text-emerald-500">
                  ₹{inrNet.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          {/* USD Earnings */}
          <div className="flex flex-col justify-between">
            <p className="text-[12px] font-bold text-black tracking-widest uppercase">
              For Overseas Income
            </p>
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="text-xs text-slate-400">Commission (30%)</p>
                <p className="text-base font-bold text-rose-500">
                  {/* -${usdCommission.toFixed(2)} */}
                  -₹{usdCommission.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">Net Earnings</p>
                <p className="text-base font-bold text-emerald-500">
                  {/* ${usdNet.toFixed(2)} */}₹{usdNet.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3 mb-3">
            <p className="text-[12px] font-bold text-orange-600 tracking-widest uppercase">
              Total Net Earnings
            </p>

            <h2 className="text-3xl font-black text-slate-900 mt-1">
              ₹{totalNetEarning}
              {/* <h1 className="text-xs text-gray-400 font-bold">
                ({inrNet}+({usdNet}*80))
              </h1> */}
              {/* </h2>
            <h2 className="text-3xl font-black text-slate-900 mt-1">
              ${totalEarnings.USD ? totalEarnings.USD.toFixed(0) : 0} */}
            </h2>
          </div>
          {/* Divider */}
          <div className="border-t border-slate-100 pt-4 flex justify-between mb-6">
            <div>
              <p className="text-xs text-slate-400">Pending Payout</p>
              <p className="text-lg font-bold text-slate-900">
                ₹{remainingPayout}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-400">Total Paid</p>
              <p className="text-lg font-bold text-slate-900">₹{totalPaid}</p>
            </div>
          </div>

          {/* Revenue Breakdown */}

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                <span className="text-sm text-slate-500">Domestic</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                ₹{totalEarnings.INR ? totalEarnings.INR.toFixed(0) : 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#F8B08A] rounded-full"></span>
                <span className="text-sm text-slate-500">Overseas</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {/* ${totalEarnings.USD ? totalEarnings.USD.toFixed(0) : 0} */}₹
                {usdRevenue}
              </span>
            </div>

            {/* Optional Progress Bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full flex overflow-hidden mt-2">
              <div
                className="bg-orange-600 h-full"
                style={{
                  // width: `${(totalEarnings.INR / (totalEarnings.INR + totalEarnings.USD)) * 100}%`,
                  width: `${(totalEarnings.INR / (totalEarnings.INR + usdRevenue)) * 100}%`,
                }}
              ></div>
              <div
                className="bg-[#F8B08A] h-full"
                style={{
                  // // width: `${(totalEarnings.USD / (totalEarnings.INR + totalEarnings.USD)) * 100}%`,
                  width: `${(usdRevenue / (totalEarnings.INR + usdRevenue)) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Availability</h3>
              <p className="text-sm text-slate-500">
                Manage therapist weekly schedule
              </p>
            </div>

            {/* <button className="flex items-center gap-2 text-sm font-semibold text-[#D14600] bg-orange-50 px-3 py-1.5 rounded-md w-fit">
              <span className="w-3 h-3 bg-[#D14600] rounded-full"></span>
              Edit
            </button> */}
          </div>

          {/* Week Grid */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {slotsByDay.map((day, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border rounded-lg p-2"
              >
                {/* Day Header */}
                <div className="text-center border-b pb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    {day.short}
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {day.dayNumber}
                  </p>
                </div>

                {/* Slots */}
                {day.slots.length > 0 ? (
                  day.slots.map((slot, i) => (
                    <div
                      key={i}
                      className={`text-[10px] font-bold py-1 rounded text-center ${
                        slot.isBooked
                          ? "bg-[#D14600] text-white"
                          : "bg-orange-50 border border-orange-200 text-[#D14600]"
                      }`}
                    >
                      {slot.start} - {slot.end}
                    </div>
                  ))
                ) : (
                  <div className="text-[10px] text-slate-400 py-2 text-center">
                    Empty
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <SessionsTable sessions={sessions} />
      </div>
    </div>
  );
};

export default ViewTherapistPage;
