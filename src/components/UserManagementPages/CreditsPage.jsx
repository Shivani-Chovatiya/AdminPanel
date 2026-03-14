import React, { useEffect, useState } from "react";
import credits from "../../assets/credits.png";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

const tabs = [
  {
    id: 1,
    label: "Purchase History",
    color: "text-orange-600",
    iconBg: "bg-orange-600",
  },
  {
    id: 2,
    label: "Refund History",
    color: "text-gray-500",
    iconBg: "bg-gray-400",
  },
];

const CreditsPage = ({ user }) => {
  const data2 = [
    {
      txn: "TXN-984210",
      date: "12 Feb 2026",
      type: "Credit",
      amount: "₹5,000",
      status: "Success",
    },
    {
      txn: "TXN-982105",
      date: "10 Feb 2026",
      type: "Debit",
      amount: "₹2,500",
      status: "Pending",
    },
    {
      txn: "TXN-978210",
      date: "09 Feb 2026",
      type: "Credit",
      amount: "₹3,200",
      status: "Success",
    },
  ];

  const statusColors = {
    Success: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
    Failed: "bg-red-100 text-red-800",
  };
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "payments"),
          where("userId", "==", user?.uid),
          where("status", "==", "success"),
          // orderBy("createdAt", "desc"),
        );

        const querySnapshot = await getDocs(q);

        const payments = querySnapshot.docs
          .map((doc) => doc.data())
          .filter(
            (d) =>
              d.credits &&
              d.credits !== "Not Applicable" &&
              typeof d.credits === "number",
          ) // ✅ only credit purchases
          .map((d) => ({
            txn: d.paymentId,
            date: d.createdAt?.toDate().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            type: "Credit Purchase",
            amount: `${d.amount}`,
            status: "Success",
            credits: d.credits,
          }));

        setData(payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
      setLoading(false);
    };

    if (user?.uid) fetchPayments();
  }, [user]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [activeTab, setActiveTab] = useState(1);
  // Calculate pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <div className="font-inter p-4 md:p-8 flex flex-col gap-6 ">
      {/* Balance Card */}
      <div className="bg-white border border-orange-100 shadow-sm rounded-lg p-6 flex flex-row justify-between items-center gap-6">
        <div className="flex flex-col">
          <span className="uppercase text-gray-500 text-xs md:text-sm">
            Current Credit Balance
          </span>
          <div className="flex  gap-2">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">
              {user.credits}
            </h2>
            {/* <span className="text-xl md:text-2xl  text-gray-400 font-normal">
              INR
            </span> */}
          </div>
          {/* <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-green-500 text-sm font-medium">
              +5% from last month
            </span>
          </div> */}
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-full p-2 md:p-4 flex items-center justify-center">
          <img src={credits} className="w-5 h-5 md:w-7 md:h-7 " />
        </div>
      </div>

      <div className="border-b border-orange-100 flex flex-col p-4 md:p-6">
        <div className="flex gap-6 overflow-x-auto">
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

      {activeTab === 1 ? (
        <>
          {/* Transactions Table */}
          <div className="bg-white border border-orange-100 shadow-sm rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-center px-4 py-3  text-xs font-semibold text-gray-500 uppercase">
                    Txn ID
                  </th>
                  <th className="text-center px-4 py-3  text-xs font-semibold text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="text-center px-4 py-3  text-xs font-semibold text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="text-center px-4 py-3  text-xs font-semibold text-gray-500 uppercase">
                    Credit Count
                  </th>{" "}
                  <th className="text-center px-4 py-3  text-xs font-semibold text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="text-center px-4 py-3  text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y  divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 text-center text-xs py-2 text-gray-700">
                        {item.txn}
                      </td>
                      <td className="px-2 text-center text-xs py-2 text-gray-700">
                        {item.date}
                      </td>
                      <td className="px-2 text-center text-xs py-2 text-gray-700">
                        {item.type}
                      </td>
                      <td className="px-2 text-center text-xs py-2 text-gray-700">
                        {item.credits}
                      </td>
                      <td className="px-2 text-center text-xs py-2 text-gray-700">
                        {user.locationData &&
                        user.locationData.country === "India"
                          ? `₹${item.amount}`
                          : `$${item.amount}`}
                      </td>
                      <td className="px-2 text-center text-xs py-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
            <div>
              <h1 className="font-bold text-xs text-black">
                Total Data: {data.length}
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
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CreditsPage;
