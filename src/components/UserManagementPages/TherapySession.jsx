import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import axios from "axios";

const TherapySession = ({ user, activeTabDetails }) => {
  const tabs = [
    {
      id: 1,
      label: "Session History",
      color: "text-orange-600",
      iconBg: "bg-orange-600",
    },
    {
      id: 2,
      label: "Cancel Request",
      color: "text-gray-500",
      iconBg: "bg-gray-400",
    },
    {
      id: 3,
      label: "Reschedule Request",
      color: "text-blue-500",
      iconBg: "bg-blue-400",
    },
  ];

  const [statusFilter, setStatusFilter] = useState("All");
  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelRequests, setCancelRequests] = useState([]);
  const [rescheduleRequests, setRescheduleRequests] = useState([]);
  // const getUserSessions = async (userUid) => {
  //   setLoading(true);
  //   const snapshot = await getDocs(collection(db, "therapists"));

  //   const sessions = [];

  //   snapshot.forEach((docSnap) => {
  //     const therapist = docSnap.data();

  //     if (!therapist.slots) return;

  //     therapist.slots.forEach((slot) => {
  //       if (slot.bookedBy?.uid === userUid) {
  //         const now = new Date();
  //         const slotDateTime = new Date(`${slot.date} ${slot.start}`);
  //         const startTime = new Date(`${slot.date} ${slot.start}`);
  //         const endTime = new Date(`${slot.date} ${slot.end}`);

  //         let status = "Scheduled";

  //         if (now >= startTime && now <= endTime) {
  //           status = "Ongoing";
  //         } else if (now > endTime) {
  //           status = "Completed";
  //         }

  //         sessions.push({
  //           therapistId: docSnap.id,
  //           therapistName: therapist.name,
  //           ...slot,
  //           status,
  //           therapist: therapist,
  //         });
  //       }
  //     });
  //   });

  //   console.log("User Sessions:", sessions);
  //   setSessionsData(sessions);
  //   setLoading(false);
  // };
  // const getUserSessions = async (userUid) => {
  //   setLoading(true);

  //   try {
  //     // 1️⃣ Get successful payments of this user
  //     const paymentsRef = collection(db, "payments");
  //     const q = query(
  //       paymentsRef,
  //       where("userId", "==", userUid),
  //       where("status", "==", "success"),
  //     );

  //     const paymentSnapshot = await getDocs(q);

  //     const sessions = [];
  //     const cancels = [];
  //     const reschedules = [];

  //     for (const paymentDoc of paymentSnapshot.docs) {
  //       const payment = paymentDoc.data();
  //       const therapistId = payment.therapistId;

  //       if (!therapistId || therapistId === "Not Applicable") continue;

  //       // 2️⃣ Get therapist data
  //       const therapistRef = doc(db, "therapists", therapistId);
  //       const therapistSnap = await getDoc(therapistRef);

  //       if (!therapistSnap.exists()) continue;

  //       const therapist = therapistSnap.data();

  //       if (!therapist.slots) continue;

  //       therapist.slots.forEach((slot) => {
  //         if (slot.bookedBy?.uid === userUid) {
  //           const now = new Date();
  //           const startTime = new Date(`${slot.date} ${slot.start}`);
  //           const endTime = new Date(`${slot.date} ${slot.end}`);

  //           let status = "Scheduled";

  //           if (now >= startTime && now <= endTime) {
  //             status = "Ongoing";
  //           } else if (now > endTime) {
  //             status = "Completed";
  //           }

  //           sessions.push({
  //             therapistId,
  //             therapistName: therapist.name,
  //             ...slot,
  //             status,
  //             therapist,
  //             payment,
  //           });

  //           if (slot.isCancelRequest) {
  //             cancels.push({
  //               therapistId,
  //               therapistName: therapist.name,
  //               ...slot,
  //               status,
  //               therapist,
  //               payment,
  //               cancelRequestedAt: slot.cancelRequestedAt,
  //             });
  //           }

  //           // Check for reschedule requests
  //           if (slot.isRescheduleRequest && slot.requestedNewSlot) {
  //             reschedules.push({
  //               therapistId,
  //               therapistName: therapist.name,
  //               ...slot,
  //               status,
  //               therapist,
  //               payment,
  //               rescheduleRequestedAt: slot.rescheduleRequestedAt,
  //               requestedNewSlot: slot.requestedNewSlot,
  //             });
  //           }
  //         }
  //       });
  //     }

  //     console.log("User Sessions:", sessions);
  //     setSessionsData(sessions);
  //     setCancelRequests(cancels);
  //     setRescheduleRequests(reschedules);
  //   } catch (error) {
  //     console.error("Error fetching sessions:", error);
  //   }

  //   setLoading(false);
  // };
  const getUserSessions = async (userUid) => {
    setLoading(true);

    try {
      const paymentsRef = collection(db, "payments");
      const q = query(
        paymentsRef,
        where("userId", "==", userUid),
        where("status", "==", "success"),
      );

      const paymentSnapshot = await getDocs(q);

      const sessionMap = new Map(); // key: therapistId + date + start
      const cancelsMap = new Map();
      const reschedulesMap = new Map();

      for (const paymentDoc of paymentSnapshot.docs) {
        const payment = paymentDoc.data();
        const therapistId = payment.therapistId;
        if (!therapistId || therapistId === "Not Applicable") continue;

        const therapistRef = doc(db, "therapists", therapistId);
        const therapistSnap = await getDoc(therapistRef);
        if (!therapistSnap.exists()) continue;
        const therapist = therapistSnap.data();
        if (!therapist.slots) continue;

        therapist.slots.forEach((slot) => {
          // if (slot.bookedBy?.uid !== userUid) return;

          // const now = new Date();
          // const startTime = new Date(`${slot.date} ${slot.start}`);
          // const endTime = new Date(`${slot.date} ${slot.end}`);
          // let status = "Scheduled";
          // if (now >= startTime && now <= endTime) status = "Ongoing";
          // else if (now > endTime) status = "Completed";
          const wasBookedByUser = slot.bookedBy?.uid === userUid;
          const hasCancelHistory = slot.cancelHistory?.some(
            (cancel) => cancel.bookedBy?.uid === userUid,
          );

          const hasRescheduleHistory = slot.rescheduleHistory?.some(
            (reschedule) => reschedule.bookedBy?.uid === userUid,
          );

          if (wasBookedByUser || hasCancelHistory || hasRescheduleHistory) {
            const now = new Date();
            const startTime = new Date(`${slot.date} ${slot.start}`);
            const endTime = new Date(`${slot.date} ${slot.end}`);
            let status = "Scheduled";

            // Check if currently booked by user
            if (wasBookedByUser) {
              if (now >= startTime && now <= endTime) {
                status = "Ongoing";
              } else if (now > endTime) {
                status = "Completed";
              }
            }

            // Check if cancelled
            if (hasCancelHistory && !wasBookedByUser) {
              status = "Cancelled";
            }

            // Check if rescheduled
            if (hasRescheduleHistory && !wasBookedByUser) {
              status = "Rescheduled";

              // Get the reschedule details
              const rescheduleInfo = slot.rescheduleHistory?.find(
                (r) =>
                  r.bookedBy?.uid === userUid && r.status === "rescheduled",
              );

              if (rescheduleInfo) {
                // Store where it was moved to
                slot.movedToSlot = rescheduleInfo.movedToSlot;
              }
            }

            const slotKey = `${therapistId}_${slot.date}_${slot.start}`;

            if (!sessionMap.has(slotKey)) {
              sessionMap.set(slotKey, {
                therapistId,
                therapistName: therapist.name,
                ...slot,
                status,
                therapist,
                payment,
              });
            }

            if (slot.isCancelRequest && !cancelsMap.has(slotKey)) {
              cancelsMap.set(slotKey, {
                therapistId,
                therapistName: therapist.name,
                ...slot,
                status,
                therapist,
                payment,
                cancelRequestedAt: slot.cancelRequestedAt,
              });
            }

            if (
              slot.isRescheduleRequest &&
              slot.requestedNewSlot &&
              !reschedulesMap.has(slotKey)
            ) {
              reschedulesMap.set(slotKey, {
                therapistId,
                therapistName: therapist.name,
                ...slot,
                status,
                therapist,
                payment,
                rescheduleRequestedAt: slot.rescheduleRequestedAt,
                requestedNewSlot: slot.requestedNewSlot,
              });
            }
          }
        });
      }

      // Convert maps to arrays
      const sessions = Array.from(sessionMap.values());
      const cancels = Array.from(cancelsMap.values());
      const reschedules = Array.from(reschedulesMap.values());

      console.log("User Sessions:", sessions);
      setSessionsData(sessions);
      setCancelRequests(cancels);
      setRescheduleRequests(reschedules);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(user);
    if (user) {
      console.log(user);
      getUserSessions(user.uid);
    }
  }, [user]);

  const filteredSessions =
    statusFilter === "All"
      ? sessionsData
      : sessionsData.filter((s) => s.status === statusFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (activeTabDetails) {
      switch (activeTabDetails) {
        case "reschedule":
          setActiveTab(3);
          break;
        case "cancel":
          setActiveTab(2);
          break;

        case "booking":
          setActiveTab(1);
          break;

        default:
          break;
      }
    }
  }, [activeTabDetails]);
  const getCurrentData = () => {
    let data = [];
    if (activeTab === 1) data = filteredSessions;
    else if (activeTab === 2) data = cancelRequests;
    else if (activeTab === 3) data = rescheduleRequests;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return {
      currentData: data.slice(indexOfFirstRow, indexOfLastRow),
      totalPages: Math.ceil(data.length / rowsPerPage),
      totalCount: data.length,
    };
  };

  const { currentData, totalPages, totalCount } = getCurrentData();
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
  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate(); // Firestore timestamp → JS Date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  console.log(sessionsData, cancelRequests, rescheduleRequests);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const handleWithdrawCancelRequest = async (request) => {
    console.log(request);
    const result = await Swal.fire({
      title: "Confirm Cancellation",
      text: "Do you really want to cancel this session?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Confirm",
      cancelButtonText: "Go Back",
    });
    if (!result.isConfirmed) return;

    try {
      setIsWithdrawing(true);
      const therapistRef = doc(db, "therapists", request.therapistId);
      const snap = await getDoc(therapistRef);

      const therapistData = snap.data();
      const slots = therapistData.slots || [];

      const slotIndex = slots.findIndex(
        (s) =>
          s.date === request.date &&
          s.start === request.start &&
          s.end === request.end &&
          s.bookedBy?.uid === user.uid,
      );

      if (slotIndex === -1) {
        toast.error("Slot not found");
        return;
      }

      // Get the current slot data
      const currentSlot = slots[slotIndex];

      // Create cancel history entry
      const cancelEntry = {
        bookedBy: currentSlot.bookedBy,
        cancelRequestedAt: currentSlot.cancelRequestedAt,
        cancelReason: currentSlot.cancelReason || null,
        withdrawnAt: new Date(),
        status: "withdrawn",
      };

      // Get existing cancelHistory or create new array
      const cancelHistory = currentSlot.cancelHistory || [];
      cancelHistory.push(cancelEntry);

      // Reset the slot to available but keep cancel history
      slots[slotIndex] = {
        date: currentSlot.date,
        day: currentSlot.day,
        start: currentSlot.start,
        end: currentSlot.end,
        isBooked: false,
        isCancelRequest: false,
        cancelRequestedAt: null,
        cancelReason: null,
        bookedBy: null,
        lockTime: null,
        lockedBy: null,
        cancelHistory: cancelHistory, // Store all cancel history in the slot
      };

      // Update Firestore
      await updateDoc(therapistRef, { slots });
      console.log(currentSlot.bookedBy.orderid);
      try {
        const res = await axios.post(
          // "http://127.0.0.1:5001/steer-u/us-central1/refundPayment",
          "https://us-central1-steer-u.cloudfunctions.net/refundPayment",
          {
            orderId: currentSlot.bookedBy.orderid,
          },
        );

        console.log("Refund response:", res.data);
        toast.success("Refund processed successfully!");
      } catch (error) {
        console.error("Refund failed:", error.response?.data || error.message);
        toast.error("Refund failed. Check console for details.");
      }

      toast.success("Cancel request withdrawn successfully");

      // Refresh the data
      getUserSessions(user.uid);
    } catch (error) {
      console.error(error);
      toast.error("Failed to withdraw request");
    } finally {
      setIsWithdrawing(false); // ✅ stop waiting
    }
  };

  const handleConfirmReschedule = async (request) => {
    const result = await Swal.fire({
      title: "Confirm Reschedule?",
      html: `
      <p>Move your session from:</p>
      <p><strong>${request.date}</strong> (${formatTime(request.start)} - ${formatTime(request.end)})</p>
      <p>To:</p>
      <p><strong>${request.requestedNewSlot?.date}</strong> (${formatTime(request.requestedNewSlot?.start)} - ${formatTime(request.requestedNewSlot?.end)})</p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm reschedule",
    });

    if (!result.isConfirmed) return;

    try {
      setIsWithdrawing(true);
      const therapistRef = doc(db, "therapists", request.therapistId);
      const snap = await getDoc(therapistRef);

      const therapistData = snap.data();
      const slots = therapistData.slots || [];

      // Find the original slot (with reschedule request)
      const originalSlotIndex = slots.findIndex(
        (s) =>
          s.date === request.date &&
          s.start === request.start &&
          s.end === request.end &&
          s.bookedBy?.uid === user.uid &&
          s.isRescheduleRequest === true,
      );

      // Find the new slot (locked for reschedule)
      const newSlotIndex = slots.findIndex(
        (s) =>
          s.date === request.requestedNewSlot?.date &&
          s.start === request.requestedNewSlot?.start &&
          s.end === request.requestedNewSlot?.end &&
          s.lockedBy === user.uid &&
          s.isLockedForReschedule === true,
      );

      if (originalSlotIndex === -1) {
        toast.error("Original slot not found");
        return;
      }

      if (newSlotIndex === -1) {
        toast.error("New slot not found");
        return;
      }

      // Get the original slot data
      const originalSlot = slots[originalSlotIndex];

      // Create reschedule history entry for the original slot
      const rescheduleEntry = {
        bookedBy: originalSlot.bookedBy,
        movedToSlot: {
          date: request.requestedNewSlot.date,
          day: request.requestedNewSlot.day,
          start: request.requestedNewSlot.start,
          end: request.requestedNewSlot.end,
        },
        rescheduleRequestedAt: originalSlot.rescheduleRequestedAt,
        rescheduleConfirmedAt: new Date(),
        rescheduleReason: originalSlot.rescheduleReason || null,
        status: "rescheduled",
      };

      // Get existing rescheduleHistory or create new array
      const rescheduleHistory = originalSlot.rescheduleHistory || [];
      rescheduleHistory.push(rescheduleEntry);

      // Reset the original slot to available and store history
      slots[originalSlotIndex] = {
        date: originalSlot.date,
        day: originalSlot.day,
        start: originalSlot.start,
        end: originalSlot.end,
        isBooked: false,
        bookedBy: null,
        lockTime: null,
        lockedBy: null,
        isRescheduleRequest: false,
        rescheduleRequestedAt: null,
        rescheduleReason: null,
        requestedNewSlot: null,
        rescheduleHistory: rescheduleHistory, // Store reschedule history
      };

      // Book the new slot with all booking details
      slots[newSlotIndex] = {
        date: slots[newSlotIndex].date,
        day: slots[newSlotIndex].day,
        start: slots[newSlotIndex].start,
        end: slots[newSlotIndex].end,
        isBooked: true,
        bookedBy: originalSlot.bookedBy, // Transfer booking info
        lockTime: Date.now(),
        lockedBy: originalSlot.bookedBy.uid,
        isLockedForReschedule: false,
      };

      // Update Firestore
      await updateDoc(therapistRef, { slots });

      toast.success("Session rescheduled successfully! 🎉");

      // Refresh the data
      getUserSessions(user.uid);
    } catch (error) {
      console.error(error);
      toast.error("Failed to reschedule session");
    } finally {
      setIsWithdrawing(false);
    }
  };
  return (
    <div className="">
      {/* <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
       
        <div className="flex items-center gap-4">
       
          <div className="relative w-24 h-24">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profile"
              className="w-full h-full rounded-xl border-4 border-gray-50 shadow-sm object-cover"
            />
           
            <div className="absolute bottom-0 right-0 bg-green-500 border-4 border-white rounded-full px-2 py-0.5 flex items-center justify-center text-white text-xs font-bold uppercase">
              Online
            </div>
          </div>

         
          <div className="flex flex-col gap-1">
            <h2 className="text-gray-900 font-bold text-xl md:text-2xl">
              {user?.fullName}
            </h2>
            <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base">
              <div className="w-3 h-2 bg-gray-400"></div>
              <span>Software Engineer at Company</span>
            </div>
          </div>
        </div>
      </div> */}

      <div className="border-b border-orange-100  p-4 md:p-6">
        <div className="flex gap-6 overflow-x-auto  flex-row flex-wrap">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-row items-center gap-2 pb-2 border-b-2 ${
                  isActive ? "border-orange-600" : "border-transparent"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full ${
                    isActive ? "bg-orange-600" : "bg-gray-400"
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-orange-600" : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {activeTab === 1 && (
        <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Session History
          </h2>

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            {/* <input
            type="text"
            placeholder="Filter by therapist or date..."
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          /> */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="All">All</option>
              <option value="Completed">Completed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Therapist
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Session Date & Time
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  {/* <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Action
                </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      Loading sessions...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No sessions found
                    </td>
                  </tr>
                ) : (
                  currentData.map((session, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 py-2 text-xs text-gray-800">
                        {session.therapistName}
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-800">
                        <div>{session.date}</div>
                        <div className="text-gray-500 text-sm">
                          {formatTime(session.start)} -{" "}
                          {formatTime(session.end)}
                        </div>
                        {session.status === "Rescheduled" &&
                          session.movedToSlot && (
                            <div className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                              <ArrowRight className="w-3 h-3" />
                              Moved to {session.movedToSlot.date} (
                              {formatTime(session.movedToSlot.start)} -{" "}
                              {formatTime(session.movedToSlot.end)})
                            </div>
                          )}
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-800">
                        {session.status === "Rescheduled" ||
                        session.status === "Cancelled"
                          ? "-"
                          : session.payment
                            ? user.locationData &&
                              user.locationData.country === "India"
                              ? `₹${session.payment.inrprice}`
                              : `$${session.payment.usdprice}`
                            : 0}
                      </td>
                      <td
                        className={`px-2 py-2 text-xs font-medium ${
                          session.status === "Completed"
                            ? "text-green-600"
                            : session.status === "Scheduled"
                              ? "text-blue-600"
                              : "text-red-600"
                        }`}
                      >
                        {session.status}
                      </td>
                      {/* <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer">
                    {session.type}
                  </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
            <div>
              <h1 className="font-bold text-xs text-black">
                Total Data: {filteredSessions.length}
              </h1>
            </div>
            <div className="flex gap-1 items-center  px-6 py-4 ">
              {/* Previous */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
              >
                Prev
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {currentPage}/{totalPages}
              </div>

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {activeTab === 2 && (
        <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Cancel Requests
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Therapist
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Session Details
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Requested At
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      Loading cancel requests...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-500">
                      No cancel requests found
                    </td>
                  </tr>
                ) : (
                  currentData.map((request, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          {request.therapistImage && (
                            <img
                              src={request.therapistImage}
                              alt={request.therapistName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="text-xs font-semibold text-gray-800">
                              {request.therapistName}
                            </div>
                            {request.therapistBio && (
                              <div className="text-xs text-gray-500">
                                {request.therapistBio.substring(0, 30)}...
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-800">
                        <div className="font-medium">{request.date}</div>
                        <div className="text-gray-500">
                          {formatTime(request.start)} -{" "}
                          {formatTime(request.end)}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-600">
                        {formatDate(request.cancelRequestedAt)}
                      </td>
                      <td className="px-2 py-2">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          Pending Approval
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center items-center flex">
                        <button
                          disabled={isWithdrawing}
                          onClick={() => handleWithdrawCancelRequest(request)}
                          className="px-3 py-1 text-xs font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                        >
                          {isWithdrawing ? "Processing..." : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
            <div>
              <h1 className="font-bold text-xs text-black">
                Total Requests: {totalCount}
              </h1>
            </div>
            <div className="flex gap-1 items-center px-6 py-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
              >
                Prev
              </button>
              <div className="flex gap-2">
                {currentPage}/{totalPages || 1}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Requests Tab */}
      {activeTab === 3 && (
        <div className="p-6 bg-white rounded-xl shadow-md w-full max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Reschedule Requests
          </h2>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-6 text-gray-500">
                Loading reschedule requests...
              </div>
            ) : currentData.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No reschedule requests found
              </div>
            ) : (
              currentData.map((request, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Therapist Info */}
                  <div className="flex items-center gap-3 mb-4">
                    {request.therapistImage && (
                      <img
                        src={request.therapistImage}
                        alt={request.therapistName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-gray-800">
                        {request.therapistName}
                      </div>
                      {request.therapistBio && (
                        <div className="text-xs text-gray-500">
                          {request.therapistBio}
                        </div>
                      )}
                    </div>
                    {/* Withdraw Button */}
                    <button
                      disabled={isWithdrawing}
                      onClick={() => handleConfirmReschedule(request)}
                      className="px-4 py-2 text-xs font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-md transition-colors"
                    >
                      {isWithdrawing ? "Processing..." : "Confirm Reschedule"}
                    </button>
                  </div>

                  {/* Original and New Slot Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Original Slot */}
                    <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                      <div className="text-xs font-semibold text-red-700 mb-2">
                        Original Slot
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        {request.date}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatTime(request.start)} - {formatTime(request.end)}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <ArrowRight className="w-6 h-6 text-blue-500" />
                    </div>

                    {/* Requested New Slot */}
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs font-semibold text-green-700 mb-2">
                        Requested New Slot
                      </div>
                      {request.requestedNewSlot ? (
                        <>
                          <div className="text-sm font-medium text-gray-800">
                            {request.requestedNewSlot.date}
                          </div>
                          <div className="text-xs text-gray-600">
                            {formatTime(request.requestedNewSlot.start)} -{" "}
                            {formatTime(request.requestedNewSlot.end)}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-gray-500">
                          Not specified
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Request Info */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
                    <div className="text-xs text-gray-600">
                      Requested: {formatDate(request.rescheduleRequestedAt)}
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      Pending Approval
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200 mt-6">
            <div>
              <h1 className="font-bold text-xs text-black">
                Total Requests: {totalCount}
              </h1>
            </div>
            <div className="flex gap-1 items-center px-6 py-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
              >
                Prev
              </button>
              <div className="flex gap-2">
                {currentPage}/{totalPages || 1}
              </div>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 text-sm border border-primary rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapySession;
