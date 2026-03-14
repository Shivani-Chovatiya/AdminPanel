// // import React, { useEffect, useState } from "react";
// // import { FiEye, FiDownload, FiX } from "react-icons/fi";

// // const Info = ({ label, value }) => (
// //   <div className="flex justify-between border-b pb-2">
// //     <span className="text-gray-500">{label}</span>
// //     <span className="font-medium">{value}</span>
// //   </div>
// // );

// // const UserManagement = () => {
// //   const [open, setOpen] = useState(false);
// //   const [selectedUser, setSelectedUser] = useState(null);
// //   const [activeTab, setActiveTab] = useState("profile");
// //   const [note, setNote] = useState("");
// //   const [search, setSearch] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);

// //   const itemsPerPage = 10;

// //   const users = [
// //     {
// //       name: "John Doe",
// //       email: "john@mail.com",
// //       status: "Active",
// //       phone: 1234567890,
// //       duedate: "12/03/2026",
// //     },
// //     {
// //       name: "Anna Smith",
// //       email: "anna@mail.com",
// //       status: "Pending",
// //       phone: 9874563210,
// //       duedate: "12/03/2026",
// //     },
// //     {
// //       name: "Mark Lee",
// //       email: "mark@mail.com",
// //       status: "Blocked",
// //       phone: 1598746320,
// //       duedate: "12/03/2026",
// //     },
// //   ];

// //   const handleSaveNote = () => {
// //     console.log("Saved note:", note);
// //   };

// //   const filteredUsers = users.filter((u) =>
// //     `${u.name} ${u.email} ${u.phone}`
// //       .toLowerCase()
// //       .includes(search.toLowerCase()),
// //   );

// //   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

// //   const paginatedUsers = filteredUsers.slice(
// //     (currentPage - 1) * itemsPerPage,
// //     currentPage * itemsPerPage,
// //   );

// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [search]);
// //   return (
// //     <div>
// //       <h1 className="text-xl md:text-2xl font-bold mb-4">User Management</h1>
// //       <div className="bg-white p-6 rounded-2xl shadow">
// //         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
// //           <input
// //             type="text"
// //             placeholder="Search users..."
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //             className="border rounded-lg px-4 py-2 w-full md:w-64"
// //           />
// //         </div>
// //         <div className="w-full overflow-x-auto">
// //           <table className="w-full border-collapse">
// //             <thead>
// //               <tr className="text-left border-b">
// //                 <th className="p-2">Name</th>
// //                 <th className="p-2">Email</th>
// //                 <th className="p-2">Status</th>
// //                 <th className="p-2">Phone No.</th>
// //                 <th className="p-2">Due Date</th>
// //                 <th className="p-2">Action</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {paginatedUsers.map((u, i) => (
// //                 <tr key={i} className="border-b">
// //                   <td className="p-2">{u.name}</td>
// //                   <td className="p-2">{u.email}</td>
// //                   <td className="p-2">
// //                     <span className="flex items-center gap-2">
// //                       <span
// //                         className={`h-2 w-2 rounded-full ${
// //                           u.status === "Active"
// //                             ? "bg-green-500"
// //                             : u.status === "Pending"
// //                               ? "bg-yellow-500"
// //                               : "bg-red-500"
// //                         }`}
// //                       ></span>
// //                       {u.status}
// //                     </span>
// //                   </td>
// //                   <td className="p-2">{u.phone}</td>
// //                   <td className="p-2">{u.duedate}</td>
// //                   <td className="p-2">
// //                     <div className="flex items-center gap-3">
// //                       <button
// //                         onClick={() => {
// //                           setSelectedUser(u);
// //                           setOpen(true);
// //                           setActiveTab("profile");
// //                         }}
// //                         className="text-blue-500 hover:text-blue-700"
// //                       >
// //                         <FiEye size={18} />
// //                       </button>

// //                       <button className="text-green-500 hover:text-green-700">
// //                         <FiDownload size={18} />
// //                       </button>
// //                     </div>
// //                   </td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //         <div className="flex justify-end mt-4 gap-2">
// //           <button
// //             disabled={currentPage === 1}
// //             onClick={() => setCurrentPage((p) => p - 1)}
// //             className="px-3 py-1 border rounded disabled:opacity-40"
// //           >
// //             Prev
// //           </button>

// //           {/* {[...Array(totalPages)].map((_, i) => (
// //           <button
// //             key={i}
// //             onClick={() => setCurrentPage(i + 1)}
// //             className={`px-3 py-1 border rounded ${
// //               currentPage === i + 1
// //                 ? "bg-orange-500 text-white"
// //                 : "hover:bg-gray-100"
// //             }`}
// //           >
// //             {i + 1}
// //           </button>
// //         ))} */}
// //           <span className="px-3 py-1 border rounded bg-orange-500 text-white">
// //             {currentPage} / {totalPages}
// //           </span>

// //           <button
// //             disabled={currentPage === totalPages}
// //             onClick={() => setCurrentPage((p) => p + 1)}
// //             className="px-3 py-1 border rounded disabled:opacity-40"
// //           >
// //             Next
// //           </button>
// //         </div>

// //         {open && selectedUser && (
// //           <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
// //             <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
// //               <button
// //                 onClick={() => setOpen(false)}
// //                 className="absolute right-4 top-4 text-gray-500 hover:text-black"
// //               >
// //                 <FiX size={20} />
// //               </button>

// //               <h2 className="text-lg font-semibold mb-3">User Details</h2>

// //               <div className="grid grid-cols-2 md:grid-cols-4  gap-2   p-1 mb-4">
// //                 {["profile", "booking", "payment", "notes"].map((tab) => (
// //                   <button
// //                     key={tab}
// //                     onClick={() => setActiveTab(tab)}
// //                     className={`px-5 py-2 rounded-full border capitalize shrink-0 text-sm ${
// //                       activeTab === tab
// //                         ? "bg-orange-500 text-white"
// //                         : "text-gray-500 hover:bg-gray-100"
// //                     }`}
// //                   >
// //                     {tab}
// //                   </button>
// //                 ))}
// //               </div>

// //               {/* Content */}
// //               <div className="text-sm space-y-3">
// //                 {activeTab === "profile" && (
// //                   <>
// //                     <Info label="Name" value={selectedUser.name} />
// //                     <Info label="Email" value={selectedUser.email} />
// //                     <Info label="Phone" value={selectedUser.phone} />
// //                     <Info label="Status" value={selectedUser.status} />
// //                   </>
// //                 )}

// //                 {activeTab === "booking" && (
// //                   <>
// //                     <Info label="Name" value={selectedUser.name} />
// //                     <Info label="Email" value={selectedUser.email} />
// //                     <Info label="Phone" value={selectedUser.phone} />
// //                     <Info label="Booking Date" value={selectedUser.duedate} />
// //                     <Info label="Service" value="Astrology Session" />
// //                     <Info label="Mode" value="Online" />
// //                   </>
// //                 )}

// //                 {activeTab === "payment" && (
// //                   <>
// //                     <Info label="Amount" value="₹1500" />
// //                     <Info label="Method" value="UPI" />
// //                     <Info label="Status" value="Paid" />
// //                   </>
// //                 )}

// //                 {activeTab === "notes" && (
// //                   <div className="space-y-4">
// //                     <textarea
// //                       className="w-full border rounded-lg p-3 min-h-[120px]"
// //                       placeholder="Add notes..."
// //                       value={note}
// //                       onChange={(e) => setNote(e.target.value)}
// //                     />

// //                     <div className="flex justify-end">
// //                       <button
// //                         onClick={handleSaveNote}
// //                         className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
// //                       >
// //                         Save
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserManagement;
// import { Eye, Search, Trash2 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import OverviewPage from "../components/UserManagementPages/OverviewPage";
// import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
// import { db } from "../config/firebase";
// import Swal from "sweetalert2";

// const intialVaue = [
//   {
//     id: 1,
//     name: "Sarah Chen",
//     email: "sarah@email.com",
//     phone: "+91 9876543210",
//     country: "Domestic",
//     credits: 12,
//     sessions: 5,
//     questions: 3,
//   },
//   {
//     id: 2,
//     name: "Adam Doe",
//     email: "adam@email.com",
//     phone: "+1 1234567890",
//     country: "Overseas",
//     credits: 8,
//     sessions: 2,
//     questions: 6,
//   },
// ];
// const UserManagement = () => {
//   const [isView, setIsView] = useState(false);
//   const [userDetails, setUserDetails] = useState();
//   const [users, setUsers] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [countryFilter, setCountryFilter] = useState("All");
//   const [sortOrder, setSortOrder] = useState("Newest");
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const querySnapshot = await getDocs(collection(db, "users"));

//       const usersList = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setUsers(usersList);
//     };

//     fetchUsers();
//   }, []);

//   const getFilteredAndSortedUsers = () => {
//     let filtered = [...users];

//     // Search filter - by name, birth location, or phone
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (user) =>
//           user.fullName?.toLowerCase().includes(query) ||
//           user.birthLocation?.toLowerCase().includes(query) ||
//           user.phone?.toLowerCase().includes(query),
//       );
//     }

//     // Country filter - Domestic (India) vs Overseas
//     if (countryFilter !== "All") {
//       if (countryFilter === "Domestic") {
//         // Domestic: India-based users
//         filtered = filtered.filter((user) => {
//           const location = user.birthLocation?.toLowerCase() || "";
//           const country = user.locationData?.country?.toLowerCase() || "";
//           return location.includes("india") || country.includes("india");
//         });
//       } else if (countryFilter === "Overseas") {
//         // Overseas: Non-India users
//         filtered = filtered.filter((user) => {
//           const location = user.birthLocation?.toLowerCase() || "";
//           const country = user.locationData?.country?.toLowerCase() || "";
//           return !location.includes("india") && !country.includes("india");
//         });
//       }
//     }

//     // Sort by created date
//     if (sortOrder === "Newest") {
//       filtered.sort((a, b) => {
//         const dateA = a.createdAt?.toDate?.() || new Date(0);
//         const dateB = b.createdAt?.toDate?.() || new Date(0);
//         return dateB - dateA; // Newest first
//       });
//     } else if (sortOrder === "Oldest") {
//       filtered.sort((a, b) => {
//         const dateA = a.createdAt?.toDate?.() || new Date(0);
//         const dateB = b.createdAt?.toDate?.() || new Date(0);
//         return dateA - dateB; // Oldest first
//       });
//     }

//     return filtered;
//   };

//   const filteredUsers = getFilteredAndSortedUsers();

//   // Calculate pagination
//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);
//   const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This user will be permanently deleted.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ea580c",
//       cancelButtonColor: "#6b7280",
//       confirmButtonText: "Yes, delete",
//     });

//     if (result.isConfirmed) {
//       try {
//         // Delete from Firestore
//         await deleteDoc(doc(db, "users", id));

//         // Remove from local state
//         setUsers((prev) => prev.filter((user) => user.id !== id));

//         Swal.fire("Deleted!", "User has been removed.", "success");
//       } catch (error) {
//         console.error(error);
//         Swal.fire("Error!", "Failed to delete user.", "error");
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 flex flex-col gap-5 items-start justify-start px-4 py-10">
//       {isView && (
//         <OverviewPage
//           setIsView={setIsView}
//           isView={isView}
//           user={userDetails}
//         />
//       )}
//       {!isView && (
//         <>
//           <div className="w-full bg-white border border-slate-200 rounded-xl p-4">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               {/* LEFT SIDE */}
//               <div className="flex flex-col sm:flex-row gap-4 flex-1">
//                 {/* Search Input */}
//                 <div className="relative w-full sm:max-w-xs">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//                   <input
//                     type="text"
//                     placeholder="Search by name, location, phone..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 {/* Status Filter */}
//                 <div className="flex items-center gap-2">
//                   <label className="text-xs font-semibold text-slate-500">
//                     Country
//                   </label>
//                   <select
//                     value={countryFilter}
//                     onChange={(e) => setCountryFilter(e.target.value)}
//                     className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value={"All"}>All</option>
//                     <option value={"Domestic"}>Domestic</option>
//                     <option value={"Overseas"}>Overseas</option>
//                   </select>
//                 </div>

//                 {/* Sort Filter */}
//                 <div className="flex items-center gap-2">
//                   <label className="text-xs font-semibold text-slate-500">
//                     Sort
//                   </label>
//                   <select
//                     value={sortOrder}
//                     onChange={(e) => setSortOrder(e.target.value)}
//                     className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value={"Newest"}>Newest</option>
//                     <option value={"Oldest"}>Oldest</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm">
//             {/* Horizontal scroll on small screens */}
//             <div className="w-full overflow-x-auto">
//               <table className="min-w-full text-xs text-left">
//                 {/* Table Head */}
//                 <thead className="bg-slate-50 text-xs uppercase text-slate-500">
//                   <tr>
//                     <th className="text-xs px-6 py-4 font-semibold text-center">
//                       Name
//                     </th>
//                     <th className="text-xs px-6 py-4 font-semibold text-center">
//                       Phone
//                     </th>
//                     <th className="text-xs px-6 py-4 font-semibold text-center">
//                       Gender
//                     </th>
//                     <th className="text-xs px-6 py-4 font-semibold text-center">
//                       Birth Location
//                     </th>
//                     <th className="text-xs px-6 py-4 font-semibold text-center">
//                       Available Credits
//                     </th>
//                     {/* <th className="text-xs px-6 py-4 font-semibold text-center">
//                       Total Sessions
//                     </th>
//                     <th className="text-xs px-6 py-4 font-semibold text-center">
//                       Questions
//                     </th> */}
//                     <th className="text-xs px-6 py-4 font-semibold text-right">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 {/* Table Body */}
//                 <tbody className="divide-y divide-slate-200">
//                   {currentUsers.map((user) => (
//                     <tr key={user.id} className="hover:bg-slate-50">
//                       {/* Name */}
//                       <td className="text-xs px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           {/* <div className="w-10 h-10 bg-slate-100 rounded-full"></div> */}
//                           <div>
//                             <p className="font-semibold text-slate-900">
//                               {user.fullName}
//                             </p>
//                             <p className="text-xs text-slate-500">
//                               {/* {user.email} */}
//                             </p>
//                           </div>
//                         </div>
//                       </td>

//                       {/* Phone */}
//                       <td className="text-xs px-6 py-4 text-center text-slate-600">
//                         {user.phone}
//                       </td>

//                       {/* Country */}
//                       <td className="text-xs px-6 py-4 text-center">
//                         {user.gender.charAt(0).toUpperCase() +
//                           user.gender.slice(1)}
//                       </td>

//                       {/* Available Credits */}
//                       <td className="text-xs px-6 py-4 text-center">
//                         {user.birthLocation}
//                       </td>
//                       <td className="text-xs px-6 py-4 text-center">
//                         {user.credits}
//                       </td>
//                       {/* Total Sessions */}
//                       {/* <td className="text-xs px-6 py-4 text-center">
//                         {user.sessions}
//                       </td> */}

//                       {/* Questions */}
//                       {/* <td className="text-xs px-6 py-4 text-center">
//                         {user.questions}
//                       </td> */}

//                       {/* Action */}
//                       <td className="text-xs px-6 py-4 text-right">
//                         <button
//                           onClick={() => {
//                             setUserDetails(user);
//                             setIsView(true);
//                           }}
//                           className="text-blue-600 font-medium text-xs hover:underline"
//                         >
//                           <Eye size={18} />
//                         </button>{" "}
//                         <button
//                           onClick={() => handleDelete(user.uid)}
//                           className="text-orange-600 font-medium text-xs hover:underline"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             <div className="flex items-center justify-between flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
//               <div>
//                 <h1 className="font-bold text-xs text-black">
//                   Total Users: {filteredUsers.length}
//                 </h1>
//               </div>
//               <div className="flex items-center  px-6 py-4 ">
//                 {/* Previous */}
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                   className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
//                 >
//                   Prev
//                 </button>

//                 {/* Page Numbers */}
//                 <div className="flex gap-2">
//                   {currentPage}/{totalPages}
//                 </div>

//                 {/* Next */}
//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                   className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserManagement;
import { Eye, Search, Trash2, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import OverviewPage from "../components/UserManagementPages/OverviewPage";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import Swal from "sweetalert2";
import EditUserScreen from "../components/UserManagementPages/EditUserScreen";
import { useLocation } from "react-router-dom";

const UserManagement = () => {
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [editUser, setEditUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest");
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("");
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));

      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    };

    fetchUsers();
  }, []);
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      setIsView(true);
    }

    if (location.state?.notification?.userId && users.length > 0) {
      const foundUser = users.find(
        (u) => u.id === location.state.notification.userId,
      );
      console.log(foundUser);
      if (foundUser) {
        setUserDetails(foundUser); // highlight / open user
      }
    }
  }, [location.state, users]);

  // Filter and search logic
  const getFilteredAndSortedUsers = () => {
    let filtered = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(query) ||
          user.birthLocation?.toLowerCase().includes(query) ||
          user.phone?.toLowerCase().includes(query),
      );
    }

    if (countryFilter !== "All") {
      if (countryFilter === "Domestic") {
        filtered = filtered.filter((user) => {
          const location = user.birthLocation?.toLowerCase() || "";
          const country = user.locationData?.country?.toLowerCase() || "";
          return location.includes("india") || country.includes("india");
        });
      } else if (countryFilter === "Overseas") {
        filtered = filtered.filter((user) => {
          const location = user.birthLocation?.toLowerCase() || "";
          const country = user.locationData?.country?.toLowerCase() || "";
          return !location.includes("india") && !country.includes("india");
        });
      }
    }

    if (sortOrder === "Newest") {
      filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
    } else if (sortOrder === "Oldest") {
      filtered.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateA - dateB;
      });
    }

    return filtered;
  };

  const filteredUsers = getFilteredAndSortedUsers();

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, countryFilter, sortOrder]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
    });

    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers((prev) => prev.filter((user) => user.id !== id));
        Swal.fire("Deleted!", "User has been removed.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Failed to delete user.", "error");
      }
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setIsEdit(true);
  };

  const handleSaveUser = (uid, updatedData) => {
    // Update local state
    setUsers((prev) =>
      prev.map((user) =>
        user.uid === uid ? { ...user, ...updatedData } : user,
      ),
    );
  };

  const handleBackFromEdit = () => {
    setIsEdit(false);
    setEditUser(null);
  };

  // Render edit screen
  if (isEdit && editUser) {
    return (
      <EditUserScreen
        user={editUser}
        onBack={handleBackFromEdit}
        onSave={handleSaveUser}
      />
    );
  }

  // Render view screen
  if (isView && userDetails) {
    return (
      <OverviewPage
        setIsView={setIsView}
        isView={isView}
        user={userDetails}
        activeTab={activeTab}
      />
    );
  }

  // Main user list
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="w-full bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, location, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">
                  Country
                </label>
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>All</option>
                  <option>Domestic</option>
                  <option>Overseas</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">
                  Sort
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="text-xs px-6 py-4 font-semibold text-center">
                    Name
                  </th>
                  <th className="text-xs px-6 py-4 font-semibold text-center">
                    Phone
                  </th>
                  <th className="text-xs px-6 py-4 font-semibold text-center">
                    Gender
                  </th>
                  <th className="text-xs px-6 py-4 font-semibold text-center">
                    Birth Location
                  </th>
                  <th className="text-xs px-6 py-4 font-semibold text-center">
                    Available Credits
                  </th>
                  <th className="text-xs px-6 py-4 font-semibold text-center">
                    Country Type
                  </th>
                  <th className="text-xs px-6 py-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => {
                    const location = user.birthLocation?.toLowerCase() || "";
                    const country =
                      user.locationData?.country?.toLowerCase() || "";
                    const isDomestic =
                      location.includes("india") || country.includes("india");

                    return (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="text-xs px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">
                                {user.fullName}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="text-xs px-6 py-4 text-center text-slate-600">
                          {user.phone}
                        </td>

                        <td className="text-xs px-6 py-4 text-center">
                          {user.gender
                            ? user.gender.charAt(0).toUpperCase() +
                              user.gender.slice(1)
                            : "N/A"}
                        </td>

                        <td className="text-xs px-6 py-4 text-center">
                          {user.birthLocation || "N/A"}
                        </td>

                        <td className="text-xs px-6 py-4 text-center">
                          {user.credits || 0}
                        </td>

                        <td className="text-xs px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isDomestic
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {isDomestic ? "Domestic" : "Overseas"}
                          </span>
                        </td>

                        <td className="text-xs px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setUserDetails(user);
                                setIsView(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleEditClick(user)}
                              className="text-green-600 hover:text-green-800"
                              title="Edit User"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.uid)}
                              className="text-orange-600 hover:text-orange-800"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
            <div>
              <h1 className="font-bold text-xs text-black">
                Total Users: {filteredUsers.length}
                {searchQuery || countryFilter !== "All" ? (
                  <span className="text-slate-500 font-normal ml-1">
                    (filtered from {users.length})
                  </span>
                ) : null}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-40 hover:bg-slate-50"
              >
                Prev
              </button>

              <div className="px-3 py-1 text-sm border rounded-md bg-orange-500 text-white">
                {currentPage}/{totalPages || 1}
              </div>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-40 hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
