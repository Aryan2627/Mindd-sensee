import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef as useThreeRef } from "react";
import React from "react";

/* ================= AI ORB ================= */

function AnimatedOrb({ speaking, emotion }) {
  const meshRef = useThreeRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    let scale = 1 + Math.sin(t * 2) * 0.05;

    if (speaking) scale = 1 + Math.sin(t * 8) * 0.2;

    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.rotation.y += 0.01;
    }
  });

  const colors = {
    happy: "#22c55e",
    sad: "#3b82f6",
    anxious: "#eab308",
    angry: "#ef4444",
    neutral: "#a855f7",
  };

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={colors[emotion] || "#fff"}
        emissive={colors[emotion] || "#fff"}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

function AIAssistant({ speaking, emotion }) {
  return (
    <div style={{ height: 200, width: 200 }}>
      <Canvas>
        <ambientLight />
        <pointLight position={[5, 5, 5]} />
        <AnimatedOrb speaking={speaking} emotion={emotion} />
      </Canvas>
    </div>
  );
}

/* ================= CATEGORY MAP ================= */

const categoryMap = {
  happy: "Positive",
  sad: "Emotional Distress",
  anxious: "Stress",
  angry: "Aggression",
  neutral: "Stable",
};

/* ================= MAIN ================= */

export default function Chat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);

  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  const chatEndRef = useRef(null);

  /* LOAD CHAT */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chatHistory")) || [];

    if (stored.length) {
      setChats(stored);
      setActiveChatId(stored[0].id);
    } else {
      createNewChat();
    }
  }, []);

  /* SAVE CHAT */
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  /* 🎤 MIC */
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    setListening(true);

    recognition.onresult = (e) => {
      setInput(e.results[0][0].transcript);
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };

  /* 🔊 SPEAK */
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    speechSynthesis.speak(utter);
  };

  /* NEW CHAT */
  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  /* 🚀 SEND MESSAGE */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, userMsg] }
          : chat
      )
    );

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      const detectedEmotion = data.emotion;

      const aiMsg = { role: "ai", text: data.reply };

      /* 🧠 STORE MOOD HISTORY */
      const newEntry = {
        value: detectedEmotion,
        category: categoryMap[detectedEmotion],
        text: input,
        time: new Date().toLocaleString(),
      };

      const prev =
        JSON.parse(localStorage.getItem("moodHistory")) || [];

      const updated = [...prev, newEntry];

      localStorage.setItem("moodHistory", JSON.stringify(updated));

      /* 🚀 REAL-TIME UPDATE */
      window.dispatchEvent(new Event("moodUpdated"));

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                title:
                  chat.messages.length === 0
                    ? input.slice(0, 20)
                    : chat.title,
                messages: [...chat.messages, userMsg, aiMsg],
              }
            : chat
        )
      );

      setEmotion(detectedEmotion);
      speak(data.reply);

    } catch {
      alert("Backend error");
    }

    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex h-screen text-white">

      {/* SIDEBAR */}
      <div className="w-64 bg-black/40 p-3">
        <button
          onClick={createNewChat}
          className="bg-purple-600 p-2 rounded mb-3 w-full"
        >
          + New Chat
        </button>

        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`p-2 mb-2 rounded cursor-pointer ${
              chat.id === activeChatId
                ? "bg-purple-600"
                : "bg-white/10"
            }`}
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black via-purple-900 to-black">

        {/* AI */}
        <div className="flex justify-center mt-4">
          <AIAssistant speaking={speaking} emotion={emotion} />
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeChat?.messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-lg ${
                msg.role === "user"
                  ? "ml-auto bg-purple-600"
                  : "bg-white/10"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && <p>Typing...</p>}
          <div ref={chatEndRef}></div>
        </div>

        {/* INPUT */}
        <div className="p-4 flex gap-3 bg-black/30 items-center">

          <input
            className="flex-1 p-3 rounded-xl bg-white/10 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or speak..."
          />

          <button
            onClick={startListening}
            className="bg-white/10 px-3 py-2 rounded-xl"
          >
            {listening ? "🎙️" : "🎤"}
          </button>

          <button
            onClick={sendMessage}
            className="bg-purple-600 px-4 py-2 rounded-xl"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}