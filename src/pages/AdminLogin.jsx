import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     toast.warning("Please fill all fields");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const userCredential = await signInWithEmailAndPassword(
  //       auth,
  //       email,
  //       password,
  //     );
  //     console.log("Logged in user:", userCredential.user);

  //     // toast.success("Login successful 🎉");

  //     //   // Optional admin check
  //     //   if (userCredential.user.email !== "admin@gmail.com") {
  //     //     toast.error("Not authorized as admin");
  //     //     return;
  //     //   }

  //     //   navigate("/dashboard/analytics");
  //     // } catch (error) {
  //     //   console.error(error);

  //     //   if (error.code === "auth/user-not-found") {
  //     //     toast.error("User not found");
  //     //   } else if (error.code === "auth/wrong-password") {
  //     //     toast.error("Incorrect password");
  //     //   } else if (error.code === "auth/invalid-email") {
  //     //     toast.error("Invalid email format");
  //     //   } else {
  //     //     toast.error("Login failed. Please try again.");
  //     //   }
  //     // } finally {
  //     //   setLoading(false);
  //     // }
  //     if (userCredential.user.email === "admin@gmail.com") {
  //       toast.success("Admin login successful 🎉");
  //       navigate("/dashboard/analytics");
  //       return;
  //     }

  //     // 🔎 Check therapist collection
  //     const q = query(
  //       collection(db, "therapists"),
  //       where("email", "==", userCredential.user.email),
  //     );
  //     console.log("Therapist query snapshot:", q);
  //     const querySnapshot = await getDocs(q);
  //     console.log("Therapist query snapshot:", querySnapshot);
  //     if (!querySnapshot.empty) {
  //       const therapist = querySnapshot.docs[0].data();

  //       // verify password
  //       if (therapist.password === password) {
  //         toast.success("Therapist login successful 🎉");

  //         navigate("/therapist/dashboard");
  //         return;
  //       }
  //     }

  //     toast.error("You are not authorized to access this panel");
  //   } catch (error) {
  //     console.error(error);

  //     if (error.code === "auth/user-not-found") {
  //       toast.error("User not found");
  //     } else if (error.code === "auth/wrong-password") {
  //       toast.error("Incorrect password");
  //     } else if (error.code === "auth/invalid-email") {
  //       toast.error("Invalid email format");
  //     } else {
  //       toast.error("Login failed. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async () => {
    if (!email || !password) {
      toast.warning("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // 🔐 Try Admin Login (Firebase Auth)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (
        userCredential.user.email === "admin@gmail.com" ||
        userCredential.user.email === "steeryourhappiness.dev@gmail.com"
      ) {
        toast.success("Admin login successful 🎉");
        navigate("/dashboard/analytics");
        return;
      }
    } catch (authError) {
      // If Firebase auth fails, check therapist login
      console.log("Auth failed, checking therapist...");
    }

    try {
      // 🔎 Check Therapist in Firestore
      const q = query(
        collection(db, "therapists"),
        where("email", "==", email),
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const therapist = querySnapshot.docs[0].data();

        if (therapist.password === password) {
          localStorage.setItem("role", "therapist");
          localStorage.setItem("therapistemail", email);
          toast.success("Therapist login successful 🎉");
          navigate("/therapist/dashboard");
          return;
        } else {
          toast.error("Incorrect password");
          return;
        }
      }

      toast.error("User not found");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning("Please enter your email first");
      return;
    }

    if (
      email != "steeryourhappiness.dev@gmail.com" &&
      email !== "admin@gmail.com"
    ) {
      toast.info("Please contact admin to reset your password");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent to admin email");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100  flex items-center justify-center px-4">
      {/* Main White Container */}
      <div className="w-full max-w-5xl  rounded-md py-16 flex flex-col items-center">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-700 mb-8">AdminPanel</h2>

        {/* Login Card */}
        <div className="bg-white w-full max-w-sm rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800">Welcome back</h3>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access the admin panel.
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-gray-600">Password</label>
              <button
                // onClick={handleForgotPassword}
                className="text-xs text-orange-500 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
              />

              {/* Toggle Icon */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
          {/* <button
            onClick={() => {
              // navigate("/dashboard/analytics")
              navigate("/therapist/dashboard");
            }}
            className="mt-5 w-full bg-primary hover:bg-orange-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            Therapist Panel(Testing..)
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
