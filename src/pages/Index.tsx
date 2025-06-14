import { useState } from "react";
import { Loader2 } from "lucide-react";
import RecordingInterface from "@/components/RecordingInterface";
import SpeakerSelection from "@/components/SpeakerSelection";
import AnalysisResults from "@/components/AnalysisResults";
import AudioInput from "@/components/AudioInput";

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

  const handleAudioInputComplete = (data: any, name: string, participants: number) => {
    setUserName(name);
    setParticipantCount(participants);
    if (data.inputType === 'recording') {
      setAppState('recording');
    } else {
      setRecordedData(data);
      setProcessingMessage('Analyzing speakers and preparing for selection...');
      setAppState('processing');
      setTimeout(() => {
        setAppState('speaker-selection');
      }, 2500);
    }
  };

  const handleRecordingComplete = (data: any) => {
    setRecordedData(data);
    setProcessingMessage('Analyzing speakers and preparing for selection...');
    setAppState('processing');
    setTimeout(() => {
      setAppState('speaker-selection');
    }, 2500);
  };

  const handleSpeakerSelected = (speakerId: string) => {
    setSelectedSpeaker(speakerId);
    setProcessingMessage('Performing final analysis...');
    setAppState('processing');
    setTimeout(() => {
      setAppState('results');
    }, 2500);
  };

  const handleStartOver = () => {
    setAppState('input');
    setRecordedData(null);
    setUserName('');
    setParticipantCount(2);
    setSelectedSpeaker('');
  };

  const renderContent = () => {
    switch (appState) {
      case 'input':
        return <AudioInput onComplete={handleAudioInputComplete} />;
      case 'recording':
        return <RecordingInterface onComplete={handleRecordingComplete} onBack={() => setAppState('input')} userName={userName} />;
      case 'processing':
        return <Processing message={processingMessage} />;
      case 'speaker-selection':
        return <SpeakerSelection audioData={recordedData} userName={userName} participantCount={participantCount} onSpeakerSelected={handleSpeakerSelected} onBack={() => setAppState('input')} />;
      case 'results':
        return <AnalysisResults data={recordedData} userName={userName} selectedSpeaker={selectedSpeaker} onStartOver={handleStartOver} />;
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
