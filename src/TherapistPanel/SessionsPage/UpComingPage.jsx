import { CalendarDays, Clock, Video } from "lucide-react";
import React, { useState } from "react";
import ViewSessionDetails from "./ViewSessionDetails";

const UpComingPage = (props) => {
  const [sessionData, setSessionData] = useState();
  const sessions = [
    {
      id: 1,
      name: "Sarah Johnson",
      time: "04:00 PM",
      date: "Feb 22, 2026",
      type: "Individual Therapy",
      needsLink: true,
    },
    {
      id: 2,
      name: "Michael Smith",
      time: "06:30 PM",
      date: "Feb 23, 2026",
      type: "Couple Therapy",
      needsLink: false,
    },
  ];

  return (
    <div>
      {props.isViewOpen && (
        <ViewSessionDetails
          setIsViewOpen={props.setIsViewOpen}
          session={sessionData}
        />
      )}
      {!props.isViewOpen && (
        <div className="w-full flex flex-col items-center mt-16 px-4 gap-8">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="w-full max-w-5xl bg-white border border-gray-300 rounded-3xl p-6 space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Session Info */}
                <div className="space-y-2">
                  <h2 className="text-xl md:text-2xl font-semibold">
                    <span className="font-bold">{session.name}</span>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpComingPage;
