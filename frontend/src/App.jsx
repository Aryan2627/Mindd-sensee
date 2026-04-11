import React from "react"; // ✅ ADD THIS LINE

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import MoodDashboard from "./pages/MoodDashboard";
import Profile from "./pages/Profile";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN */}
      <div className="flex-grow">
        <Routes>

          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />

          <Route
            path="/mood"
            element={
              <PrivateRoute>
                <MoodDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}