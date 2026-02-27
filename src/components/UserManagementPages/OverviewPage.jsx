import {
  Activity,
  Calendar,
  Calendar1,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
} from "lucide-react";
import React, { useState } from "react";
import futureicon from "../../assets/futureicon.png";
import CreditsPage from "./CreditsPage";
import AssessmentPage from "./AssessmentPage";
import TherapySession from "./TherapySession";
import FuturePrediction from "./FuturePrediction";

const OverviewPage = (props) => {
  const [type, setType] = useState("Overview");
  const user = props.user;
  const sessions = [
    {
      id: 1,
      therapist: "Dr. Smith",
      date: "12 Jan 2024",
      status: "Completed",
    },
    {
      id: 2,
      therapist: "Dr. Johnson",
      date: "18 Jan 2024",
      status: "Upcoming",
    },
  ];
  const predictions = [
    {
      title: "Will user renew subscription?",
      confidence: 85,
      status: "Positive",
      action: "View Details",
    },
    {
      title: "Will user cancel next month?",
      confidence: 40,
      status: "Negative",
      action: "Review Risk",
    },
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-2 ">
      <div className="grid grid-cols-1 gap-8 justify-center items-center">
        {/* md:grid-cols-1 lg:grid-cols-3 */}
        {/* Left Column */}

        {/* <div className="w-full bg-white border border-orange-100 shadow-sm rounded-xl p-6">
          
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <img
                src="https://i.pravatar.cc/150?img=3"
                alt="profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />

              
              <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">John Doe</h2>

            <p className="text-sm text-slate-500">johndoe@email.com</p>
          </div>

         
          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-slate-500" />
              <span>johndoe@email.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} className="text-slate-500" />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-slate-500" />
              <span>India</span>
            </div>
          </div>
        </div> */}

        <div className=" bg-white p-3 rounded-2xl  shadow-lg flex flex-col">
          {/* <div className="flex border-b border-orange-100 px-6 overflow-x-auto">
            <button
              onClick={() => setType("Overview")}
              className={`py-4 px-4 text-sm font-semibold ${type === "Overview" ? "border-b-2 border-primary text-primary" : "text-slate-500"}`}
            >
              Overview
            </button>
            <button
              onClick={() => setType("Credits")}
              className={`py-4 px-4 text-sm font-semibold ${type === "Credits" ? "border-b-2 border-primary text-primary" : "text-slate-500"}`}
            >
              Credits
            </button>
            <button
              onClick={() => setType("Assessments")}
              className={`py-4 px-4 text-sm font-semibold ${type === "Assessments" ? "border-b-2 border-primary text-primary" : "text-slate-500"}`}
            >
              Assessments
            </button>
            <button
              onClick={() => setType("Therapy Sessions")}
              className={`py-4 px-4 text-sm font-semibold ${type === "Therapy Sessions" ? "border-b-2 border-primary text-primary" : "text-slate-500"}`}
            >
              Therapy Sessions
            </button>
            <button
              onClick={() => setType("Future Prediction")}
              className={`py-4 px-4 text-sm font-semibold ${type === "Future Prediction" ? "border-b-2 border-primary text-primary" : "text-slate-500"}`}
            >
              Future Prediction
            </button>
          </div> */}
          <div className="w-full flex items-center mb-5">
            <button
              onClick={() => props.setIsView(false)}
              className="flex items-center gap-2 bg-white border border-primary rounded-full px-4 py-1 text-sm hover:bg-gray-100"
            >
              ← Back
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-2   p-1 mb-4">
            {[
              "Overview",
              "Credits",
              "Assessments",
              "Therapy Sessions",
              "Future Prediction",
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => setType(tab)}
                className={`px-5 py-2 rounded-full border border-primary capitalize shrink-0 text-xs md:text-sm ${
                  type === tab
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {type === "Overview" ? (
            <>
              <div className="flex flex-col  items-center text-center">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/150?img=3"
                    alt="profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />

                  <span className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  {user?.name}
                </h2>

                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
              <div className="p-6 space-y-8 flex-1">
                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-100 border border-orange-100 rounded-xl p-4">
                    <p className="text-xs text-grabg-gray-500">
                      Total Spending
                    </p>
                    <p className="text-lg font-bold text-primary">₹1,240.00</p>
                  </div>

                  <div className="bg-gray-100 border border-orange-100 rounded-xl p-4">
                    <p className="text-xs text-grabg-gray-500">
                      Registration Date
                    </p>
                    <p className="text-lg font-bold text-grabg-gray-900">
                      Jan 12, 2023
                    </p>
                  </div>
                </div>
              </div>
              <div className="pt-8 border-t border-orange-100 space-y-4">
                {/* Heading */}
                <div className="flex items-center gap-2">
                  <Calendar1 className="text-orange-600" size={18} />
                  <h3 className="text-base font-bold text-slate-900">
                    Upcoming Therapy Sessions
                  </h3>
                </div>

                {/* Table Container */}
                <div className="border border-orange-100 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      {/* Header */}
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold">
                            Therapist
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Status
                          </th>
                        </tr>
                      </thead>

                      {/* Body */}
                      <tbody className="divide-y divide-orange-50">
                        {sessions.map((session) => (
                          <tr key={session.id} className="hover:bg-slate-50">
                            <td className="px-4 py-4 flex items-center gap-3">
                              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                              {session.therapist}
                            </td>

                            <td className="px-4 py-4">{session.date}</td>

                            <td className="px-4 py-4">
                              <span
                                className={`text-xs font-semibold px-2 py-1 rounded
                        ${
                          session.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                              >
                                {session.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="w-full border-t border-orange-100 pt-8 space-y-4">
                {/* Heading */}
                <div className="flex items-center gap-2">
                  <img src={futureicon} className="w-5 h-5 " />
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Future Predictions
                  </h3>
                </div>

                {/* Table Container */}
                <div className="border border-orange-100 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      {/* Header */}
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="text-left px-4 py-3 font-semibold">
                            Question Text
                          </th>
                          <th className="text-center px-4 py-3 font-semibold">
                            Credits Used
                          </th>
                          <th className="text-center px-4 py-3 font-semibold">
                            Status
                          </th>
                          <th className="text-center px-4 py-3 font-semibold">
                            Refund Status
                          </th>
                        </tr>
                      </thead>

                      {/* Body */}
                      <tbody>
                        {predictions.map((item, index) => (
                          <tr key={index} className="border-t border-orange-50">
                            <td className="px-4 py-4 text-slate-900">
                              {item.title}
                            </td>

                            <td className="px-4 py-4 text-center font-bold text-slate-900">
                              {item.confidence}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <span
                                className={`px-2 py-1 rounded text-xs font-bold `}
                              >
                                -
                              </span>
                            </td>

                            <td className="px-4 py-4 text-center">- </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          ) : type === "Credits" ? (
            <CreditsPage />
          ) : type === "Assessments" ? (
            <AssessmentPage />
          ) : type === "Therapy Sessions" ? (
            <TherapySession />
          ) : type === "Future Prediction" ? (
            <FuturePrediction />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
