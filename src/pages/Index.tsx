import { useState } from "react";
import { Loader2 } from "lucide-react";
import RecordingInterface from "@/components/RecordingInterface";
import SpeakerSelection from "@/components/SpeakerSelection";
import AnalysisResults from "@/components/AnalysisResults";
import AudioInput from "@/components/AudioInput";
import { api, handleApiError, runFullAnalysis } from "@/utils/api";

type AppState = 'input' | 'recording' | 'processing' | 'speaker-selection' | 'results';

const Processing = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-white page-container">
    <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in text-center min-h-[50vh]">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
      <p className="text-body text-gray-700">
        {message}
      </p>
    </div>
  </div>
);

const Index = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [processingMessage, setProcessingMessage] = useState<string>('');
  const [recordedData, setRecordedData] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [participantCount, setParticipantCount] = useState<number>(2);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleAudioInputComplete = async (data: any, name: string, participants: number, sessionIdFromInput?: string) => {
    setUserName(name);
    setParticipantCount(participants);
    
    if (sessionIdFromInput) {
      setSessionId(sessionIdFromInput);
    }
    
    if (data.inputType === 'recording') {
      setAppState('recording');
    } else {
      // 파일 업로드: 즉시 로딩 화면으로 전환
      setProcessingMessage('Uploading file and initializing session...');
      setAppState('processing');
      
      try {
        // 업로드 Promise 대기
        const uploadResult = await data.uploadPromise;
        
        setSessionId(uploadResult.sessionId);
        setRecordedData({
          ...data,
          audioFile: data.file,
          uploadResponse: uploadResult.uploadResponse,
          sessionId: uploadResult.sessionId
        });
        
        // 업로드 완료 후 화자 분리 시작
        setProcessingMessage('Analyzing speakers and preparing for selection...');
        await api.diarizeAudio(uploadResult.sessionId);
        setAppState('speaker-selection');
        
      } catch (error) {
        console.error('File upload or diarization failed:', error);
        alert(handleApiError(error));
        setAppState('input');
      }
    }
  };

  const handleRecordingComplete = async (data: any) => {
    setRecordedData(data);
    setProcessingMessage('Analyzing speakers and preparing for selection...');
    setAppState('processing');
    
    try {
      // 녹음 파일이 있는 경우 업로드 먼저 실행
      if (data.audioFile && data.sessionId) {
        console.log('📤 녹음 파일 업로드 시작...');
        const uploadResponse = await api.uploadAudio(data.sessionId, data.audioFile);
        console.log('✅ 업로드 완료:', uploadResponse);
        
        // 업로드 완료 후 화자 분리 실행
        console.log('🔄 화자 분리 시작...');
        await api.diarizeAudio(data.sessionId);
        console.log('✅ 화자 분리 완료');
        
        // 데이터 업데이트
        setRecordedData({
          ...data,
          uploadResponse: uploadResponse,
          diarizationComplete: true
        });
      }
      
      setAppState('speaker-selection');
    } catch (error) {
      console.error('❌ Recording processing failed:', error);
      alert(handleApiError(error));
      setAppState('input');
    }
  };

  const handleSpeakerSelected = async (speakerId: string) => {
    setSelectedSpeaker(speakerId);
    setAppState('processing');
    
    try {
      console.log('🎯 화자 선택 완료, 분석 플로우 시작:', { speakerId, userName, sessionId });
      
      // 1단계: 화자 선택 API 호출
              setProcessingMessage('Selecting speaker and preparing analysis...');
      await api.selectSpeaker(sessionId, speakerId);
      console.log('✅ 화자 선택 API 완료');
      
      // Step 2: Sequential STT → LLM analysis
      const analysisResult = await runFullAnalysis(
        sessionId, 
        speakerId, 
        userName,
        (step, message) => {
          // 진행률 업데이트 콜백
          setProcessingMessage(message);
          console.log(`📈 진행률 업데이트: ${step} - ${message}`);
        }
      );
      
      console.log('🎉 전체 분석 완료:', analysisResult);
      
      // 분석 결과 저장
      setAnalysisResults(analysisResult);
      setRecordedData({ 
        ...recordedData, 
        analysisResult: analysisResult,
        segments: analysisResult.segments,
        stats: analysisResult.stats
      });
      
      setAppState('results');
      
    } catch (error) {
      console.error('❌ 화자 선택 또는 분석 실패:', error);
      alert(handleApiError(error));
      setAppState('speaker-selection');
    }
  };

  const handleStartOver = () => {
    setAppState('input');
    setRecordedData(null);
    setUserName('');
    setParticipantCount(2);
    setSelectedSpeaker('');
    setSessionId('');
    setAnalysisResults(null);
  };

  const renderContent = () => {
    switch (appState) {
      case 'input':
        return <AudioInput onComplete={handleAudioInputComplete} />;
      case 'recording':
        return <RecordingInterface onComplete={handleRecordingComplete} onBack={() => setAppState('input')} userName={userName} sessionId={sessionId} />;
      case 'processing':
        return <Processing message={processingMessage} />;
      case 'speaker-selection':
        return <SpeakerSelection audioData={recordedData} userName={userName} participantCount={participantCount} sessionId={sessionId} onSpeakerSelected={handleSpeakerSelected} onBack={() => setAppState('input')} />;
      case 'results':
        return <AnalysisResults data={recordedData} userName={userName} selectedSpeaker={selectedSpeaker} analysisResults={analysisResults} onStartOver={handleStartOver} />;
      default:
        return <AudioInput onComplete={handleAudioInputComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-white page-container">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-12">
        <header className="text-center">
          <div className="">
            <img 
              src="/Logo.png" 
              alt="Speakor" 
              className="mx-auto h-[19rem] w-auto"
            />
          </div>
        </header>

        <main className="w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
