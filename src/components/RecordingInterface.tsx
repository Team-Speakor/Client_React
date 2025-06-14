import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, ArrowLeft } from "lucide-react";
import { api, handleApiError } from "../utils/api";

interface RecordingInterfaceProps {
  onComplete: (data: any) => void;
  onBack: () => void;
  userName: string;
  sessionId?: string;
}

const RecordingInterface = ({ onComplete, onBack, userName, sessionId }: RecordingInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // On component unmount, close the single AudioContext
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const timeData = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeData);

    let sumSquares = 0.0;
    for (const amplitude of timeData) {
      const normalizedAmplitude = amplitude / 128.0 - 1.0;
      sumSquares += normalizedAmplitude * normalizedAmplitude;
    }
    const rms = Math.sqrt(sumSquares / timeData.length);
    const normalizedLevel = Math.min(rms * 150, 100);
    
    setAudioLevel(normalizedLevel);
    setIsSpeaking(normalizedLevel > 2);
  }, []);

  useEffect(() => {
    if (isRecording) {
      const loop = () => {
        updateAudioLevel();
        animationFrameRef.current = requestAnimationFrame(loop);
      };
      animationFrameRef.current = requestAnimationFrame(loop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setAudioLevel(0);
      setIsSpeaking(false);
    };
  }, [isRecording, updateAudioLevel]);

  const setupAudioAnalysis = async (stream: MediaStream) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.3;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyserRef.current = analyser;
    sourceRef.current = source;
  };

  const handleStopRecording = useCallback(async () => {
    console.log('🛑 녹음 중지 시작', { 
      recordedChunksLength: recordedChunks.length, 
      sessionId, 
      mediaRecorderState: mediaRecorder?.state 
    });
    
    setIsRecording(false);

    // Stop MediaRecorder
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      console.log('📹 MediaRecorder 중지됨');
    }

    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      console.log('🎤 오디오 스트림 중지됨');
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    analyserRef.current = null;
    
    console.log('🔍 녹음 중지 완료, MediaRecorder onstop 이벤트에서 업로드 처리됨');
  }, [mediaRecorder, audioStream, onComplete, userName, recordedChunks, sessionId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRecording) {
      handleStopRecording();
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording, timeLeft, handleStopRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      setAudioStream(stream);

      await setupAudioAnalysis(stream);
      
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log('📊 녹음 데이터 수신:', { chunkSize: event.data.size, totalChunks: chunks.length });
        }
      };
      
      recorder.onstop = () => {
        console.log('🎬 MediaRecorder onstop 이벤트:', { chunksCount: chunks.length, sessionId });
        setRecordedChunks(chunks);
        
        // 녹음 완료 시 데이터와 함께 onComplete 호출 (Processing 페이지로 이동)
        if (chunks.length > 0 && sessionId) {
          console.log('🎙️ 녹음 완료, Processing 페이지로 이동');
          
          // Blob을 File로 변환
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
          
          console.log('📁 오디오 파일 생성:', { size: audioFile.size, type: audioFile.type });
          
          // 녹음 데이터와 함께 onComplete 호출 (업로드는 Processing 페이지에서 처리)
          onComplete({
            inputType: 'recording',
            audioFile: audioFile,
            sessionId: sessionId
          });
          
        } else {
          console.log('⚠️ 녹음 데이터 없음 또는 sessionId 없음, Mock 데이터 사용');
          // Mock 데이터 사용
          const sampleData = {
            transcript: [
              {
                speaker: 'user',
                text: '안녕하세요, 저는 한국어를 배우고 있습니다.',
                errors: [
                  { word: '한국어를', position: 2, suggestion: '한국어를 (발음을 더 명확하게)' },
                  { word: '배우고', position: 3, suggestion: '배우고 (첫 음절에 강세)' }
                ]
              }
            ],
            speakers: [
              { id: 'user', name: userName, duration: '1:20' }
            ]
          };
          
          onComplete(sampleData);
        }
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('마이크 접근 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
    }
  };

  return (
    <div className="space-y-8 animate-slide-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg -ml-2 touch-target"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        
        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-xl border border-gray-200">
          <span className="text-lg font-mono font-semibold">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
        <div className="text-center space-y-4 max-w-lg">
          <h2 className="text-title text-gray-900">
            Korean Conversation Recording
          </h2>
          <p className="text-body text-gray-600">
            Speak freely or practice sentences you want to improve. <br /> We'll analyze your pronunciation.
          </p>
        </div>

        {/* Recording Button with Real-time Audio Visualization */}
        <div className="relative">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`
              relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
              ${isRecording 
                ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 scale-110' 
                : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105'
              }
            `}
          >
            {isRecording ? (
              <Square className="w-10 h-10 md:w-12 md:h-12 text-white" />
            ) : (
              <Mic className="w-10 h-10 md:w-12 md:h-12 text-white" />
            )}
          </button>
          
          {/* Real-time Audio Level Visualization */}
          {isRecording && (
            <>
              {/* Base pulse animation */}
              <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping opacity-75" />
              
              {/* Dynamic audio level rings */}
              {isSpeaking && (
                <>
                  <div 
                    className="absolute inset-0 rounded-full bg-red-200 opacity-30 transition-all duration-150"
                    style={{ transform: `scale(${1.3 + (audioLevel / 100) * 0.8})` }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full bg-red-300 opacity-20 transition-all duration-100"
                    style={{ transform: `scale(${1.5 + (audioLevel / 100) * 1.2})` }}
                  />
                  <div 
                    className="absolute inset-0 rounded-full bg-red-400 opacity-10 transition-all duration-75"
                    style={{ transform: `scale(${1.8 + (audioLevel / 100) * 1.5})` }}
                  />
                </>
              )}
            </>
          )}
        </div>

        <div className="text-center space-y-3 min-h-[110px]">
          <p className="text-lg font-medium text-gray-900">
            {isRecording ? 'Listening...' : 'Tap to start recording'}
          </p>
          
          {isRecording && (
            <div className="animate-fade-in space-y-3">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" />
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-sm text-gray-600 font-medium">Recording</span>
              </div>
            </div>
          )}
        </div>

        {/* Stop Button */}
        {isRecording && (
          <Button 
            onClick={handleStopRecording}
            className="btn-primary px-12"
          >
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default RecordingInterface;
