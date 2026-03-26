// import { Navigate } from "react-router-dom";
// import { auth } from "./config/firebase";

// const ProtectedRoute = ({ children }) => {
//   const user = auth.currentUser;

//   if (!user) {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔥 WAIT until auth is ready
  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // 🔥 ONLY redirect after loading
  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
