export const speakText = (text, setIsSpeaking) => {
  const synth = window.speechSynthesis;

  if (!synth) return;

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);

  synth.speak(utterance);
};