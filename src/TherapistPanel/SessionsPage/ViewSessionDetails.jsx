import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Calendar,
  CalendarDays,
  Clock,
  Paperclip,
  Phone,
  Video,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const ViewIntakeFormData = ({ session }) => {
  const intakeForm = session.userData.intakeForm;
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    // Firestore Timestamp object (has toDate)
    if (
      typeof dateValue === "object" &&
      typeof dateValue.toDate === "function"
    ) {
      const date = dateValue.toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Plain Firestore timestamp object { seconds, nanoseconds }
    if (typeof dateValue === "object" && dateValue.seconds) {
      const date = new Date(dateValue.seconds * 1000);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // String date
    if (typeof dateValue === "string") {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return "-"; // fallback
  };
  const submittedAt = intakeForm.submittedAt
    ? formatDate(intakeForm.submittedAt)
    : "-";

  const dob = intakeForm["Date of Birth"]
    ? formatDate(intakeForm["Date of Birth"])
    : "-";

  const intakeFormData = [
    {
      label: "First Name",
      value: `${intakeForm["First Name"] || "-"} ${intakeForm["Last Name"] || ""}`,
    },
    // { label: "Last Name", value: intakeForm["Last Name"] || "-" },
    {
      label: "Preferred Name",
      value: intakeForm["Preferred Name"] || "-",
    },
    { label: "Date of Birth", value: dob },
    {
      label: "Email Address",
      value: intakeForm["Email Address"] || "-",
    },
    {
      label: "Gender Identity",
      value: intakeForm["Gender Identity"] || "-",
    },
    // {
    //   label: "Primary Concerns",
    //   value: intakeForm["Primary Concerns"] || "-",
    // },
    // {
    //   label: "Previous Therapy",
    //   value: intakeForm["Previous Therapy"] || "-",
    // },
    // { label: "Goals", value: intakeForm["Goals"] || "-" },
    {
      label: "Currently taking prescription medication",
      value: intakeForm["Are you currently taking any prescription medication?"]
        ? "Yes"
        : "No",
    },
    {
      label: "Under care of physician for chronic condition",
      value: intakeForm[
        "Are you currently under the care of a physician for chronic condition?"
      ]
        ? "Yes"
        : "No",
    },
    {
      label: "Have you attended therapy or counseling before?",
      value:
        intakeForm["Have you attended therapy or counseling before?"] || "-",
    },
    {
      label: "How long have you felt this way?",
      value: intakeForm["How long have you felt this way?"] || "-",
    },
    {
      label: "Who do you currently live with?",
      value: intakeForm["Who do you currently live with?"] || "-",
    },
    {
      label: "Supportive Persons",
      value:
        intakeForm["Supportive Persons"]
          ?.map((p) => `${p.relation}: ${p.name}`)
          .join(", ") || "-",
    },
    {
      label: "What brings you here today?",
      value: intakeForm["What brings you here today?"] || "-",
    },
    {
      label: "Information confirmed",
      value: intakeForm[
        "I confirm that the information provided above is accurate"
      ]
        ? "Yes"
        : "No",
    },
    { label: "Form Submitted At", value: submittedAt },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {intakeFormData.map((item, index) => {
        return (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-gray-500 font-medium text-sm">{item.label}</h3>
            <p className="text-gray-900 font-semibold mt-1">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

const ViewSessionDetails = (props) => {
  const [recommendation, setRecommendation] = useState("");
  const [file, setFile] = useState(null);
  console.log(props);
  const session = props.session;
  const formatTime = (timeString) => {
    if (!timeString) return "";

    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  const results = [
    { id: 1, label: "Anxiety Level", value: "6/10" },
    { id: 2, label: "Stress Level", value: "7/10" },
    { id: 3, label: "Mood Rating", value: "6/10" },
  ];
  const [sessionNotes, setSessionNotes] = useState("");
  const [originalNote, setOriginalNote] = useState("");

  // Load default data

  useEffect(() => {
    if (session?.userData.sessionNotes?.length > 0) {
      const therapistNote = session.userData.sessionNotes.find(
        (n) => n.therapistId === session.therapist?.id,
      );

      if (therapistNote) {
        setSessionNotes(therapistNote.note);
        setOriginalNote(therapistNote.note);
      }
    }
  }, [session]);

  const isChanged = sessionNotes !== originalNote;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
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

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const loadAssessments = async () => {
      if (!session) return;
      setLoading(true);
      let combined = [];

      // FREE assessments
      if (session?.userData?.selectedSymptoms) {
        for (const id of session?.userData.selectedSymptoms) {
          const snap = await getDoc(doc(db, "assessments", id));
          if (snap.exists()) {
            combined.push({
              id,
              name: snap.data().sentence,
              status: "Free",
            });
          }
        }
      }

      // PAID assessments
      if (session?.userData?.purchasedAssessments) {
        for (const id of session?.userData.purchasedAssessments) {
          const snap = await getDoc(doc(db, "paid_assessments", id));
          if (snap.exists()) {
            combined.push({
              id,
              name: snap.data().sentence,
              status: "Paid",
            });
          }
        }
      }

      setReports(combined);
      setLoading(false);
    };

    loadAssessments();
  }, [session]);

  const filteredReports =
    filter === "All" ? reports : reports.filter((r) => r.status === filter);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredReports.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);
  const [loadingNote, setLoadingNote] = useState(false);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [allRecommendations, setAllRecommendations] = useState([]);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!session) return;

      const userRef = doc(db, "users", session.userData.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) return;

      const data = snap.data();

      const therapistRecs = data?.recommendations?.find(
        (r) => r.therapistId === session.therapist.id,
      );

      if (therapistRecs) {
        setAllRecommendations(therapistRecs.recommendations || []);
      }
    };

    loadRecommendations();
  }, [session]);
  const saveSessionNote = async () => {
    setLoadingNote(true);
    try {
      const userRef = doc(db, "users", session.userData.uid);

      const snap = await getDoc(userRef);
      const userData = snap.data();

      let notes = userData?.sessionNotes || [];

      // find therapist note
      const therapistIndex = notes.findIndex(
        (n) => n.therapistId === session.therapist.id,
      );

      if (therapistIndex !== -1) {
        // update existing therapist note
        notes[therapistIndex] = {
          ...notes[therapistIndex],
          therapistName: session.therapist.name,
          date: session.date,
          note: sessionNotes,
          updatedAt: new Date(),
        };
      } else {
        // add new therapist note
        notes.push({
          therapistId: session.therapist.id,
          therapistName: session.therapist.name,
          date: session.date,
          note: sessionNotes,
          createdAt: new Date(),
        });
      }

      await updateDoc(userRef, {
        sessionNotes: notes,
      });

      toast.success("Session note saved");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save session note");
    } finally {
      setLoadingNote(false);
    }
  };

  const saveRecommendation = async () => {
    setLoadingRecommendation(true);
    try {
      const userRef = doc(db, "users", session.userData.uid);
      const snap = await getDoc(userRef);
      const userData = snap.data();

      let recommendations = userData?.recommendations || [];

      let fileUrl = null;

      // upload file only if selected
      if (file) {
        const storage = getStorage();
        const fileRef = ref(
          storage,
          `recommendations/${session.userData.uid}/${Date.now()}_${file.name}`,
        );

        await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(fileRef);
      }

      const newRecommendation = {
        text: recommendation,
        fileUrl: fileUrl, // optional
        createdAt: new Date(),
      };

      const therapistIndex = recommendations.findIndex(
        (r) => r.therapistId === session.therapist.id,
      );

      if (therapistIndex !== -1) {
        recommendations[therapistIndex].recommendations.push(newRecommendation);
      } else {
        recommendations.push({
          therapistId: session.therapist.id,
          therapistName: session.therapist.name,
          date: session.date,
          recommendations: [newRecommendation],
          createdAt: new Date(),
        });
      }

      await updateDoc(userRef, {
        recommendations,
      });

      toast.success("Recommendation saved");

      setRecommendation("");
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save recommendation");
    } finally {
      setLoadingRecommendation(false);
    }
  };

  return (
    <div className=" min-h-screen bg-gray-100 p-3 md:p-6 mb-16">
      <button
        className="text-black font-bold text-xl underline"
        onClick={() => {
          props.fetchSessions();
          props.fetchTherapist();
          props.setIsViewOpen(false);
        }}
      >
        {"< Back To Sessions"}
      </button>
      <div className="mt-3 w-full  bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Session Info */}
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold">
              <span className="font-bold">{session.userData.fullName}</span>
            </h2>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                <span>{session.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>
                  {formatTime(session.start)}-{formatTime(session.end)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Video size={18} />
                <span>{session.therapist.serviceType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3  justify-center mt-3 ">
        <div className="w-full max-w-lg bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
         
          <h2 className="text-lg md:text-xl font-semibold">
            Client Information
          </h2>

          
          <div className="space-y-4">
            <div className="flex flex-col justify-between items-start">
              <span className="text-gray-500 text-sm md:text-base flex gap-2">
                <Phone className="size-4 md:mt-1" />
                Phone
              </span>
              <span className="font-medium">{session.phone}</span>
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
          
          <h2 className="text-lg md:text-xl font-semibold">Session Insights</h2>

          
          <div className="flex justify-between flex-col items-start">
            <span className="text-gray-500 text-sm md:text-base">
              Completed Sessions
            </span>
            <span className="font-semibold text-base md:text-lg">3</span>
          </div>

          
          <div className="border-t border-gray-200"></div>

        
          <div className="flex flex-col justify-between items-start">
            <span className="text-gray-500 text-sm md:text-base">
              Pending Sessions in Package
            </span>
            <span className="font-semibold text-base md:text-lg">2</span>
          </div>
        </div>
      </div> */}
      {/* <div className="w-full flex justify-center mt-3"> */}
      <div className=" w-full mt-3 bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
        {/* Title */}
        <h2 className="text-lg md:text-xl font-semibold">Assessment Result</h2>

        {/* Three White Boxes */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {results.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFE8D8] rounded-xl p-4 flex flex-col items-center justify-center shadow-sm"
            >
              <p className="text-gray-500 text-sm text-center">{item.label}</p>
              <p className="text-lg md:text-xl font-semibold mt-2">
                {item.value}
              </p>
            </div>
          ))}
        </div> */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Assessment Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Result Status
                </th>
                {/* <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    Loading assessments...
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No assessments found
                  </td>
                </tr>
              ) : (
                currentData.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 text-xs">
                      {report.name}
                    </td>

                    <td
                      className={`px-4 py-3 text-xs ${
                        report.status === "Paid"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {report.status}
                    </td>

                    {/* <td className="px-4 py-3">
                    <button className="text-blue-600 hover:underline">
        <Download className="size-5" />
      </button>
                  </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between flex-col md:flex-row gap-3 p-3 md:p-6 border-t border-slate-200">
          <div>
            <h1 className="font-bold text-xs text-black">
              Total Data: {filteredReports.length}
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
      </div>
      {/* </div> */}
      {/* <div className="w-full flex justify-center mt-3"> */}

      <div className="w-full mt-3 bg-white border border-gray-300 rounded-3xl  p-6 space-y-8">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-medium">Intake Form</h2>

        {/* Form Content */}
        {session.userData.intakeForm ? (
          <ViewIntakeFormData session={session} />
        ) : (
          <div> No intake form submitted.</div>
        )}
      </div>
      {/* </div> */}
      {/* <div className="w-full flex justify-center mt-3"> */}
      {/* Main White Card */}
      <div className="w-full mt-3 bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
        {/* Title */}
        <h2 className="text-xl md:text-2xl font-medium">Session Notes</h2>

        {/* Notes Content Box */}
        <div className="w-full bg-gray-200 rounded-2xl p-4 ">
          <textarea
            className="w-full bg-transparent outline-none resize-none"
            type="text"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
          />
        </div>

        {/* Add Notes Button */}
        <div>
          <button
            onClick={saveSessionNote}
            disabled={!isChanged || loadingNote}
            className={`px-6 py-2 rounded-lg text-sm md:text-base transition
      ${
        isChanged
          ? loadingNote
            ? "bg-orange-400 text-white cursor-wait"
            : "bg-primary text-white hover:bg-orange-700"
          : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
          >
            {loadingNote ? "Saving..." : "Save Session Note"}
          </button>
        </div>
      </div>
      {/* </div>
      <div className="w-full flex justify-center mt-3"> */}
      <div className="w-full mt-3 bg-white border border-gray-300 rounded-3xl p-6 space-y-6">
        {/* Title */}
        {/* <h2 className="text-xl md:text-2xl font-medium">Recommendations</h2> */}
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-xl md:text-2xl font-medium">Recommendations</h2>

          <button
            onClick={() => setShowRecommendationModal(true)}
            className="text-sm bg-primary text-white px-4 py-2 rounded-lg"
          >
            View All
          </button>
        </div>
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
            <label className="flex items-center gap-2 cursor-pointer">
              <Paperclip size={18} />
              <span>Attach file</span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {file && (
            <p className="text-xs text-gray-600 mt-1">Attached: {file.name}</p>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={saveRecommendation}
          disabled={loadingRecommendation}
          className={`w-full md:w-auto rounded-lg px-8 py-3 text-sm md:text-base transition 
    ${loadingRecommendation ? "bg-orange-400 cursor-wait" : "bg-orange-600 text-white hover:bg-orange-700"}`}
        >
          {loadingRecommendation ? "Saving..." : "Save & Send Recommendations"}
        </button>
      </div>
      {showRecommendationModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[90%] md:w-[600px] max-h-[80vh] overflow-y-auto p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">All Recommendations</h2>
              <button
                onClick={() => setShowRecommendationModal(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {allRecommendations.length === 0 ? (
              <p className="text-gray-500">No recommendations yet.</p>
            ) : (
              allRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-4 space-y-2"
                >
                  <p className="text-gray-800">{rec.text}</p>

                  {rec.fileUrl && (
                    <a
                      href={rec.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm underline"
                    >
                      View Attachment
                    </a>
                  )}

                  <p className="text-xs text-gray-400">
                    {rec.createdAt?.toDate
                      ? rec.createdAt.toDate().toLocaleDateString()
                      : ""}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};

export default ViewSessionDetails;
