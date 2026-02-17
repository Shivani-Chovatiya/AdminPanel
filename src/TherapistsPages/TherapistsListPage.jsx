import React, { useState } from "react";
import { FiDownload, FiEye, FiX } from "react-icons/fi";

const Info = ({ label, value }) => (
  <div className="grid grid-cols-2 border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className=" font-semibold">{value}</span>
  </div>
);

const TherapistsListPage = () => {
  const therapistData = [
    {
      id: 1,
      name: "Alyvia Kelley",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Counselling",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Active",
    },
    {
      id: 2,
      name: "Jaiden Nixon",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Astrology",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Pending",
    },
    {
      id: 3,
      name: "Ace Foley",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Counselling",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Active",
    },
    {
      id: 4,
      name: "Nikolai Schmidt",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Astrology",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Inactive",
    },
    {
      id: 5,
      name: "Clayton Charles",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Counselling",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Active",
    },
    {
      id: 6,
      name: "Prince Chen",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Astrology",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Inactive",
    },
    {
      id: 7,
      name: "Reece Duran",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Counselling",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Active",
    },
    {
      id: 8,
      name: "Anastasia Mcdaniel",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Astrology",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Pending",
    },
    {
      id: 9,
      name: "Melvin Boyle",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Counselling",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Inactive",
    },
    {
      id: 10,
      name: "Kailee Thomas",
      email: "-",
      phone: "1254212522",
      pricepersession: "₹1500",
      Bio: "Clinical psychologist with 10+ years",
      Qualifications: "PhD in Clinical Psychology, M.Phil in",
      serviceType: "Counselling",
      specialisations: "Anxiety/+1",
      languages: "English, Hindi, +1",
      sessions: 245,
      status: "Pending",
    },
  ];
  const [open, setOpen] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Profile");
  const itemsPerPage = 10;

  const totalPages = Math.ceil(therapistData.length / itemsPerPage);

  const paginatedTherapistData = therapistData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  return (
    <div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b text-sm">
              <th className="p-2">Name</th>
              <th className="p-2">Service Type</th>
              <th className="p-2">Specialisations</th>
              <th className="p-2">Languages</th>
              <th className="p-2">Sessions</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedTherapistData.map((u, i) => (
              <tr key={i} className="border-b text-sm hover:bg-gray-50">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.serviceType}</td>
                <td className="p-2">{u.specialisations}</td>
                <td className="p-2">{u.languages}</td>
                <td className="p-2">{u.sessions}</td>

                <td className="p-2">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        u.status === "Active"
                          ? "bg-green-500"
                          : u.status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    ></span>
                    {u.status}
                  </span>
                </td>

                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedData(u);
                        setOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEye size={18} />
                    </button>

                    <button className="text-green-500 hover:text-green-700">
                      <FiDownload size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-3 py-1 border rounded bg-orange-500 text-white">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
      {open && selectedData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-3">{activeTab}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4  gap-2   p-1 mb-4">
              {["Profile", "Appointment"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full border capitalize shrink-0 text-sm ${
                    activeTab === tab
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="text-sm space-y-3">
              {activeTab === "Profile" && (
                <>
                  <Info label="Name" value={selectedData.name} />
                  <Info label="Email" value={selectedData.email} />
                  <Info label="Phone" value={selectedData.phone} />
                  <Info label="Service Type" value={selectedData.serviceType} />
                  <Info
                    label="Price Per Session"
                    value={selectedData.pricepersession}
                  />
                  <Info label="Status" value={selectedData.status} />
                  <Info
                    label="Specialisation"
                    value={selectedData.specialisations}
                  />
                  <Info label="Bio" value={selectedData.Bio} />
                  <Info label="Languages" value={selectedData.languages} />
                  <Info
                    label="Qualifications"
                    value={selectedData.Qualifications}
                  />
                </>
              )}
              {activeTab === "Appointment" && (
                <div className="border rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-medium">Rajesh Kumar</p>
                  <p className="text-gray-500">rajesh.kumar@example.com</p>
                  <p>Date: 10/02/2026</p>
                  <p>Time: 14:00</p>
                  <p>Symptoms: Anxiety/Work Stress/+1</p>

                  <p className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Upcoming
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistsListPage;
