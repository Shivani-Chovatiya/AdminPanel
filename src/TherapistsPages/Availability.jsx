// import { useState } from "react";

// const Availability = ({ slots, setSlots }) => {
//   const daysList = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   const [form, setForm] = useState({ day: "", start: "", end: "" });

//   const addSlot = () => {
//     if (!form.day || !form.start || !form.end) return;
//     setSlots([...slots, form]);
//     setForm({ day: "", start: "", end: "" });
//   };

//   const removeSlot = (i) => {
//     setSlots(slots.filter((_, index) => index !== i));
//   };

//   return (
//     <div className="">
//       {/* bg-white p-6 md:p-8 rounded-xl shadow w-full */}
//       {/* <h2 className="text-lg font-semibold mb-6">Manage Availability</h2> */}

//       {/* Select Therapist */}
//       {/* <div className="mb-6">
//         <label className="block text-sm mb-1">Select Therapist</label>
//         <input
//           placeholder="Add Name"
//           className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
//         />
//       </div> */}

//       {/* Current Availability */}
//       {/* <h3 className="font-medium mb-3">Current Availability</h3> */}

//       <div className="space-y-3 mb-6">
//         {slots.map((s, i) => (
//           <div
//             key={i}
//             className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
//           >
//             <p className="text-sm">
//               <span className="font-medium">{s.day}</span> {s.start} - {s.end}
//             </p>

//             <button
//               onClick={() => removeSlot(i)}
//               className="text-orange-500 text-sm hover:underline"
//             >
//               Remove
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Add Slot */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <select
//           value={form.day}
//           onChange={(e) => setForm({ ...form, day: e.target.value })}
//           className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
//         >
//           <option value="">Select Day</option>
//           {daysList.map((d) => (
//             <option key={d} value={d}>
//               {d}
//             </option>
//           ))}
//         </select>
//         <input
//           type="time"
//           value={form.start}
//           onChange={(e) => setForm({ ...form, start: e.target.value })}
//           className="border rounded-lg px-3 py-2 text-sm"
//         />
//         <input
//           type="time"
//           value={form.end}
//           onChange={(e) => setForm({ ...form, end: e.target.value })}
//           className="border rounded-lg px-3 py-2 text-sm"
//         />
//       </div>

//       <button
//         onClick={addSlot}
//         className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
//       >
//         + Add Time slot
//       </button>

//       {/* <div className="mt-10 flex justify-center">
//         <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-2 rounded-lg">
//           Save
//         </button>
//       </div> */}
//     </div>
//   );
// };

// export default Availability;
import { useState } from "react";
import { toast } from "react-toastify";

const Availability = ({ slots, setSlots }) => {
  const [form, setForm] = useState({
    date: "",
    day: "",
    start: "",
    end: "",
    isBooked: false,
    lockedBy: null,
    lockTime: null,
  });

  // 🔥 Get Day from Date
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    if (!selectedDate) {
      setForm({ ...form, date: "", day: "" });
      return;
    }

    const dayName = new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
    });

    setForm({
      ...form,
      date: selectedDate,
      day: dayName,
    });
  };

  const addSlot = () => {
    if (!form.date || !form.start || !form.end) {
      toast.error("Please fill in all fields");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (form.date < today) {
      toast.error("Past date not allowed");
      return;
    }
    if (form.date === today) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const [sh, sm] = form.start.split(":").map(Number);
      const [eh, em] = form.end.split(":").map(Number);

      if (sh * 60 + sm <= currentMinutes) {
        toast.error(
          "Start time has already passed. Please select a future time.",
        );
        return;
      }
      if (eh * 60 + em <= currentMinutes) {
        toast.error(
          "End time has already passed. Please select a future time.",
        );
        return;
      }
    }

    if (form.start >= form.end) {
      toast.error("End time must be after start time");
      return;
    }

    // 🔥 check slot clash
    const clash = slots.some((slot) => {
      if (slot.date !== form.date) return false;

      return form.start < slot.end && form.end > slot.start;
    });

    if (clash) {
      toast.error("This time slot clashes with an existing slot");
      return;
    }

    setSlots([...slots, form]);

    setForm({
      date: "",
      day: "",
      start: "",
      end: "",
      isBooked: false,
      lockedBy: null,
      lockTime: null,
    });
  };

  const removeSlot = (i) => {
    if (slots[i]?.isBooked) {
      toast.warning("This slot is already booked and cannot be removed.");
      return;
    }
    setSlots(slots.filter((_, index) => index !== i));
  };

  return (
    <div>
      {/* Current Slots */}
      <div className="space-y-3 mb-6">
        {slots.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <p className="text-sm">
              <span className="font-medium">
                {s.date} ({s.day})
              </span>{" "}
              {s.start} - {s.end}
            </p>

            <button
              onClick={() => removeSlot(i)}
              className="text-orange-500 text-sm hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add Slot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Picker */}
        <input
          type="date"
          value={form.date}
          onChange={handleDateChange}
          min={new Date().toISOString().split("T")[0]}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        {/* Start Time */}
        <input
          type="time"
          value={form.start}
          onChange={(e) => setForm({ ...form, start: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        {/* End Time */}
        <input
          type="time"
          value={form.end}
          onChange={(e) => setForm({ ...form, end: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <button
        onClick={addSlot}
        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
      >
        + Add Time Slot
      </button>
    </div>
  );
};

export default Availability;
