import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Chat from "./pages/Chat";
import MoodDashboard from "./pages/MoodDashboard";
import Profile from "./pages/Profile";

// 🔒 Protected route
function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      
      <Navbar />

      <div className="flex-grow">
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* ✅ CHAT ALWAYS WORKS */}
          <Route path="/chat" element={<Chat />} />

          {/* 🔒 PROTECTED */}
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

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </div>

      <Footer />
    </div>
  );
}