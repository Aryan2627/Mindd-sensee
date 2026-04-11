import { Link } from "react-router-dom";
import React from "react";

export default function Navbar() {
  return (
    <div className="bg-black text-white p-4 flex gap-6">
      
      <Link to="/chat" className="text-purple-400">
        Chat
      </Link>

      <Link to="/mood" className="text-purple-400">
        Dashboard
      </Link>

    </div>
  );
}