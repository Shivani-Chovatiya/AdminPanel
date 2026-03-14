import React, { useEffect, useState } from "react";
import AddTherapistForm from "../TherapistsPages/AddTherapistForm";
import { auth, db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TherapistProfile = () => {
  const [therapist, setTherapist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const email = localStorage.getItem("therapistemail");
        if (!email) {
          toast.error("No therapist email found. Please log in again.");
          navigate("/");
          return;
        }

        const q = query(
          collection(db, "therapists"),
          where("email", "==", email),
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];

          setTherapist({
            id: docSnap.id,
            ...docSnap.data(),
          });
        }
      } catch (error) {
        console.error("Error fetching therapist:", error);
      }
    };

    fetchTherapist();
  }, []);

  if (!therapist) return <p>Loading...</p>;
  return (
    <div>{therapist && <AddTherapistForm therapistid={therapist?.id} />}</div>
  );
};

export default TherapistProfile;
