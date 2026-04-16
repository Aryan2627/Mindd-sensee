import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

Chart.register(...registerables);

/* 🎨 COLORS */
const emotionColors = {
  happy: "#22c55e",
  neutral: "#a855f7",
  anxious: "#eab308",
  sad: "#3b82f6",
  angry: "#ef4444",
};

const emotionMap = {
  happy: 10,
  neutral: 6,
  anxious: 4,
  sad: 2,
  angry: 1,
};

export default function MoodDashboard() {
  const [history, setHistory] = useState([]);
  const [aiInsight, setAiInsight] = useState("Analyzing...");
  const [recommendations, setRecommendations] = useState([]);

  const lineRef = useRef(null);
  const donutRef = useRef(null);
  const lineChart = useRef(null);
  const donutChart = useRef(null);

  /* ✅ LOAD DATA */
  useEffect(() => {
    const loadData = () => {
      const stored =
        JSON.parse(localStorage.getItem("moodHistory")) || [];
      setHistory(stored);
    };

    loadData();
    window.addEventListener("moodUpdated", loadData);

    return () =>
      window.removeEventListener("moodUpdated", loadData);
  }, []);

  /* 🧠 SCORE */
  const score =
    history.length === 0
      ? 50
      : Math.round(
          (history.reduce(
            (s, h) => s + (emotionMap[h.value] || 5),
            0
          ) /
            history.length /
            10) *
            100
        );

  /* 📊 CHARTS */
  useEffect(() => {
    if (!history.length || !lineRef.current || !donutRef.current)
      return;

    const labels = history.map((_, i) => i + 1);
    const data = history.map((h) => emotionMap[h.value] || 5);

    const count = {};
    history.forEach((h) => {
      count[h.value] = (count[h.value] || 0) + 1;
    });

    if (lineChart.current) lineChart.current.destroy();
    if (donutChart.current) donutChart.current.destroy();

    /* LINE */
    lineChart.current = new Chart(lineRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data,
            borderColor: "#7c3aed",
            backgroundColor: "rgba(124,58,237,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    /* DONUT */
    donutChart.current = new Chart(donutRef.current, {
      type: "doughnut",
      data: {
        labels: Object.keys(count),
        datasets: [
          {
            data: Object.values(count),
            backgroundColor: Object.keys(count).map(
              (e) => emotionColors[e]
            ),
          },
        ],
      },
      options: { maintainAspectRatio: false },
    });

    setRecommendations([
      "🧘 Take a break",
      "📔 Journal your thoughts",
      "🎵 Listen to calming music",
    ]);
  }, [history]);

  /* 🤖 AI INSIGHT (FIXED ✅) */
  useEffect(() => {
    if (!history.length) return;

    fetch(import.meta.env.VITE_API_URL + "/api/insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ history }),
    })
      .then((r) => r.json())
      .then((d) => setAiInsight(d.insight || "No insight available"))
      .catch(() => setAiInsight("Insight unavailable"));
  }, [history]);

  /* 📄 PDF */
  const downloadPDF = async () => {
    const canvas = await html2canvas(
      document.getElementById("report")
    );
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 0, 0, 210, 297);
    pdf.save("report.pdf");
  };

  return (
    <div
      id="report"
      className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white p-6"
    >
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-4xl text-purple-600">
          Mental Dashboard
        </h1>

        <button
          onClick={downloadPDF}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl"
        >
          Download
        </button>
      </div>

      {/* SCORE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-6"
      >
        <div className="text-5xl font-bold text-purple-700">
          {score}
        </div>
        <p className="text-gray-500">Mental Score</p>
      </motion.div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow h-[300px]">
          <canvas ref={lineRef}></canvas>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow flex justify-center">
          <div className="w-48 h-48">
            <canvas ref={donutRef}></canvas>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="bg-white p-6 rounded-2xl shadow mb-6">
        <h2 className="mb-3 font-semibold">
          Recent Activity
        </h2>

        {history.slice(-5).map((h, i) => (
          <div key={i} className="flex justify-between py-2 border-b">
            <span>
              {h.value} ({h.category})
            </span>
            <span className="text-gray-400">
              {h.time}
            </span>
          </div>
        ))}
      </div>

      {/* AI */}
      <div className="bg-purple-100 p-6 rounded-2xl mb-6">
        <h2 className="font-semibold mb-2">
          AI Insights
        </h2>
        <p>{aiInsight}</p>
      </div>

      {/* RECOMMEND */}
      <div className="grid md:grid-cols-3 gap-4">
        {recommendations.map((r, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow">
            {r}
          </div>
        ))}
      </div>
    </div>
  );
}