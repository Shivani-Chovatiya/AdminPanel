// import { useEffect } from "react";

// const DisabledBack = () => {
//   useEffect(() => {
//     const handleBack = () => {
//       window.history.pushState(null, "", window.location.href);
//     };

//     // Push initial state
//     window.history.pushState(null, "", window.location.href);

//     // Listen back button
//     window.addEventListener("popstate", handleBack);

//     return () => {
//       window.removeEventListener("popstate", handleBack);
//     };
//   }, []);
// };

// export default DisabledBack;
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DisabledBack = (text) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      navigate(1);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
};

export default DisabledBack;
