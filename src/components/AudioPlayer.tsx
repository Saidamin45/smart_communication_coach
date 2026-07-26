import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles } from 'lucide-react';

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const handleSpeak = () => {
    if (!speechSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoPlay && text && speechSupported) {
      handleSpeak();
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text, autoPlay]);

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        isPlaying
          ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50 animate-pulse'
          : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700/80'
      }`}
      title="Listen to AI Coach"
    >
      {isPlaying ? (
        <>
          <Pause className="w-3.5 h-3.5 text-white" />
          <span>Speaking...</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Listen Audio</span>
        </>
      )}
    </button>
  );
};
