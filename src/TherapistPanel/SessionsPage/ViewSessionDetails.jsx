import {
  Calendar,
  CalendarDays,
  Clock,
  Paperclip,
  Phone,
  Video,
} from "lucide-react";
import React, { useState } from "react";

const ViewSessionDetails = (props) => {
  const [recommendation, setRecommendation] = useState("");
  const session = props.session;
  const results = [
    { id: 1, label: "Anxiety Level", value: "6/10" },
    { id: 2, label: "Stress Level", value: "7/10" },
    { id: 3, label: "Mood Rating", value: "6/10" },
  ];
  const formData = [
    {
      label: "Primary Concerns",
      value:
        "Work-related stress and anxiety, difficulty maintaining work-life balance",
    },
    {
      label: "Previous Therapy",
      value: "Yes",
    },
    {
      label: "Goals",
      value:
        "Develop better coping mechanisms and improve overall mental wellness",
    },
  ];
  return (
    <div className=" min-h-screen bg-gray-100 p-3 md:p-6 mb-16">
      <button
        className="text-black font-bold text-xl underline"
        onClick={() => props.setIsViewOpen(false)}
      >
        {"< Back To Sessions"}
      </button>
      <div className="mt-3 w-full max-w-5xl bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
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
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3  justify-center mt-3 ">
        <div className="w-full max-w-lg bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold">
            Client Information
          </h2>

          {/* Info Section */}
          <div className="space-y-4">
            <div className="flex flex-col justify-between items-start">
              <span className="text-gray-500 text-sm md:text-base flex gap-2">
                <Phone className="size-4 md:mt-1" />
                Phone
              </span>
              <span className="font-medium">+91 00000 00000</span>
            </div>

            <div className="flex flex-col justify-between items-start">
              <span className="text-gray-500 text-sm md:text-base flex gap-2">
                <Calendar className="size-4 md:mt-1" /> Total Sessions
              </span>
              <span className="font-medium">5</span>
            </div>
          </div>
        </div>
        <div className="w-full max-w-lg bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold">Session Insights</h2>

          {/* Completed Sessions */}
          <div className="flex justify-between flex-col items-start">
            <span className="text-gray-500 text-sm md:text-base">
              Completed Sessions
            </span>
            <span className="font-semibold text-base md:text-lg">3</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Pending Sessions */}
          <div className="flex flex-col justify-between items-start">
            <span className="text-gray-500 text-sm md:text-base">
              Pending Sessions in Package
            </span>
            <span className="font-semibold text-base md:text-lg">2</span>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-3">
        <div className=" w-full max-w-5xl bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
          {/* Title */}
          <h2 className="text-lg md:text-xl font-semibold">
            Assessment Result
          </h2>

          {/* Three White Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {results.map((item) => (
              <div
                key={item.id}
                className="bg-[#FFE8D8] rounded-xl p-4 flex flex-col items-center justify-center shadow-sm"
              >
                <p className="text-gray-500 text-sm text-center">
                  {item.label}
                </p>
                <p className="text-lg md:text-xl font-semibold mt-2">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-3">
        <div className="w-full max-w-5xl bg-white border border-gray-300 rounded-3xl  p-6 space-y-8">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-medium">Intake Form</h2>

          {/* Form Content */}
          <div className="space-y-6">
            {formData.map((item, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-base md:text-lg">
                  {item.label}
                </h3>

                <p className="text-gray-700 text-sm md:text-base">
                  {item.value}
                </p>

                {/* Divider except last */}
                {index !== formData.length - 1 && (
                  <div className="border-t border-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-3">
        {/* Main White Card */}
        <div className="w-full max-w-5xl bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-medium">Session Notes</h2>

          {/* Notes Content Box */}
          <div className="w-full bg-gray-200 rounded-2xl p-4 min-h-28">
            <p className="text-gray-700 text-sm md:text-base">
              No notes added yet. You can add session notes here...
            </p>
          </div>

          {/* Add Notes Button */}
          <div>
            <button className="bg-primary text-white rounded-lg px-6 py-2 text-sm md:text-base hover:bg-orange-700 transition">
              + Add Notes
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-3">
        <div className="w-full max-w-5xl bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-medium">Recommendations</h2>

          {/* Add Label */}
          <p className="text-base md:text-lg font-medium">
            Add New Recommendation
          </p>

          {/* Textarea Box */}
          <div className="bg-gray-200 rounded-2xl p-4 space-y-4">
            <textarea
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="Write your recommendations here..."
              className="w-full bg-transparent outline-none resize-none min-h-32 text-sm md:text-base"
            />

            {/* Attachment */}
            <div className="flex items-center gap-2 text-sm cursor-pointer">
              <Paperclip size={18} />
              <span>Attach file</span>
            </div>
          </div>

          {/* Save Button */}
          <button className="w-full md:w-auto bg-orange-600 text-white rounded-lg px-8 py-3 text-sm md:text-base hover:bg-orange-700 transition">
            Save & Send Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSessionDetails;
