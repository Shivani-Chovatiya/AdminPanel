import { CalendarDays, Clock, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import ViewSessionDetails from "./ViewSessionDetails";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const PastPage = (props) => {
  console.log(props);
  const [sessionData, setSessionData] = useState();
  const [sessions, setSessions] = useState();

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
  const fetchSessions = async () => {
    if (!props.pastSlots) return;

    // Map slots to sessions with user info
    const sessionsWithUser = await Promise.all(
      props.pastSlots.map(async (slot) => {
        let userData = null;
        try {
          const userSnap = await getDoc(doc(db, "users", slot.bookedBy.uid));
          if (userSnap.exists()) {
            userData = userSnap.data();
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        return {
          id: slot.start + slot.end, // unique key
          ...userData,
          date: slot.date,
          time: `${formatTime(slot.start)} - ${formatTime(slot.end)}`,
          type: props.therapist.serviceType, // you can customize or fetch from slot
          needsLink: true, // example, you can adjust
          isCancelRequest: slot.isCancelRequest || false,
          isRescheduleRequest: slot.isRescheduleRequest || false,
          requestedNewSlot: slot.requestedNewSlot || null,
          cancelRequestedAt: slot.cancelRequestedAt,
          rescheduleRequestedAt: slot.rescheduleRequestedAt,
        };
      }),
    );

    setSessions(sessionsWithUser);
  };
  useEffect(() => {
    fetchSessions();
  }, [props.pastSlots]);

  return (
    <div>
      {props.isViewOpen && (
        <ViewSessionDetails
          setIsViewOpen={props.setIsViewOpen}
          session={sessionData}
          fetchSessions={fetchSessions}
          fetchTherapist={props.fetchTherapist}
        />
      )}
      {!props.isViewOpen && (
        <div className="w-full flex flex-col items-center mt-16 px-4 gap-8">
          {sessions ? (
            sessions.length > 0 ? (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="w-full max-w-5xl bg-white border border-gray-300 rounded-3xl p-6 space-y-6"
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Session Info */}
                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-semibold">
                        <span className="font-bold">{session.fullName}</span>
                      </h2>

                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                          <CalendarDays size={18} />
                          <span>{session.date}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={18} />
                          <span>{session.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Video size={18} />
                          <span>{session.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => {
                        setSessionData(session);
                        props.setIsViewOpen(true);
                      }}
                      className="border border-gray-300 rounded-lg px-6 py-2 text-sm md:text-base hover:bg-gray-50 transition"
                    >
                      View Details
                    </button>
                  </div>
                  {/* Cancel Request Alert */}
                  {session.isCancelRequest && (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-red-50 border border-red-300 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div>
                          <p className="text-red-700 text-sm md:text-base font-semibold">
                            Cancellation Request Pending
                          </p>
                          <p className="text-red-600 text-xs md:text-sm">
                            User has requested to cancel this session
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        Awaiting Approval
                      </span>
                    </div>
                  )}

                  {/* Reschedule Request Alert */}
                  {session.isRescheduleRequest && session.requestedNewSlot && (
                    <div className="flex flex-col gap-4 bg-blue-50 border border-blue-300 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-blue-700 text-sm md:text-base font-semibold">
                            Reschedule Request Pending
                          </p>
                          <p className="text-blue-600 text-xs md:text-sm">
                            User has requested to reschedule this session
                          </p>
                        </div>
                      </div>

                      {/* Current vs Requested Slot */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            Current Slot
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {session.date}
                          </p>
                          <p className="text-xs text-gray-600">
                            {session.time}
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

                      <div className="flex justify-end">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                          Awaiting Approval
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-lg mt-8">
                No past sessions found.
              </div>
            )
          ) : (
            <div className="text-gray-500 text-lg mt-8">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PastPage;
