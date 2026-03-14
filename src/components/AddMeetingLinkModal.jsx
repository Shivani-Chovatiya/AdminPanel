import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";

export default function AddMeetingLinkModal({
  isOpen,
  onClose,
  session,
  fetchTherapist,
}) {
  const [link, setLink] = useState("");
  console.log("AddMeetingLinkModal session:", session);
  if (!isOpen) return null;

  const handleSave = async () => {
    if (!link.trim()) {
      toast.error("Please enter meeting link");
      return;
    }

    try {
      console.log("Save link for session:", link);

      // TODO: save in firestore
      const therapistRef = doc(db, "therapists", session.therapist.id);

      const updatedSlots = session.therapist.slots.map((slot) => {
        if (
          slot.date === session.date &&
          slot.start === session.start &&
          slot.end === session.end
        ) {
          return {
            ...slot,
            meetingLink: link,
          };
        }

        return slot;
      });

      await updateDoc(therapistRef, {
        slots: updatedSlots,
      });
      toast.success("Meeting link added");
      fetchTherapist();
      onClose();
      setLink("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add link");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-5">
        <h2 className="text-xl font-semibold">Add Meeting Link</h2>

        <input
          type="text"
          placeholder="Enter Google Meet / Zoom link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-orange-500"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Save Link
          </button>
        </div>
      </div>
    </div>
  );
}
