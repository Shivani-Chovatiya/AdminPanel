import React, { useEffect, useState } from "react";
import TodayPage from "./SessionsPage/TodayPage";
import UpComingPage from "./SessionsPage/UpComingPage";
import PastPage from "./SessionsPage/PastPage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const TherapistSessions = () => {
  const [type, setType] = useState("Today");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [therapist, setTherapist] = useState(null);
  const [todaySlots, setTodaySlots] = useState(null);
  const [upcomingSlots, setUpcomingSlots] = useState(null);
  const [pastSlots, setPastSlots] = useState(null);
  const navigate = useNavigate();
  const fetchTherapist2 = async () => {
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

        setTherapist({
          id: docSnap.id,
          ...docSnap.data(),
        });
        const therapistData = { id: docSnap.id, ...docSnap.data() };
        const today = new Date().toISOString().split("T")[0];

        const todaySlots = therapistData?.slots?.filter(
          (slot) => slot.date === today && slot.isBooked,
        );

        const upcomingSlots = therapistData?.slots?.filter(
          (slot) => slot.date > today && slot.isBooked,
        );

        const pastSlots = therapistData?.slots?.filter(
          (slot) => slot.date < today && slot.isBooked,
        );

        setTodaySlots(todaySlots);
        setUpcomingSlots(upcomingSlots);
        setPastSlots(pastSlots);
      }
    } catch (error) {
      console.error("Error fetching therapist:", error);
    }
  };
  // useEffect(() => {
  //   fetchTherapist();
  // }, []);
  // fetchTherapist function - Updated to get ALL session types
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

        setTherapist({
          id: docSnap.id,
          ...docSnap.data(),
        });

        const therapistData = { id: docSnap.id, ...docSnap.data() };
        const today = new Date().toISOString().split("T")[0];

        // Function to get all sessions from a slot (active + history)
        const getAllSessionsFromSlot = (slot) => {
          const sessions = [];

          // 1. Current active booking (if exists)
          if (slot.isBooked && slot.bookedBy) {
            let status = "Active";
            const now = new Date();
            const sessionDate = new Date(slot.date);
            const sessionEndTime = new Date(`${slot.date} ${slot.end}`);
            // Check for pending requests
            if (slot.isCancelRequest) {
              status = "Cancel Pending";
            } else if (slot.isRescheduleRequest) {
              status = "Reschedule Pending";
            } else if (now > sessionEndTime) {
              status = "Completed";
            }
            // Check if session is ongoing
            else if (
              now >= new Date(`${slot.date} ${slot.start}`) &&
              now <= sessionEndTime
            ) {
              status = "Ongoing";
            }
            // Otherwise it's scheduled/active
            else {
              status = "Scheduled";
            }

            sessions.push({
              ...slot,
              status,
              sessionType: "current",
              uniqueId: `current-${slot.date}-${slot.start}-${slot.bookedBy.uid}`,
            });
          }

          // 2. Cancelled sessions from history
          if (slot.cancelHistory && slot.cancelHistory.length > 0) {
            slot.cancelHistory.forEach((cancel, index) => {
              sessions.push({
                date: slot.date,
                day: slot.day,
                start: slot.start,
                end: slot.end,
                bookedBy: cancel.bookedBy,
                status: "Cancelled",
                cancelledAt: cancel.withdrawnAt || cancel.cancelRequestedAt,
                cancelReason: cancel.cancelReason,
                sessionType: "cancelled",
                uniqueId: `cancelled-${slot.date}-${slot.start}-${cancel.bookedBy?.uid}-${index}`,
              });
            });
          }

          // 3. Rescheduled sessions from history
          if (slot.rescheduleHistory && slot.rescheduleHistory.length > 0) {
            slot.rescheduleHistory.forEach((reschedule, index) => {
              sessions.push({
                date: slot.date,
                day: slot.day,
                start: slot.start,
                end: slot.end,
                bookedBy: reschedule.bookedBy,
                status: "Rescheduled",
                rescheduledAt:
                  reschedule.rescheduleConfirmedAt || reschedule.withdrawnAt,
                movedToSlot: reschedule.movedToSlot,
                rescheduleReason: reschedule.rescheduleReason,
                sessionType: "rescheduled",
                uniqueId: `rescheduled-${slot.date}-${slot.start}-${reschedule.bookedBy?.uid}-${index}`,
              });
            });
          }

          return sessions;
        };

        // Get all sessions from all slots
        const allSessions =
          therapistData?.slots?.flatMap(getAllSessionsFromSlot) || [];

        // Filter by date
        const todaySlots = allSessions.filter(
          (session) => session.date === today,
        );
        const upcomingSlots = allSessions.filter(
          (session) => session.date > today,
        );
        const pastSlots = allSessions.filter((session) => session.date < today);

        setTodaySlots(todaySlots);
        setUpcomingSlots(upcomingSlots);
        setPastSlots(pastSlots);
      }
    } catch (error) {
      console.error("Error fetching therapist:", error);
    }
  };

  useEffect(() => {
    fetchTherapist();
  }, []);

  console.log(therapist);

  if (!therapist) return <p>Loading...</p>;
  return (
    <div className="p-3 md:p-6 bg-gray-100 min-h-screen">
      {!isViewOpen && (
        <div
          className="
      h-10
        bg-[#D9D9D9] 
        rounded-full grid grid-cols-3 justify-center items-center  mt-10 px-2
      "
        >
          <button
            onClick={() => setType("Today")}
            className={`text-black text-xs md:text-sm px-4  h-7 rounded-full text-center ${type === "Today" ? "bg-white" : ""} `}
          >
            Today
          </button>
          <button
            onClick={() => setType("Upcoming")}
            className={`text-black text-xs md:text-sm px-4  h-7 rounded-full text-center ${type === "Upcoming" ? "bg-white" : ""} `}
          >
            Upcoming
          </button>
          <button
            onClick={() => setType("Past")}
            className={`text-black text-xs md:text-sm px-4  h-7 rounded-full text-center ${type === "Past" ? "bg-white" : ""} `}
          >
            Past
          </button>
        </div>
      )}
      <div className="mt-5">
        {type === "Today" ? (
          <TodayPage
            // isViewOpen={isViewOpen}
            // setIsViewOpen={setIsViewOpen}
            // therapist={therapist}
            // todaySlots={todaySlots}
            // fetchTherapist={fetchTherapist}
            slots={todaySlots}
            therapist={therapist}
            fetchTherapist={fetchTherapist}
            pageTitle="Today's Sessions"
          />
        ) : type === "Upcoming" ? (
          <TodayPage
            // isViewOpen={isViewOpen}
            // setIsViewOpen={setIsViewOpen}
            // therapist={therapist}
            // upcomingSlots={upcomingSlots}
            // fetchTherapist={fetchTherapist}
            slots={upcomingSlots}
            therapist={therapist}
            fetchTherapist={fetchTherapist}
            pageTitle="Upcoming Sessions"
          />
        ) : (
          <TodayPage
            // isViewOpen={isViewOpen}
            // setIsViewOpen={setIsViewOpen}
            // therapist={therapist}
            // pastSlots={pastSlots}
            // fetchTherapist={fetchTherapist}
            slots={pastSlots}
            therapist={therapist}
            fetchTherapist={fetchTherapist}
            pageTitle="Past Sessions"
          />
        )}
      </div>
    </div>
  );
};

export default TherapistSessions;
