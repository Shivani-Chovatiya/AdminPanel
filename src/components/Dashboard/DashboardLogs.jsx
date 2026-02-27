import React from "react";

const DashboardLogs = () => {
  return (
    // <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
    //   <div
    //     className="
    //     w-full
    //     max-w-6xl
    //     bg-white
    //     rounded-3xl
    //     shadow-lg
    //     p-6
    //     sm:p-8
    //     md:p-12
    //   "
    //   >
    //     <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
    //       Responsive Card
    //     </h1>

    //     <p className="text-gray-600 text-sm sm:text-base">
    //       This container is fully responsive and does not use fixed pixel
    //       values.
    //     </p>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-lg p-6 md:p-10">
        {/* <h2 className="text-2xl md:text-3xl font-semibold mb-8">
          Recent Notifications
        </h2> */}
        {/* Notification 1 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Booking Confirmation:</span>
            Emily has booked a session with Ruchi Goyal.
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>{" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>{" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>{" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>{" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>{" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>{" "}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>
        {/* Notification 2 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Purchase Update:</span>
            John has purchased a 6-session package.
          </p>
        </div>
        {/* Notification 3 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6">
          <p className="text-gray-700">
            <span className="font-semibold">New User Login:</span>
            Adam Doe has just logged in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardLogs;
