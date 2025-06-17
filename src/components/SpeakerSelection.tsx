import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, User } from "lucide-react";
import { api, handleApiError } from "../utils/api";

interface Speaker {
  id: string;
  name: string;
  duration: string;
  audioUrl?: string;
  actualDuration?: number; // 실제 측정된 길이 (초)
  isLoadingDuration?: boolean; // 길이 측정 중 상태
}

interface SpeakerSelectionProps {
  audioData: any;
  userName: string;
  participantCount: number;
  sessionId: string;
  onSpeakerSelected: (speakerId: string) => void;
  onBack: () => void;
}

// 음향 시각화 컴포넌트
const AudioVisualizer = ({ audioElement, isPlaying }: { audioElement: HTMLAudioElement | null, isPlaying: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const sourceRef = useRef<MediaElementAudioSourceNode>();
  const dataArrayRef = useRef<Uint8Array>();

  useEffect(() => {
    if (!audioElement || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Web Audio API 설정
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      // 오디오 소스 연결
      if (!sourceRef.current) {
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    }

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);

      // 캔버스 클리어
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / dataArrayRef.current.length * 2.5;
      let x = 0;

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;
        
        // 그라디언트 색상
        const hue = (i / dataArrayRef.current.length) * 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        
        // 바 그리기
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    if (isPlaying) {
      draw();
    } else {
      // 정적 웨이브폼 표시
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#e5e7eb';
      for (let i = 0; i < 40; i++) {
        const barHeight = Math.random() * 30 + 5;
        const x = i * (canvas.width / 40);
        ctx.fillRect(x, canvas.height - barHeight, 3, barHeight);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={320} 
      height={60} 
      className="w-full h-15 rounded-lg"
      style={{ background: 'transparent' }}
    />
  );
};

const SpeakerSelection = ({ audioData, userName, participantCount, sessionId, onSpeakerSelected, onBack }: SpeakerSelectionProps) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [playingSpeaker, setPlayingSpeaker] = useState<string>('');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // 시간을 MM:SS 형식으로 포맷팅하는 함수
  const formatDuration = (seconds: number): string => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 오디오 길이를 측정하는 함수
  const measureAudioDuration = async (speaker: Speaker): Promise<number> => {
    return new Promise((resolve, reject) => {
      if (!speaker.audioUrl) {
        reject(new Error('No audio URL'));
        return;
      }

      const audio = new Audio();
      audio.preload = 'metadata'; // 메타데이터만 로드
      
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };

      audio.onerror = (error) => {
        reject(error);
      };

      audio.src = speaker.audioUrl;
    });
  };

  // 화자 목록의 오디오 길이를 측정하는 함수
  const measureAllDurations = async (speakerList: Speaker[]) => {
    for (const speaker of speakerList) {
      if (!speaker.audioUrl) continue;

      try {
        const duration = await measureAudioDuration(speaker);
        
        setSpeakers(prev => prev.map(s => 
          s.id === speaker.id 
            ? { 
                ...s, 
                actualDuration: duration,
                duration: formatDuration(duration),
                isLoadingDuration: false 
              }
            : s
        ));
        
      } catch (error) {
        setSpeakers(prev => prev.map(s => 
          s.id === speaker.id 
            ? { 
                ...s, 
                duration: '알 수 없음',
                isLoadingDuration: false 
              }
            : s
        ));
      }
    }
  };

  // API에서 화자 미리보기 데이터 가져오기
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await api.previewSpeakers(sessionId);
        
        const isDev = import.meta.env.DEV;
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        
        const apiSpeakers: Speaker[] = response.previews.map((preview, index) => ({
          id: preview.speaker,
          name: `Speaker ${index + 1}`,
          duration: 'Measuring...',
          audioUrl: isDev ? preview.url : `${apiBaseUrl}${preview.url}`,
          isLoadingDuration: true
        }));
        
        setSpeakers(apiSpeakers);
        measureAllDurations(apiSpeakers);
        
      } catch (error) {
        const fallbackSpeakers: Speaker[] = Array.from({ length: participantCount }, (_, index) => ({
          id: `SPEAKER_${String(index).padStart(2, '0')}`,
          name: `Speaker ${index + 1}`,
          duration: ['2:30', '1:45', '0:45', '1:15', '2:10', '1:30', '0:55', '1:40', '2:00', '1:25'][index] || '1:00'
        }));
        setSpeakers(fallbackSpeakers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpeakers();
  }, [sessionId, participantCount]);

  const handlePlaySample = async (speakerId: string) => {
    const speaker = speakers.find(s => s.id === speakerId);
    if (!speaker?.audioUrl) {
      return;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    if (playingSpeaker === speakerId) {
      setPlayingSpeaker('');
      setCurrentAudio(null);
      return;
    }

    let audio = audioRefs.current[speakerId];
    if (!audio) {
      audio = new Audio();
      audioRefs.current[speakerId] = audio;
    }

    if (audio.src !== speaker.audioUrl) {
      audio.src = speaker.audioUrl;
    }

    setPlayingSpeaker(speakerId);
    setCurrentAudio(audio);

    if (!audio.onended) {
      audio.onended = () => {
        setPlayingSpeaker('');
        setCurrentAudio(null);
      };
      
      audio.onerror = (error) => {
        setPlayingSpeaker('');
        setCurrentAudio(null);
      };
    }

    try {
      await audio.play();
    } catch (error) {
      setPlayingSpeaker('');
      setCurrentAudio(null);
    }
  };

  const handleContinue = () => {
    if (selectedSpeaker) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      onSpeakerSelected(selectedSpeaker);
    }
  };

  // 컴포넌트 언마운트 시 오디오 정리
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white page-container">
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
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-title text-foreground">
            Choose Your Voice
          </h2>
          <p className="text-body text-muted-foreground max-w-lg mx-auto">
            Please select which speaker you are from the detected voices.
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-body text-gray-700">Loading speakers...</p>
          </div>
        ) : (
          <>
            {/* Speaker Cards */}
            <div className="space-y-4">
              {speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className={`
                    speaker-card transition-premium
                    ${selectedSpeaker === speaker.id ? 'selected' : ''}
                    ${playingSpeaker === speaker.id ? 'playing' : ''}
                  `}
                  onClick={() => setSelectedSpeaker(speaker.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Radio Button */}
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                        ${selectedSpeaker === speaker.id 
                          ? 'border-blue-600 bg-blue-600' 
                          : 'border-gray-400'
                        }
                      `}>
                        {selectedSpeaker === speaker.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>

                      {/* Speaker Info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-body font-semibold text-foreground">
                            {speaker.name}
                          </h3>
                          <p className="text-caption text-muted-foreground flex items-center">
                            Duration: 
                            {speaker.isLoadingDuration ? (
                              <span className="duration-loading ml-1">
                                <div className="duration-spinner"></div>
                                Measuring...
                              </span>
                            ) : speaker.duration === '알 수 없음' ? (
                              <span className="duration-error ml-1">
                                {speaker.duration}
                              </span>
                            ) : (
                              <span className="duration-measured ml-1">
                                {speaker.duration}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Play Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySample(speaker.id);
                      }}
                      variant="outline"
                      size="sm"
                      className={`rounded-lg touch-target btn-secondary play-button ${
                        playingSpeaker === speaker.id ? 'bg-purple-50 border-purple-300 text-purple-700' : ''
                      }`}
                    >
                      {playingSpeaker === speaker.id ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Audio Visualization */}
                  <div className="audio-section">
                    <div className="audio-visualizer">
                      <AudioVisualizer 
                        audioElement={playingSpeaker === speaker.id ? currentAudio : null}
                        isPlaying={playingSpeaker === speaker.id}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="flex flex-col items-center space-y-6">
              <Button
                onClick={handleContinue}
                disabled={!selectedSpeaker}
                className="btn-primary w-full md:w-auto px-12"
              >
                Continue to Results
              </Button>
              
              {!selectedSpeaker && (
                <p className="text-caption text-muted-foreground">
                  Please select your voice to continue
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SpeakerSelection;
