// import { CalendarDays, Clock, Video } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import ViewSessionDetails from "./ViewSessionDetails";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import AddMeetingLinkModal from "../../components/AddMeetingLinkModal";

// // const sessions = [
// //   {
// //     id: 1,
// //     name: "Sarah Johnson",
// //     time: "04:00 PM",
// //     date: "Feb 22, 2026",
// //     type: props.therapist.serviceType,
// //     needsLink: true,
// //   },
// //   {
// //     id: 2,
// //     name: "Michael Smith",
// //     time: "06:30 PM",
// //     date: "Feb 23, 2026",
// //     type: "Couple Therapy",
// //     needsLink: false,
// //   },
// // ];

// const TodayPage = (props) => {
//   const [sessionData, setSessionData] = useState();
//   const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
//   const [selectedSession, setSelectedSession] = useState(null);
//   console.log(props);
//   const [sessions, setSessions] = useState();
//   const formatTime = (time) => {
//     const [hour, minute] = time.split(":");
//     const date = new Date();
//     date.setHours(hour);
//     date.setMinutes(minute);

//     return date.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };
//   const fetchSessions = async () => {
//     if (!props.todaySlots) return;

//     // Map slots to sessions with user info
//     const sessionsWithUser = await Promise.all(
//       props.todaySlots.map(async (slot) => {
//         let userData = null;
//         try {
//           const userSnap = await getDoc(doc(db, "users", slot.bookedBy.uid));
//           if (userSnap.exists()) {
//             userData = userSnap.data();
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }

//         return {
//           id: slot.start + slot.end, // unique key

//           date: slot.date,
//           time: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
//           type: props.therapist.serviceType, // you can customize or fetch from slot
//           needsLink: slot.meetingLink ? false : true, // example, you can adjust
//           ...userData,
//           therapist: props.therapist,
//           meetingLink: slot.meetingLink || null,
//           status,
//         };
//       }),
//     );

//     setSessions(sessionsWithUser);
//   };
//   useEffect(() => {
//     fetchSessions();
//   }, [props.todaySlots]);
//   console.log(sessions);
//   return (
//     <div>
//       {props.isViewOpen && (
//         <ViewSessionDetails
//           setIsViewOpen={props.setIsViewOpen}
//           session={sessionData}
//           fetchSessions={fetchSessions}
//           fetchTherapist={props.fetchTherapist}
//         />
//       )}
//       {!props.isViewOpen && (
//         <div className="w-full flex flex-col items-center mt-16 px-4 gap-8">
//           {sessions ? (
//             sessions.length > 0 ? (
//               sessions.map((session) => (
//                 <div
//                   key={session.id}
//                   className="w-full max-w-5xl bg-white border border-gray-300 rounded-3xl p-6 space-y-6"
//                 >
//                   {/* Header */}
//                   <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                     {/* Session Info */}
//                     <div className="space-y-2">
//                       <h2 className="text-xl md:text-2xl font-semibold">
//                         You have a session with{" "}
//                         <span className="font-bold">{session.fullName}</span> at{" "}
//                         {session.time}
//                       </h2>

//                       {/* Meta Info */}
//                       <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm md:text-base">
//                         <div className="flex items-center gap-2">
//                           <CalendarDays size={18} />
//                           <span>{session.date}</span>
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <Clock size={18} />
//                           <span>{session.time}</span>
//                         </div>

//                         <div className="flex items-center gap-2">
//                           <Video size={18} />
//                           <span>{session.type}</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* View Button */}
//                     <button
//                       onClick={() => {
//                         setSessionData(session);
//                         props.setIsViewOpen(true);
//                       }}
//                       className="border border-gray-300 rounded-lg px-6 py-2 text-sm md:text-base hover:bg-gray-50 transition"
//                     >
//                       View Details
//                     </button>
//                   </div>

//                   {session.needsLink ? (
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-orange-100 border border-orange-600 rounded-xl p-4">
//                       <p className="text-orange-700 text-sm md:text-base font-medium">
//                         Please provide joining meeting link
//                       </p>

//                       <button
//                         onClick={() => {
//                           setSelectedSession(session);
//                           setIsAddLinkOpen(true);
//                         }}
//                         className="bg-orange-600 text-white rounded-lg px-4 py-2 text-sm md:text-base hover:bg-orange-700 transition"
//                       >
//                         + Add Link
//                       </button>
//                     </div>
//                   ) : (
//                     <a
//                       href={session.meetingLink}
//                       target="_blank"
//                       className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-orange-100 border border-orange-600 rounded-xl p-4"
//                     >
//                       <p className="text-orange-700 text-sm md:text-base font-medium">
//                         {session.meetingLink}
//                       </p>
//                     </a>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <div className="text-gray-500 text-lg mt-8">
//                 No past sessions found.
//               </div>
//             )
//           ) : (
//             <div className="text-gray-500 text-lg mt-8">Loading...</div>
//           )}
//         </div>
//       )}
//       <AddMeetingLinkModal
//         isOpen={isAddLinkOpen}
//         onClose={() => setIsAddLinkOpen(false)}
//         session={selectedSession}
//         fetchTherapist={props.fetchTherapist}
//       />
//     </div>
//   );
// };

// export default TodayPage;
import {
  CalendarDays,
  Clock,
  Video,
  AlertCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ViewSessionDetails from "./ViewSessionDetails";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import AddMeetingLinkModal from "../../components/AddMeetingLinkModal";

const TodayPage = ({ slots, therapist, fetchTherapist, pageTitle }) => {
  const [sessionData, setSessionData] = useState();
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionsWithUserData, setSessionsWithUserData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const fetchUserData = async (session) => {
    if (!session.bookedBy?.uid) return session;

    try {
      const userSnap = await getDoc(doc(db, "users", session.bookedBy.uid));
      if (userSnap.exists()) {
        return {
          ...session,
          userData: userSnap.data(),
          therapist,
        };
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return session;
  };

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      if (!slots) {
        setLoading(false);
        return;
      }

      const sessionsWithData = await Promise.all(
        slots.map((session) => fetchUserData(session)),
      );

      setSessionsWithUserData(sessionsWithData);
      setLoading(false);
    };

    loadSessions();
  }, [slots]);

  const getStatusBadge = (status) => {
    const badges = {
      Scheduled: "bg-blue-100 text-blue-700",
      Ongoing: "bg-yellow-100 text-yellow-700",
      Completed: "bg-green-100 text-green-700",
      "Cancel Pending": "bg-red-100 text-red-700",
      "Reschedule Pending": "bg-blue-100 text-blue-700",
      Cancelled: "bg-red-200 text-red-800",
      Rescheduled: "bg-purple-200 text-purple-800",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  const getCardBorder = (status) => {
    const borders = {
      Cancelled: "border-red-300 bg-red-50/30",
      Rescheduled: "border-purple-300 bg-purple-50/30",
      "Cancel Pending": "border-red-400 bg-red-50/20",
      "Reschedule Pending": "border-blue-400 bg-blue-50/20",
    };
    return borders[status] || "border-gray-300";
  };

  return (
    <div>
      {isViewOpen && (
        <ViewSessionDetails
          setIsViewOpen={setIsViewOpen}
          session={sessionData}
          fetchSessions={fetchTherapist}
          fetchTherapist={fetchTherapist}
        />
      )}

      {!isViewOpen && (
        <div className="w-full flex flex-col items-center mt-8 px-4 gap-6">
          <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>

          {loading ? (
            <div className="text-gray-500 text-lg mt-8">
              Loading sessions...
            </div>
          ) : sessionsWithUserData.length > 0 ? (
            sessionsWithUserData.map((session) => (
              <div
                key={session.uniqueId}
                className={`w-full max-w-5xl bg-white border rounded-3xl p-6 space-y-6 ${getCardBorder(session.status)}`}
              >
                {/* Status Badge */}
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(session.status)}`}
                  >
                    {session.status}
                  </span>

                  {session.sessionType === "current" && (
                    <button
                      onClick={() => {
                        setSessionData(session);
                        setIsViewOpen(true);
                      }}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 transition"
                    >
                      View Details
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {session.status === "Cancelled"
                      ? "Cancelled session"
                      : session.status === "Rescheduled"
                        ? "Rescheduled session"
                        : "Session"}{" "}
                    with{" "}
                    <span className="font-bold">
                      {session.userData?.fullName ||
                        session.bookedBy?.name ||
                        "User"}
                    </span>
                  </h3>

                  {/* Session Details */}
                  <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm md:text-base">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={18} />
                      <span>{session.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>
                        {formatTime(session.start)} - {formatTime(session.end)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Video size={18} />
                      <span>{therapist?.serviceType}</span>
                    </div>
                  </div>
                </div>

                {/* Cancelled Session Info */}
                {session.status === "Cancelled" && (
                  <div className="bg-red-50 border border-red-300 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <p className="text-red-700 font-semibold">
                        Session Cancelled
                      </p>
                    </div>
                    {session.cancelledAt && (
                      <p className="text-sm text-red-600">
                        Cancelled on:{" "}
                        {new Date(
                          session.cancelledAt.seconds * 1000,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    {session.cancelReason && (
                      <p className="text-sm text-red-600 mt-1">
                        Reason: {session.cancelReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Rescheduled Session Info */}
                {session.status === "Rescheduled" && session.movedToSlot && (
                  <div className="bg-purple-50 border border-purple-300 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle className="w-5 h-5 text-purple-600" />
                      <p className="text-purple-700 font-semibold">
                        Session Rescheduled
                      </p>
                    </div>
                    {session.rescheduledAt && (
                      <p className="text-sm text-purple-600 mb-3">
                        Rescheduled on:{" "}
                        {new Date(
                          session.rescheduledAt.seconds * 1000,
                        ).toLocaleDateString()}
                      </p>
                    )}
                    <div className="bg-white rounded-lg p-3 border border-purple-200">
                      <p className="text-xs text-purple-600 font-semibold mb-1 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" /> Moved to:
                      </p>
                      <p className="text-sm font-medium text-gray-800">
                        {session.movedToSlot.date}
                      </p>
                      <p className="text-xs text-gray-600">
                        {formatTime(session.movedToSlot.start)} -{" "}
                        {formatTime(session.movedToSlot.end)}
                      </p>
                    </div>
                  </div>
                )}

                {/* Cancel Request Pending */}
                {session.status === "Cancel Pending" && (
                  <div className="bg-red-50 border border-red-300 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-red-700 font-semibold">
                            Cancellation Request Pending
                          </p>
                          <p className="text-red-600 text-sm">
                            User has requested to cancel this session
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        Awaiting Approval
                      </span>
                    </div>
                  </div>
                )}

                {/* Reschedule Request Pending */}
                {session.status === "Reschedule Pending" &&
                  session.requestedNewSlot && (
                    <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-blue-700 font-semibold">
                              Reschedule Request Pending
                            </p>
                            <p className="text-blue-600 text-sm">
                              User wants to reschedule this session
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">
                          Awaiting Approval
                        </span>
                      </div>

                      {/* Current vs Requested Slot */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            Current Slot
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {session.date}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatTime(session.start)} -{" "}
                            {formatTime(session.end)}
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-3 border border-green-200">
                          <p className="text-xs text-green-600 font-semibold mb-1">
                            Requested New Slot
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {session.requestedNewSlot.date}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatTime(session.requestedNewSlot.start)} -{" "}
                            {formatTime(session.requestedNewSlot.end)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Meeting Link - Only for active sessions */}
                {session.sessionType === "current" &&
                  session.status === "Scheduled" && (
                    <>
                      {!session.meetingLink ? (
                        <div className="bg-orange-100 border border-orange-600 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <p className="text-orange-700 font-medium">
                            Please provide joining meeting link
                          </p>
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setIsAddLinkOpen(true);
                            }}
                            className="bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-700 transition"
                          >
                            + Add Link
                          </button>
                        </div>
                      ) : (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-orange-100 border border-orange-600 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-orange-200 transition"
                        >
                          <p className="text-orange-700 font-medium break-all">
                            {session.meetingLink}
                          </p>
                          <span className="text-orange-600 text-xs font-semibold whitespace-nowrap">
                            Click to Join →
                          </span>
                        </a>
                      )}
                    </>
                  )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-lg mt-8">
              No sessions found for {pageTitle.toLowerCase()}.
            </div>
          )}
        </div>
      )}

      <AddMeetingLinkModal
        isOpen={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        session={selectedSession}
        fetchTherapist={fetchTherapist}
      />
    </div>
  );
};

export default TodayPage;
