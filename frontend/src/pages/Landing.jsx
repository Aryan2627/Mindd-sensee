import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { icon: "🧠", title: "Emotion detection", desc: "AI reads emotion behind your words with high accuracy." },
  { icon: "💬", title: "Supportive AI chat", desc: "Context-aware responses that adapt to your mood." },
  { icon: "📈", title: "Mood analytics", desc: "Track your emotional patterns over time." },
  { icon: "🌿", title: "Daily recommendations", desc: "Personalized exercises & mindful tasks." },
  { icon: "🔒", title: "Safe by design", desc: "Risk detection and safety alerts built-in." },
  { icon: "🎙️", title: "Voice input", desc: "Speak freely with speech-to-text support." },
];

export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-white overflow-hidden">

      {/* 🌟 BACKGROUND GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-pink-300/30 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      {/* HERO */}
      <section className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">

        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6 bg-purple-100 text-purple-600"
        >
          AI Mental Wellness Companion
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold leading-tight mb-6"
        >
          A space to{" "}
          <span className="text-purple-600">breathe</span>, reflect, and feel heard
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 mb-10 max-w-xl mx-auto"
        >
          Mind-Sense listens, detects emotions with AI, and gently guides you
          toward better mental wellness — anytime.
        </motion.p>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 justify-center flex-wrap"
        >
          <Link
            to="/auth"
            className="px-8 py-3.5 rounded-xl text-white font-medium bg-purple-600 hover:bg-purple-700 transition-all hover:scale-105 shadow-lg"
          >
            Start your journey
          </Link>

          <Link
            to="/chat"
            className="px-8 py-3.5 rounded-xl font-medium border border-purple-500 text-purple-600 hover:bg-purple-100 transition-all hover:scale-105"
          >
            Try Demo
          </Link>
        </motion.div>
      </section>

      {/* DISCLAIMER */}
      <div className="max-w-2xl mx-auto px-6 mb-16">
        <div className="rounded-xl px-5 py-4 text-sm text-center bg-red-50 text-red-600 border border-red-200 shadow-sm">
          ⚠️ This is not a substitute for professional mental health care.
        </div>
      </div>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-purple-200 hover:-translate-y-2 transition-all"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 bg-purple-100">
              {f.icon}
            </div>

            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* FOOTER CTA */}
      <section className="text-center pb-20">
        <h2 className="text-3xl font-semibold mb-4">
          Start improving your mental wellness today
        </h2>

        <Link
          to="/auth"
          className="px-8 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
        >
          Get Started
        </Link>
      </section>

    </main>
  );
}