import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400">Mind-Sense</h2>
          <p className="mt-3 text-sm text-gray-300">
            AI-powered mental health analysis platform helping users understand
            emotions and risks in real-time.
          </p>
        </div>

        {/* CENTER */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="hover:text-purple-400 cursor-pointer">Home</li>
            <li className="hover:text-purple-400 cursor-pointer">Analyze</li>
            <li className="hover:text-purple-400 cursor-pointer">About</li>
            <li className="hover:text-purple-400 cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <div className="flex space-x-4 text-xl">
            <FaGithub className="hover:text-purple-400 cursor-pointer" />
            <FaLinkedin className="hover:text-purple-400 cursor-pointer" />
            <FaTwitter className="hover:text-purple-400 cursor-pointer" />
          </div>

          <p className="mt-4 text-sm text-gray-400">
            Built with ❤️ using AI & React
          </p>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Mind-Sense. All rights reserved.
      </div>
    </footer>
  );
}