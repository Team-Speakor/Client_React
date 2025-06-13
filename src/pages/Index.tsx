
import { useState } from "react";
import RecordingInterface from "@/components/RecordingInterface";
import SpeakerSelection from "@/components/SpeakerSelection";
import AnalysisResults from "@/components/AnalysisResults";
import AudioInput from "@/components/AudioInput";

type AppState = 'input' | 'recording' | 'speaker-selection' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('input');
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
      // File upload - go directly to speaker selection
      setRecordedData(data);
      setAppState('speaker-selection');
    }
  };

  const handleRecordingComplete = (data: any) => {
    setRecordedData(data);
    setAppState('speaker-selection');
  };

  const handleSpeakerSelected = (speakerId: string) => {
    setSelectedSpeaker(speakerId);
    setAppState('results');
  };

  const handleStartOver = () => {
    setAppState('input');
    setRecordedData(null);
    setUserName('');
    setParticipantCount(2);
    setSelectedSpeaker('');
  };

  return (
    <div className="min-h-screen bg-white page-container">
      <div className="mx-auto max-w-4xl px-4 py-6 md:py-12">
        <header className="text-center mb-12 md:mb-20">
          <h1 className="text-display font-semibold text-foreground mb-4">Speakor</h1>
          <p className="text-subtitle text-muted-foreground">Korean Pronunciation Analysis</p>
        </header>

        <main className="w-full">
          {appState === 'input' && (
            <AudioInput onComplete={handleAudioInputComplete} />
          )}
          
          {appState === 'recording' && (
            <RecordingInterface 
              onComplete={handleRecordingComplete}
              onBack={() => setAppState('input')}
              userName={userName}
            />
          )}

          {appState === 'speaker-selection' && (
            <SpeakerSelection
              audioData={recordedData}
              userName={userName}
              participantCount={participantCount}
              onSpeakerSelected={handleSpeakerSelected}
              onBack={() => setAppState('input')}
            />
          )}
          
          {appState === 'results' && (
            <AnalysisResults 
              data={recordedData}
              userName={userName}
              selectedSpeaker={selectedSpeaker}
              onStartOver={handleStartOver}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
