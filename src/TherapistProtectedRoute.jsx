import { Navigate } from "react-router-dom";

const TherapistProtectedRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  console.log(role);
  if (role !== "therapist") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default TherapistProtectedRoute;
