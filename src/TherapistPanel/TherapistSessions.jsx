import React, { useState } from "react";
import TodayPage from "./SessionsPage/TodayPage";
import UpComingPage from "./SessionsPage/UpComingPage";
import PastPage from "./SessionsPage/PastPage";

const TherapistSessions = () => {
  const [type, setType] = useState("Today");
  const [isViewOpen, setIsViewOpen] = useState(false);
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
          <TodayPage isViewOpen={isViewOpen} setIsViewOpen={setIsViewOpen} />
        ) : type === "Upcoming" ? (
          <UpComingPage isViewOpen={isViewOpen} setIsViewOpen={setIsViewOpen} />
        ) : (
          <PastPage isViewOpen={isViewOpen} setIsViewOpen={setIsViewOpen} />
        )}
      </div>
    </div>
  );
};

export default TherapistSessions;
