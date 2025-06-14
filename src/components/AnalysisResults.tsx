import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Eye, EyeOff, ChevronRight } from "lucide-react";
import FeedbackPanel from "./FeedbackPanel";

interface Error {
  word: string;
  position: number;
  suggestion: string;
}

interface TranscriptItem {
  speaker: string;
  text: string;
  errors: Error[];
}

interface AnalysisResultsProps {
  data: {
    transcript?: TranscriptItem[];
  };
  userName: string;
  selectedSpeaker: string;
  onStartOver: () => void;
}

const AnalysisResults = ({ data, userName, selectedSpeaker, onStartOver }: AnalysisResultsProps) => {
  const [selectedSegment, setSelectedSegment] = useState<TranscriptItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAllFeedback, setShowAllFeedback] = useState(false);

  // Mock transcript with Korean examples if no real data
  const mockTranscript: TranscriptItem[] = [
    {
      speaker: 'user',
      text: '안녕하세요, 저는 한국어를 배우고 있습니다.',
      errors: [
        { word: '한국어를', position: 3, suggestion: 'Pronunciation needs improvement' },
        { word: '배우고', position: 4, suggestion: 'Pronunciation needs improvement' }
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
        { word: '감사합니다', position: 0, suggestion: 'Pronunciation needs improvement' }
      ]
    },
    {
      speaker: 'speaker2',
      text: '천천히 하세요! 계속 연습하시면 됩니다.',
      errors: []
    }
  ];

  const transcript = data?.transcript && data.transcript.length > 0 ? data.transcript : mockTranscript;

  const handlePlayRecording = () => {
    if (isPlaying) {
      setIsPlaying(false);
      console.log("Stopping recording playback");
    } else {
      setIsPlaying(true);
      console.log("Playing full recording");
      
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  };

  const getSpeakerLabel = (speaker: string) => {
    if (speaker === 'user') return userName;
    if (speaker === 'speaker1') return 'Speaker 1';
    if (speaker === 'speaker2') return 'Speaker 2';
    if (speaker === 'speaker3') return 'Speaker 3';
    return `Speaker ${speaker.replace('speaker', '')}`;
  };

  const getSpeakerStyle = (speaker: string) => {
    if (speaker === 'user') {
      return 'bg-blue-50 border-l-blue-500';
    }
    
    const otherStyles = {
      'speaker1': 'bg-green-50 border-l-green-500',
      'speaker2': 'bg-purple-50 border-l-purple-500',
      'speaker3': 'bg-orange-50 border-l-orange-500',
    };
    
    return otherStyles[speaker as keyof typeof otherStyles] || 'bg-gray-50 border-l-gray-400';
  };

  const getSpeakerBadgeStyle = (speaker: string) => {
    if (speaker === 'user') {
      return 'bg-blue-600 text-white font-semibold';
    }
    
    const badgeStyles = {
      'speaker1': 'bg-green-600 text-white font-medium',
      'speaker2': 'bg-purple-600 text-white font-medium', 
      'speaker3': 'bg-orange-600 text-white font-medium',
    };
    
    return badgeStyles[speaker as keyof typeof badgeStyles] || 'bg-gray-600 text-white font-medium';
  };

  const handleSegmentClick = (item: TranscriptItem) => {
    if (item.speaker === 'user' && item.errors && item.errors.length > 0) {
      setSelectedSegment(item);
    }
  };

  const renderTextWithErrors = (item: TranscriptItem) => {
    if (item.speaker !== 'user' || !item.errors || item.errors.length === 0) {
      return item.text;
    }

    const words = item.text.split(' ');
    return words.map((word, index) => {
      const error = item.errors.find(e => e.position === index);
      
      if (error) {
        return (
          <span
            key={index}
            className="error-word"
            onClick={() => handleSegmentClick(item)}
          >
            {word}
          </span>
        );
      }
      
      return <span key={index}>{word}</span>;
    }).reduce((acc, curr, index) => {
      if (index === 0) return [curr];
      return [...acc, ' ', curr];
    }, [] as React.ReactNode[]);
  };

  const userSegments = transcript.filter(item => item.speaker === 'user');
  const totalSegments = userSegments.length;
  const perfectSegments = userSegments.filter(item => !item.errors || item.errors.length === 0).length;
  const segmentAccuracy = totalSegments > 0 ? Math.round((perfectSegments / totalSegments) * 100) : 100;

  const totalErrors = userSegments.reduce((sum, item) => sum + (item.errors?.length || 0), 0);

  if (!transcript.length) {
    return (
      <div className="min-h-screen bg-white space-y-6 animate-fade-in">
        <div className="premium-card p-8 text-center">
          <h2 className="text-title text-foreground mb-4">
            No Analysis Data Available
          </h2>
          <p className="text-body text-muted-foreground mb-6">
            There seems to be an issue with the recording data. Please try recording again.
          </p>
          <Button
            onClick={onStartOver}
            variant="outline"
            className="rounded-lg touch-target btn-secondary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white page-container">
      <div className="space-y-8 animate-slide-in-up">
        {/* Header */}
        <div className="premium-card p-6 md:p-8">
          <div className="flex flex-col gap-6 mb-8">
            <div className="text-center md:text-left">
              <h2 className="text-title text-gray-900 mb-2">
                Analysis Results
              </h2>
              <p className="text-body text-gray-700">
                Pronunciation analysis for <span className="font-semibold text-blue-600">{userName}</span>
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button
                  onClick={handlePlayRecording}
                  variant="outline"
                  size="sm"
                  className="w-full justify-center rounded-lg touch-target btn-secondary text-gray-700 border-gray-200 hover:bg-gray-50 h-11"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      <span className="min-w-[80px]">Stop</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      <span className="min-w-[80px]">Play Recording</span>
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={() => setShowAllFeedback(!showAllFeedback)}
                  variant="outline"
                  size="sm"
                  className="w-full justify-center rounded-lg touch-target btn-secondary text-gray-700 border-gray-200 hover:bg-gray-50 h-11"
                >
                  {showAllFeedback ? (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" />
                      <span className="min-w-[80px]">Hide Feedback</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      <span className="min-w-[80px]">View Feedback</span>
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={onStartOver}
                  variant="outline"
                  size="sm"
                  className="w-full sm:col-span-2 lg:col-span-1 justify-center rounded-lg touch-target btn-secondary text-gray-700 border-gray-200 hover:bg-gray-50 h-11"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  <span className="min-w-[80px]">Start Over</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">{segmentAccuracy}%</div>
              <div className="text-caption text-gray-600">Segment Accuracy</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">{perfectSegments}/{totalSegments}</div>
              <div className="text-caption text-gray-600">Perfect Segments</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-red-500">{totalErrors}</div>
              <div className="text-caption text-gray-600">Total Errors</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">{totalSegments}</div>
              <div className="text-caption text-gray-600">Your Segments</div>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-body text-blue-800">
              💡 Click on any segment with errors to see detailed pronunciation feedback and improvement tips.
            </p>
          </div>
        </div>

        {/* Conversation Transcript */}
        <div className="space-y-4">
          {transcript.map((item, index) => (
            <div
              key={index}
              className={`
                premium-card p-6 border-l-4 transition-premium cursor-pointer
                ${getSpeakerStyle(item.speaker)}
                ${selectedSegment === item ? 'segment-highlight' : ''}
                ${item.speaker === 'user' && item.errors && item.errors.length > 0 ? 'hover:shadow-premium-lg' : ''}
              `}
              onClick={() => handleSegmentClick(item)}
            >
              <div className="flex items-start space-x-4">
                <div className={`
                  px-4 py-2 rounded-full text-sm font-medium min-w-fit
                  ${getSpeakerBadgeStyle(item.speaker)}
                `}>
                  {getSpeakerLabel(item.speaker)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body leading-relaxed text-gray-900">
                    {renderTextWithErrors(item)}
                  </p>
                  {item.errors && item.errors.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-700 flex items-center font-medium">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {item.errors.length} pronunciation {item.errors.length === 1 ? 'error' : 'errors'} detected
                      </p>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* All Feedback Summary Panel */}
        {showAllFeedback && (
          <div className="premium-card p-6">
            <h3 className="text-subtitle font-semibold text-gray-900 mb-6">
              Complete Feedback Summary
            </h3>
            <div className="space-y-4">
              {userSegments
                .filter(item => item.errors && item.errors.length > 0)
                .map((item, segmentIndex) => (
                  <div
                    key={segmentIndex}
                    className="premium-card p-4 cursor-pointer hover:shadow-premium transition-premium border border-gray-200"
                    onClick={() => setSelectedSegment(item)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-body font-semibold text-gray-900 mb-2">
                          Segment {segmentIndex + 1}: "{item.text.substring(0, 50)}..."
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.errors?.map((error, errorIndex) => (
                            <span
                              key={errorIndex}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {error.word}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg btn-secondary ml-4 flex-shrink-0 h-10 px-4"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Enhanced Feedback Panel */}
        {selectedSegment && (
          <FeedbackPanel
            segment={selectedSegment}
            onClose={() => setSelectedSegment(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
