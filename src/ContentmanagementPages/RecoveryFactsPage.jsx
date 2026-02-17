import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";

const RecoveryFactsPage = () => {
  const contents = [
    {
      fact: "Good service, professional therapists.",
      source: "WHO Mental Health Report 2023",
    },
    {
      fact: "You are stronger than you think.",
      source: "American Psychological Association",
    },
    {
      fact: "Healing is not linear. Be patient with yourself.",
      source: "Mental Health/Common",
    },
    {
      fact: "Good service, professional therapists.",
      source: "WHO Mental Health Report 2023",
    },
    {
      fact: "You are stronger than you think.",
      source: "American Psychological Association",
    },
    {
      fact: "Healing is not linear. Be patient with yourself.",
      source: "Mental Health/Common",
    },
    {
      fact: "Good service, professional therapists.",
      source: "WHO Mental Health Report 2023",
    },
    {
      fact: "You are stronger than you think.",
      source: "American Psychological Association",
    },
    {
      fact: "Healing is not linear. Be patient with yourself.",
      source: "Mental Health/Common",
    },
    {
      fact: "Good service, professional therapists.",
      source: "WHO Mental Health Report 2023",
    },
    {
      fact: "You are stronger than you think.",
      source: "American Psychological Association",
    },
    {
      fact: "Healing is not linear. Be patient with yourself.",
      source: "Mental Health/Common",
    },
  ];
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [fact, setFact] = useState("");
  const [source, setSource] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedData, setSelectedData] = useState();

  const itemsPerPage = 10;

  const filteredData = contents.filter((u) =>
    `${u.fact} ${u.line} ${u.source}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);
  useEffect(() => {
    if (isEdit && selectedData) {
      setFact(selectedData.fact);
      setSource(selectedData.source || "");
    }
  }, [isEdit, selectedData]);
  const handleSaveNote = () => {
    console.log("");
  };
  return (
    <div className=" ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search Data..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-64"
        />
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-500 p-3 text-white rounded-xl"
        >
          + Add Fact Data
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Fact</th>
              <th className="p-2">Source</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((c, i) => (
              <tr key={i + 1} className="border-b">
                <td className="p-2">{c.fact}</td>
                <td className="p-2">{c.source}</td>
                <td className="p-2">
                  <div className="flex items-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => {
                        setSelectedData(c);
                        setIsEdit(true);
                      }}
                    >
                      <FiEdit size={18} />
                    </button>

                    <button className="text-red-500 hover:text-red-700">
                      <FiTrash2 size={18} />
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

        {/* {[...Array(totalPages)].map((_, i) => (
           <button
             key={i}
             onClick={() => setCurrentPage(i + 1)}
             className={`px-3 py-1 border rounded ${
               currentPage === i + 1
                 ? "bg-orange-500 text-white"
                 : "hover:bg-gray-100"
             }`}
           >
             {i + 1}
           </button>
         ))} */}
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
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-3">Add Fact Data</h2>

            {/* Content */}
            <div className="text-sm space-y-3">
              <div className="space-y-4">
                <textarea
                  className="w-full border rounded-lg p-3 min-h-[120px]"
                  placeholder="Add Fact..."
                  value={fact}
                  onChange={(e) => setFact(e.target.value)}
                />
                <textarea
                  className="w-full border rounded-lg p-3 min-h-[120px]"
                  placeholder="Add Source..."
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEdit && selectedData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[95%] max-w-xl p-6 relative">
            <button
              onClick={() => {
                setSelectedData();
                setFact("");
                setSource("");
                setIsEdit(false);
              }}
              className="absolute right-4 top-4 text-gray-500 hover:text-black"
            >
              <FiX size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-3">Update Fact Data</h2>

            {/* Content */}
            <div className="text-sm space-y-3">
              <div className="space-y-4">
                <textarea
                  className="w-full border rounded-lg p-3 min-h-[120px]"
                  placeholder="Add Fact..."
                  value={fact}
                  onChange={(e) => setFact(e.target.value)}
                />
                <textarea
                  className="w-full border rounded-lg p-3 min-h-[120px]"
                  placeholder="Add Source..."
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecoveryFactsPage;
