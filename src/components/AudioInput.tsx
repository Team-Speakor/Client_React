
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Upload, FileAudio, Plus, Minus } from "lucide-react";

interface AudioInputProps {
  onComplete: (data: any, userName: string, participantCount: number) => void;
}

const AudioInput = ({ onComplete }: AudioInputProps) => {
  const [userName, setUserName] = useState("");
  const [participantCount, setParticipantCount] = useState(2);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleRecordMode = () => {
    if (!userName.trim()) {
      alert("Please enter your name first");
      return;
    }
    onComplete({ inputType: 'recording' }, userName, participantCount);
  };

  const handleFileUpload = (file: File) => {
    if (!userName.trim()) {
      alert("Please enter your name first");
      return;
    }
    
    setUploadedFile(file);
    
    // Simulate processing the file with Korean conversation data
    setTimeout(() => {
      onComplete({ 
        inputType: 'file',
        file: file,
        transcript: [
          {
            speaker: 'user',
            text: '안녕하세요, 저는 한국어를 배우고 있어요.',
            errors: [
              { word: '한국어를', position: 2, suggestion: 'Pronunciation needs improvement' },
              { word: '배우고', position: 3, suggestion: 'Pronunciation needs improvement' }
            ]
          },
          {
            speaker: 'speaker1',
            text: '안녕하세요! 한국어 공부하시는군요. 열심히 하세요.',
            errors: []
          },
          {
            speaker: 'user', 
            text: '네, 감사합니다. 발음이 어려워서 연습하고 있어요.',
            errors: [
              { word: '발음이', position: 2, suggestion: 'Pronunciation needs improvement' }
            ]
          },
          {
            speaker: 'speaker2',
            text: '천천히 하시면 됩니다. 계속 연습하시면 늘어요.',
            errors: []
          },
          {
            speaker: 'user',
            text: '조언해주셔서 정말 고마워요.',
            errors: [
              { word: '조언해주셔서', position: 0, suggestion: 'Pronunciation needs improvement' }
            ]
          }
        ],
        speakers: Array.from({ length: participantCount }, (_, index) => ({
          id: `speaker${index + 1}`,
          name: `Speaker ${index + 1}`,
          duration: ['2:30', '1:45', '0:45', '1:15', '2:10'][index] || '1:00'
        }))
      }, userName, participantCount);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => 
      file.type.startsWith('audio/') || 
      ['mp3', 'wav', 'm4a'].some(ext => file.name.toLowerCase().endsWith(ext))
    );
    
    if (audioFile) {
      handleFileUpload(audioFile);
    } else {
      alert("Please upload a valid audio file (MP3, WAV, M4A)");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const updateParticipantCount = (increment: boolean) => {
    setParticipantCount(prev => {
      const newCount = increment ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(10, newCount));
    });
  };

  if (uploadedFile) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center space-y-3">
          <h3 className="text-title text-foreground">Processing Audio</h3>
          <p className="text-body text-muted-foreground max-w-md">
            Analyzing speakers and preparing for selection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white content-container">
      <div className="space-y-8 animate-slide-in-up">
        {/* User Input Section */}
        <div className="premium-card p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-title text-foreground">Tell us about yourself</h2>
            <p className="text-body text-muted-foreground">
              We need some basic information to get started
            </p>
          </div>

          <div className="grid gap-6 max-w-md mx-auto">
            {/* Name Input */}
            <div className="space-y-3">
              <label htmlFor="userName" className="text-label font-medium text-gray-900 block">
                Your Name
              </label>
              <Input
                id="userName"
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="input-field text-body text-gray-900 placeholder:text-gray-500"
              />
            </div>

            {/* Participant Count */}
            <div className="space-y-3">
              <label htmlFor="participantCount" className="text-label font-medium text-gray-900 block">
                Number of Participants
              </label>
              <div className="stepper-input">
                <button
                  type="button"
                  onClick={() => updateParticipantCount(false)}
                  disabled={participantCount <= 1}
                  className="stepper-button disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex-1 text-center py-3 text-body font-medium bg-white text-gray-900 border-t border-b border-gray-200">
                  {participantCount}
                </div>
                <button
                  type="button"
                  onClick={() => updateParticipantCount(true)}
                  disabled={participantCount >= 10}
                  className="stepper-button disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <p className="text-caption text-gray-500 text-center">
                Include yourself and all conversation participants
              </p>
            </div>
          </div>
        </div>

        {/* Input Method Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Live Recording */}
          <div className="speaker-card space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                <Mic className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-subtitle font-semibold text-foreground">Live Recording</h3>
                <p className="text-body text-muted-foreground">
                  Record your conversation in real-time
                </p>
              </div>
            </div>
            <Button 
              onClick={handleRecordMode}
              className="btn-primary w-full"
              disabled={!userName.trim()}
            >
              Start Recording
            </Button>
          </div>

          {/* File Upload */}
          <div className="speaker-card space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-subtitle font-semibold text-foreground">Upload Audio</h3>
                <p className="text-body text-muted-foreground">
                  Upload an existing audio file
                </p>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className={`
                border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
                ${isDragOver 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                }
                ${!userName.trim() ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                if (userName.trim()) setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => {
                if (userName.trim()) {
                  document.getElementById('audioFileInput')?.click();
                }
              }}
            >
              <FileAudio className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-body font-medium text-foreground mb-2">
                Drag and drop your audio file
              </p>
              <p className="text-caption text-muted-foreground mb-6">
                or click to browse
              </p>
              <Button 
                variant="outline" 
                size="sm"
                disabled={!userName.trim()}
                className="rounded-lg touch-target btn-secondary"
              >
                Select File
              </Button>
              <p className="text-caption text-muted-foreground mt-4">
                Supported formats: MP3, WAV, M4A
              </p>
            </div>

            <input
              id="audioFileInput"
              type="file"
              accept="audio/*,.mp3,.wav,.m4a"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-body text-muted-foreground">
            Choose your preferred method to start analyzing your Korean pronunciation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioInput;
