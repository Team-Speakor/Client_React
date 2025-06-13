
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, User } from "lucide-react";

interface Speaker {
  id: string;
  name: string;
  duration: string;
}

interface SpeakerSelectionProps {
  audioData: any;
  userName: string;
  participantCount: number;
  onSpeakerSelected: (speakerId: string) => void;
  onBack: () => void;
}

const SpeakerSelection = ({ audioData, userName, participantCount, onSpeakerSelected, onBack }: SpeakerSelectionProps) => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>('');
  const [playingSpeaker, setPlayingSpeaker] = useState<string>('');

  // Generate speakers based on participant count - ALWAYS use generic "Speaker X" format
  const speakers: Speaker[] = Array.from({ length: participantCount }, (_, index) => ({
    id: `speaker${index + 1}`,
    name: `Speaker ${index + 1}`,
    duration: ['2:30', '1:45', '0:45', '1:15', '2:10', '1:30', '0:55', '1:40', '2:00', '1:25'][index] || '1:00'
  }));

  const handlePlaySample = (speakerId: string) => {
    setPlayingSpeaker(speakerId);
    console.log(`Playing sample for ${speakerId}`);
    
    // Simulate audio playback
    setTimeout(() => {
      setPlayingSpeaker('');
    }, 2000);
  };

  const handleContinue = () => {
    if (selectedSpeaker) {
      onSpeakerSelected(selectedSpeaker);
    }
  };

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

        {/* Speaker Cards */}
        <div className="space-y-4">
          {speakers.map((speaker) => (
            <div
              key={speaker.id}
              className={`
                speaker-card transition-premium
                ${selectedSpeaker === speaker.id ? 'selected' : ''}
              `}
              onClick={() => setSelectedSpeaker(speaker.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Radio Button */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200
                    ${selectedSpeaker === speaker.id 
                      ? 'border-green-600 bg-green-600' 
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
                      <p className="text-caption text-muted-foreground">Duration: {speaker.duration}</p>
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
                  disabled={playingSpeaker === speaker.id}
                  className="rounded-lg touch-target btn-secondary"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {playingSpeaker === speaker.id ? 'Playing...' : 'Play'}
                </Button>
              </div>

              {/* Waveform Visualization */}
              <div className="mt-6 flex items-center space-x-1 h-10">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      waveform-bar
                      ${playingSpeaker === speaker.id && i < 20 ? 'active' : ''}
                    `}
                    style={{
                      height: `${Math.random() * 24 + 8}px`
                    }}
                  />
                ))}
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
      </div>
    </div>
  );
};

export default SpeakerSelection;
