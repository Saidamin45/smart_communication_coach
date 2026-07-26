import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Volume2, Square, RefreshCw, Sparkles, MessageSquare } from 'lucide-react';

interface AudioRecorderProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  autoStartRecord?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Record your response or type here...",
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [activeTab, setActiveTab] = useState<'mic' | 'text'>('mic');

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Check speech recognition browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript.trim()) {
            setInputText((prev) => {
              if (prev && !prev.endsWith(' ')) return prev + ' ' + currentTranscript;
              return currentTranscript;
            });
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition error:', e.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        setIsSpeechSupported(false);
      }
    } else {
      setIsSpeechSupported(false);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const toggleRecording = () => {
    if (disabled) return;

    if (isRecording) {
      // Stop recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      // Start recording
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
          setRecordingTime(0);
          timerRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
          }, 1000);
        } catch (e) {
          console.error('Failed to start speech recognition', e);
        }
      } else {
        alert('Speech recognition is not supported in this browser. Please type your response.');
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || disabled) return;

    if (isRecording) {
      toggleRecording();
    }

    onSendMessage(inputText.trim());
    setInputText('');
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Input Mode Selector */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('mic')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'mic' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            Speech Voice Input
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors ${
              activeTab === 'text' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Text Typing Mode
          </button>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Recording: {formatTime(recordingTime)}
          </div>
        )}
      </div>

      {/* Main Text Area / Audio Visualizer */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
          />

          {isRecording && (
            <div className="absolute bottom-3 left-3 right-16 flex items-center gap-1 pointer-events-none">
              <div className="flex items-center gap-0.5 h-4">
                <span className="w-1 h-2 bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-4 bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-3 bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-5 bg-indigo-300 animate-bounce" style={{ animationDelay: '450ms' }} />
              </div>
              <span className="text-xs text-indigo-400 font-medium ml-2">Listening to your speech...</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || !isSpeechSupported}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-xs transition-all ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={!isSpeechSupported ? 'Speech recognition not supported in browser' : ''}
            >
              {isRecording ? <Square className="w-4 h-4 fill-current" /> : <Mic className="w-4 h-4 text-indigo-400" />}
              {isRecording ? 'Stop Recording' : 'Start Speaking'}
            </button>

            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-xs text-zinc-500 hover:text-zinc-300 underline px-2"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || !inputText.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs shadow-md shadow-indigo-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Submit Response</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
