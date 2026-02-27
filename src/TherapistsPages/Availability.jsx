import { useState } from "react";

const Availability = () => {
  const daysList = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [slots, setSlots] = useState([
    { day: "Monday", start: "10:00", end: "18:00" },
    { day: "Monday", start: "10:00", end: "18:00" },
    { day: "Monday", start: "10:00", end: "18:00" },
  ]);

  const [form, setForm] = useState({ day: "", start: "", end: "" });

  const addSlot = () => {
    if (!form.day || !form.start || !form.end) return;
    setSlots([...slots, form]);
    setForm({ day: "", start: "", end: "" });
  };

  const removeSlot = (i) => {
    setSlots(slots.filter((_, index) => index !== i));
  };

  return (
    <div className="">
      {/* bg-white p-6 md:p-8 rounded-xl shadow w-full */}
      {/* <h2 className="text-lg font-semibold mb-6">Manage Availability</h2> */}

      {/* Select Therapist */}
      <div className="mb-6">
        <label className="block text-sm mb-1">Select Therapist</label>
        <input
          placeholder="Add Name"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Current Availability */}
      <h3 className="font-medium mb-3">Current Availability</h3>

      <div className="space-y-3 mb-6">
        {slots.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <p className="text-sm">
              <span className="font-medium">{s.day}</span> {s.start} - {s.end}
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
        <select
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Select Day</option>
          {daysList.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="time"
          value={form.start}
          onChange={(e) => setForm({ ...form, start: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm"
        />
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
        + Add Time slot
      </button>

      {/* <div className="mt-10 flex justify-center">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-2 rounded-lg">
          Save
        </button>
      </div> */}
    </div>
  );
};

export default Availability;
