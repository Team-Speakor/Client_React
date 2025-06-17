import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Upload, FileAudio, Plus, Minus } from "lucide-react";
import { api, handleApiError } from "../utils/api";

interface AudioInputProps {
  onComplete: (data: any, userName: string, participantCount: number, sessionId?: string) => void;
}

const AudioInput = ({ onComplete }: AudioInputProps) => {
  const [userName, setUserName] = useState("");
  const [participantCount, setParticipantCount] = useState(2);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecordingLoading, setIsRecordingLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleRecordMode = async () => {
    console.log('🎤 handleRecordMode 시작', { userName, participantCount });
    
    if (!userName.trim()) {
      alert("Please enter your name first");
      return;
    }

    try {
      setIsRecordingLoading(true);
      console.log('🔄 세션 초기화 시작...');
      
      // 세션 초기화
      const sessionResponse = await api.initSession(userName, participantCount);
      console.log('✅ 세션 초기화 성공:', sessionResponse);
      
      setSessionId(sessionResponse.session_id);
      
      console.log('🚀 onComplete 호출 중...');
      onComplete({ inputType: 'recording' }, userName, participantCount, sessionResponse.session_id);
    } catch (error) {
      console.error('❌ Session initialization failed:', error);
      alert(handleApiError(error));
    } finally {
      setIsRecordingLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    console.log('📁 handleFileUpload 시작', { fileName: file.name, fileSize: file.size, userName, participantCount });
    
    if (!userName.trim()) {
      alert("Please enter your name first");
      return;
    }

    // 파일 선택 즉시 로딩 상태로 전환하고 다음 화면으로 이동
    setIsUploadLoading(true);
    console.log('🔄 파일 업로드 프로세스 시작...');
    
    // 즉시 다음 화면으로 넘어가서 백그라운드에서 업로드 처리
    onComplete({ 
      inputType: 'file',
      file: file,
      userName: userName,
      participantCount: participantCount,
      uploadPromise: (async () => {
        try {
          // 1단계: 세션 초기화
          console.log('1️⃣ 세션 초기화 중...');
          const sessionResponse = await api.initSession(userName, participantCount);
          console.log('✅ 세션 초기화 성공:', sessionResponse);
          
          setSessionId(sessionResponse.session_id);
          
          // 2단계: 파일 업로드
          console.log('2️⃣ 파일 업로드 중...');
          const uploadResponse = await api.uploadAudio(sessionResponse.session_id, file);
          console.log('✅ 파일 업로드 성공:', uploadResponse);
          
          return {
            sessionId: sessionResponse.session_id,
            uploadResponse: uploadResponse
          };
          
        } catch (error) {
          console.error('❌ File upload failed:', error);
          throw error;
        }
      })()
    }, userName, participantCount);
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

          <div className="space-y-6 max-w-md mx-auto">
            {/* Name Input */}
            <div className="space-y-3">
              <label htmlFor="userName" className="text-sm font-medium text-gray-900 block">
                Your Name
              </label>
              <div className="relative">
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl font-semibold text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Participant Count */}
            <div className="space-y-3">
              <label htmlFor="participantCount" className="text-sm font-medium text-gray-900 block">
                Number of Participants
              </label>
              <div className="relative">
                <div className="flex items-center bg-white border border-gray-200 rounded-xl px-4 h-12">
                  <button
                    type="button"
                    onClick={() => updateParticipantCount(false)}
                    disabled={participantCount <= 1}
                    className="w-8 h-8 rounded-lg bg-gray-50 border-0 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-semibold text-gray-900 tabular-nums">
                      {participantCount}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateParticipantCount(true)}
                    disabled={participantCount >= 10}
                    className="w-8 h-8 rounded-lg bg-gray-50 border-0 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
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
              disabled={!userName.trim() || isRecordingLoading}
            >
              {isRecordingLoading ? "Initializing..." : "Start Recording"}
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
                disabled={!userName.trim() || isUploadLoading}
                className="rounded-lg touch-target btn-secondary"
              >
                {isUploadLoading ? "Uploading..." : "Select File"}
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
