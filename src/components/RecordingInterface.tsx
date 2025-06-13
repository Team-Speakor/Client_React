import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, ArrowLeft } from "lucide-react";

interface RecordingInterfaceProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  userName: string;
}

const RecordingInterface = ({ onComplete, onBack, userName }: RecordingInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let speakingTimeout: NodeJS.Timeout;
    
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        
        // More realistic speech simulation
        const shouldSpeak = Math.random() < 0.25;
        if (shouldSpeak) {
          setIsSpeaking(true);
          setAudioLevel(40 + Math.random() * 60);
          
          speakingTimeout = setTimeout(() => {
            setIsSpeaking(false);
            setAudioLevel(5 + Math.random() * 10);
          }, 800 + Math.random() * 1500);
        } else {
          setAudioLevel(5 + Math.random() * 15);
        }
      }, 1000);
    } else if (timeLeft === 0) {
      handleStopRecording();
    }

    return () => {
      clearInterval(interval);
      clearTimeout(speakingTimeout);
    };
  }, [isRecording, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log("Recording started for:", userName);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsSpeaking(false);
    setAudioLevel(0);
    
    // Mock Korean conversation data
    const sampleData = {
      transcript: [
        {
          speaker: 'user',
          text: '안녕하세요, 저는 한국어를 배우고 있습니다.',
          errors: [
            { word: '한국어를', position: 2, suggestion: '한국어를 (발음을 더 명확하게)' },
            { word: '배우고', position: 3, suggestion: '배우고 (첫 음절에 강세)' }
          ]
        },
        {
          speaker: 'speaker1',
          text: '안녕하세요. 만나서 반갑습니다. 천천히 연습해보세요.',
          errors: []
        },
        {
          speaker: 'user', 
          text: '감사합니다. 도움을 주셔서 정말 고맙습니다.',
          errors: [
            { word: '감사합니다', position: 0, suggestion: '감사합니다 (마지막 음을 더 명확하게)' }
          ]
        },
        {
          speaker: 'speaker2',
          text: '잘하고 계세요! 계속 연습하시면 됩니다.',
          errors: []
        }
      ],
      speakers: [
        { id: 'user', name: userName, duration: '1:20' },
        { id: 'speaker1', name: 'Speaker 1', duration: '0:45' },
        { id: 'speaker2', name: 'Speaker 2', duration: '0:30' }
      ]
    };
    
    onComplete(sampleData);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground rounded-xl -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-muted px-4 py-2 rounded-xl">
          <span className="text-lg font-mono font-medium text-foreground">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
        <div className="text-center space-y-4 max-w-lg">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
            Korean Conversation Recording
          </h2>
          <p className="text-muted-foreground">
            Speak freely or practice sentences you want to improve. We'll analyze your pronunciation.
          </p>
        </div>

        {/* Recording Button with Audio Visualization */}
        <div className="relative">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`
              relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
              ${isRecording 
                ? 'bg-red-500 hover:bg-red-600 scale-110' 
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              }
            `}
          >
            {isRecording ? (
              <Square className="w-8 h-8 md:w-10 md:h-10 text-white" />
            ) : (
              <Mic className="w-8 h-8 md:w-10 md:h-10 text-white" />
            )}
          </button>
          
          {/* Pulse Animation */}
          {isRecording && (
            <>
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
              {isSpeaking && (
                <div 
                  className="absolute inset-0 rounded-full bg-red-200 opacity-40 transition-all duration-200"
                  style={{ 
                    transform: `scale(${1.2 + audioLevel / 200})`,
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Status Text */}
        <div className="text-center space-y-3">
          <p className="text-lg font-medium text-foreground">
            {isRecording ? 'Listening...' : 'Tap to start recording'}
          </p>
          
          {isRecording && (
            <div className="flex items-center justify-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" />
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-sm text-muted-foreground">Recording</span>
              {isSpeaking && <span className="text-sm text-green-600">• Voice detected</span>}
            </div>
          )}
        </div>

        {/* Stop Button */}
        {isRecording && (
          <Button 
            onClick={handleStopRecording}
            variant="outline"
            size="lg"
            className="rounded-xl px-8 py-3 font-medium"
          >
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecordingInterface;
