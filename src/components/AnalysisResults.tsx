import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Eye, EyeOff, ChevronRight } from "lucide-react";
import FeedbackPanel from "./FeedbackPanel";
import { LLMSegment, extractErrorWords } from "@/utils/api";

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

// 실제 API 세그먼트를 UI용 TranscriptItem으로 변환하는 함수
const convertSegmentToTranscript = (segment: LLMSegment & { display_name?: string }): TranscriptItem => {
  const errorWords = extractErrorWords(segment.correct_text, segment.masked_text);
  
  return {
    speaker: segment.display_name || segment.speaker_name,
    text: segment.correct_text,
    errors: errorWords.map(error => ({
      word: error.word,
      position: error.position,
      suggestion: segment.improvement_tips || 'Pronunciation needs improvement'
    }))
  };
};

interface AnalysisResultsProps {
  data: {
    transcript?: TranscriptItem[];
    audioFile?: File;
    uploadResponse?: any;
    segments?: (LLMSegment & { display_name?: string })[];
    stats?: {
      segmentAccuracy: number;
      perfectSegments: number;
      totalErrors: number;
      totalSegments: number;
    };
  };
  userName: string;
  selectedSpeaker: string;
  analysisResults?: {
    segments: (LLMSegment & { display_name?: string })[];
    stats: {
      segmentAccuracy: number;
      perfectSegments: number;
      totalErrors: number;
      totalSegments: number;
    };
  };
  onStartOver: () => void;
}

const AnalysisResults = ({ data, userName, selectedSpeaker, analysisResults, onStartOver }: AnalysisResultsProps) => {
  const [selectedSegment, setSelectedSegment] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // 실제 분석 결과 사용 여부 결정
  const useRealData = analysisResults && analysisResults.segments && analysisResults.segments.length > 0;

  // Mock transcript with Korean examples for fallback
  const mockTranscript: TranscriptItem[] = [
    {
      speaker: userName || 'user',
      text: '안녕하세요, 저는 한국어를 배우고 있습니다.',
      errors: [
        { word: '한국어를', position: 3, suggestion: 'Pronunciation needs improvement' },
        { word: '배우고', position: 4, suggestion: 'Pronunciation needs improvement' }
      ]
    },
    {
      speaker: 'Speaker 1',
      text: '안녕하세요. 만나서 반갑습니다. 천천히 연습해보세요.',
      errors: []
    },
    {
      speaker: userName || 'user',
      text: '감사합니다. 도움을 주셔서 정말 고맙습니다.',
      errors: [
        { word: '감사합니다', position: 0, suggestion: 'Pronunciation needs improvement' }
      ]
    },
    {
      speaker: 'Speaker 2',
      text: '천천히 하세요! 계속 연습하시면 됩니다.',
      errors: []
    }
  ];

  // 실제 데이터 또는 Mock 데이터 사용
  let transcript: TranscriptItem[] = [];
  let stats = {
    segmentAccuracy: 85,
    perfectSegments: 2,
    totalErrors: 3,
    totalSegments: 4
  };

  if (useRealData) {
    console.log('📊 실제 분석 데이터 사용:', analysisResults);
    
    // API 세그먼트를 UI용 transcript로 변환
    transcript = analysisResults.segments.map(convertSegmentToTranscript);
    stats = analysisResults.stats;
    
    console.log('📋 변환된 transcript:', transcript);
    console.log('📈 통계 데이터:', stats);
  } else {
    console.log('⚠️ Mock 데이터 사용 (실제 분석 결과 없음)');
    transcript = data?.transcript && data.transcript.length > 0 ? data.transcript : mockTranscript;
  }

  // 오디오 URL 생성 및 정리
  useEffect(() => {
    if (data?.audioFile) {
      const url = URL.createObjectURL(data.audioFile);
      setAudioUrl(url);
      console.log('🎵 오디오 URL 생성:', url);
      
      return () => {
        URL.revokeObjectURL(url);
        console.log('🗑️ 오디오 URL 정리');
      };
    }
  }, [data?.audioFile]);

  // 오디오 재생 완료 시 상태 업데이트
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      console.log('🎵 오디오 재생 완료');
    };

    const handleError = (e: Event) => {
      setIsPlaying(false);
      console.error('❌ 오디오 재생 오류:', e);
      alert('오디오 재생 중 오류가 발생했습니다.');
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const handlePlayRecording = () => {
    if (!audioUrl) {
      console.log('⚠️ 재생할 오디오가 없습니다');
      alert('재생할 오디오가 없습니다. 다시 녹음해주세요.');
      return;
    }

    if (isPlaying) {
      // 재생 중지
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      console.log('⏹️ 오디오 재생 중지');
    } else {
      // 재생 시작
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            console.log('▶️ 오디오 재생 시작');
          })
          .catch((error) => {
            console.error('❌ 오디오 재생 실패:', error);
            alert('오디오 재생에 실패했습니다.');
          });
      }
    }
  };

  const getSpeakerStyle = (speaker: string) => {
    if (speaker === userName) {
      return 'bg-blue-50 border-l-blue-500';
    }
    
    if (speaker.startsWith('Speaker')) {
      const speakerNum = parseInt(speaker.split(' ')[1]) || 1;
      const styles = [
        'bg-green-50 border-l-green-500',
        'bg-purple-50 border-l-purple-500',
        'bg-orange-50 border-l-orange-500',
        'bg-pink-50 border-l-pink-500'
      ];
      return styles[(speakerNum - 1) % styles.length];
    }
    
    return 'bg-gray-50 border-l-gray-400';
  };

  const getSpeakerBadgeStyle = (speaker: string) => {
    if (speaker === userName) {
      return 'bg-blue-600 text-white font-semibold';
    }
    
    if (speaker.startsWith('Speaker')) {
      const speakerNum = parseInt(speaker.split(' ')[1]) || 1;
      const styles = [
        'bg-green-600 text-white font-medium',
        'bg-purple-600 text-white font-medium', 
        'bg-orange-600 text-white font-medium',
        'bg-pink-600 text-white font-medium'
      ];
      return styles[(speakerNum - 1) % styles.length];
    }
    
    return 'bg-gray-600 text-white font-medium';
  };

  const handleSegmentClick = (item: TranscriptItem, originalSegment?: LLMSegment) => {
    // 사용자 세그먼트이고, 에러가 있거나 원본 세그먼트에 마스킹된 텍스트([w])가 있는 경우
    const hasErrors = (item.errors && item.errors.length > 0) || 
                     (originalSegment && originalSegment.masked_text && originalSegment.masked_text.includes('[w]'));
    
    if (item.speaker === userName && hasErrors) {
      // 실제 API 데이터가 있으면 상세 정보와 함께 전달
      if (originalSegment) {
        setSelectedSegment({
          ...item,
          originalSegment: originalSegment
        });
      } else {
        setSelectedSegment(item);
      }
    }
  };

  const renderTextWithErrors = (item: TranscriptItem, originalSegment?: LLMSegment) => {
    if (item.speaker !== userName) {
      return item.text;
    }

    // 실제 API 데이터가 있는 경우 masked_text를 사용하여 렌더링
    if (originalSegment && originalSegment.masked_text && originalSegment.correct_text) {
      return renderTextWithMaskedErrors(originalSegment.correct_text, originalSegment.masked_text);
    }

    // 기존 fallback: errors 배열 사용
    if (!item.errors || item.errors.length === 0) {
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
            onClick={() => {
              // 실제 API 데이터에서 해당 세그먼트 찾기
              const originalSegment = useRealData ? 
                analysisResults?.segments.find(s => s.correct_text === item.text) : undefined;
              handleSegmentClick(item, originalSegment);
            }}
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

    // correct_text와 masked_text에서 실제 에러 단어 개수를 계산하는 함수
  const countErrorWordsFromMaskedText = (correctText: string, maskedText: string): number => {
    // maskedText를 분석하여 [w] 위치 파악
    let maskedParts = [];
    let tempMasked = maskedText;
    
    // [w] 패턴 전까지의 텍스트와 [w] 개수 추출
    while (tempMasked.length > 0) {
      const wIndex = tempMasked.indexOf('[w]');
      if (wIndex === -1) {
        maskedParts.push({ text: tempMasked, isError: false });
        break;
      }
      
      if (wIndex > 0) {
        maskedParts.push({ text: tempMasked.substring(0, wIndex), isError: false });
      }
      
      let errorCount = 0;
      let pos = wIndex;
      while (pos < tempMasked.length && tempMasked.substring(pos, pos + 3) === '[w]') {
        errorCount++;
        pos += 3;
      }
      
      maskedParts.push({ text: '', isError: true, errorCount });
      tempMasked = tempMasked.substring(pos);
    }
    
    // correctText를 분할하여 실제 에러 단어 개수 계산
    let correctPos = 0;
    let totalErrorWords = 0;
    
    for (let i = 0; i < maskedParts.length; i++) {
      const part = maskedParts[i];
      
      if (!part.isError) {
        const normalText = part.text;
        correctPos += normalText.length;
      } else {
        let errorText = '';
        
        let nextNormalText = '';
        if (i + 1 < maskedParts.length && !maskedParts[i + 1].isError) {
          nextNormalText = maskedParts[i + 1].text;
        }
        
        if (nextNormalText) {
          const nextPos = correctText.indexOf(nextNormalText, correctPos);
          if (nextPos !== -1) {
            errorText = correctText.substring(correctPos, nextPos);
            correctPos = nextPos;
          }
        } else {
          errorText = correctText.substring(correctPos);
          correctPos = correctText.length;
        }
        
        // 에러 텍스트에서 실제 단어 개수 계산 (공백으로 분리)
        if (errorText.trim()) {
          const errorWords = errorText.trim().split(/\s+/).filter(word => word.length > 0);
          totalErrorWords += errorWords.length;
        }
      }
    }
    
    return totalErrorWords;
  };

  // correct_text와 masked_text를 비교해서 [w] 마스킹된 부분만 스타일링하는 함수
  const renderTextWithMaskedErrors = (correctText: string, maskedText: string) => {
    console.log('🔍 텍스트 비교:', { correctText, maskedText });
    
    // 간단한 방법: maskedText에서 [w] 패턴 찾아서 해당하는 부분을 correctText에서 식별
    // 예: "네, 알겠습니다." vs "네, 알겠습[w][w]."
    
    // maskedText를 분석하여 [w] 위치 파악
    let maskedParts = [];
    let tempMasked = maskedText;
    let currentPos = 0;
    
    // [w] 패턴 전까지의 텍스트와 [w] 개수 추출
    while (tempMasked.length > 0) {
      const wIndex = tempMasked.indexOf('[w]');
      if (wIndex === -1) {
        // 더 이상 [w]가 없음
        maskedParts.push({ text: tempMasked, isError: false });
        break;
      }
      
      // [w] 이전 텍스트
      if (wIndex > 0) {
        maskedParts.push({ text: tempMasked.substring(0, wIndex), isError: false });
      }
      
      // 연속된 [w] 개수 세기
      let errorCount = 0;
      let pos = wIndex;
      while (pos < tempMasked.length && tempMasked.substring(pos, pos + 3) === '[w]') {
        errorCount++;
        pos += 3;
      }
      
      maskedParts.push({ text: '', isError: true, errorCount });
      tempMasked = tempMasked.substring(pos);
    }
    
    console.log('📝 마스킹 분석:', maskedParts);
    
    // correctText를 maskedParts에 맞춰 분할
    let result: React.ReactNode[] = [];
    let correctPos = 0;
    
    for (let i = 0; i < maskedParts.length; i++) {
      const part = maskedParts[i];
      
      if (!part.isError) {
        // 정상 텍스트 - 그대로 사용
        const normalText = part.text;
        result.push(<span key={i}>{normalText}</span>);
        correctPos += normalText.length;
      } else {
        // 에러 부분 - correctText에서 다음 정상 텍스트까지의 모든 문자를 에러로 처리
        let errorText = '';
        
        // 다음 정상 텍스트 찾기
        let nextNormalText = '';
        if (i + 1 < maskedParts.length && !maskedParts[i + 1].isError) {
          nextNormalText = maskedParts[i + 1].text;
        }
        
        if (nextNormalText) {
          // 다음 정상 텍스트가 나오는 위치까지의 모든 문자
          const nextPos = correctText.indexOf(nextNormalText, correctPos);
          if (nextPos !== -1) {
            errorText = correctText.substring(correctPos, nextPos);
            correctPos = nextPos;
          }
        } else {
          // 마지막 에러 부분 - 끝까지
          errorText = correctText.substring(correctPos);
          correctPos = correctText.length;
        }
        
        if (errorText) {
          result.push(
            <span
              key={i}
              className="error-word"
              onClick={(e) => e.stopPropagation()}
            >
              {errorText}
            </span>
          );
        }
      }
    }
    
    console.log('✅ 렌더링 결과:', result);
    return result;
  };

  // 사용자 세그먼트만 필터링하여 통계 계산
  const userSegments = transcript.filter(item => item.speaker === userName);
  const totalUserSegments = userSegments.length;
  
  // 실제 API 데이터가 있는 경우 더 정확한 계산
  let perfectUserSegments = 0;
  let totalUserErrors = 0;
  
  if (useRealData && analysisResults?.segments) {
    // 실제 API 세그먼트에서 사용자 세그먼트만 필터링
    const userApiSegments = analysisResults.segments.filter(segment => 
      segment.display_name === userName || segment.speaker_name === userName
    );
    
    for (const segment of userApiSegments) {
      // masked_text에 [w]가 없으면 완벽한 세그먼트
      const hasErrors = segment.masked_text && segment.masked_text.includes('[w]');
      if (!hasErrors) {
        perfectUserSegments++;
      } else {
        // 실제 에러 단어 개수 계산
        const errorCount = countErrorWordsFromMaskedText(segment.correct_text, segment.masked_text);
        totalUserErrors += errorCount;
      }
    }
  } else {
    // Mock 데이터 사용
    perfectUserSegments = userSegments.filter(item => !item.errors || item.errors.length === 0).length;
    totalUserErrors = userSegments.reduce((sum, item) => sum + (item.errors?.length || 0), 0);
  }
  
  const userSegmentAccuracy = totalUserSegments > 0 ? Math.round((perfectUserSegments / totalUserSegments) * 100) : 100;

  // 실제 API 통계가 있으면 계산된 값 사용, 없으면 fallback
  const displayStats = useRealData ? {
    segmentAccuracy: userSegmentAccuracy,
    perfectSegments: perfectUserSegments,
    totalErrors: totalUserErrors,
    totalSegments: totalUserSegments
  } : {
    segmentAccuracy: userSegmentAccuracy,
    perfectSegments: perfectUserSegments,
    totalErrors: totalUserErrors,
    totalSegments: totalUserSegments
  };
  
  // 디버깅용 로그
  console.log('📊 AnalysisResults 통계 디버깅:', {
    useRealData,
    userName,
    totalTranscriptItems: transcript.length,
    userSegmentsFromTranscript: userSegments.length,
    statsFromAPI: useRealData ? stats : null,
    displayStats,
    userSegments: userSegments.map(s => ({ speaker: s.speaker, text: s.text.substring(0, 20) }))
  });

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
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} style={{ display: 'none' }} />
      
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
              <div className="text-2xl font-semibold text-gray-900">{displayStats.segmentAccuracy}%</div>
              <div className="text-caption text-gray-600">Segment Accuracy</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">{displayStats.perfectSegments}/{displayStats.totalSegments}</div>
              <div className="text-caption text-gray-600">Perfect Segments</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-red-500">{displayStats.totalErrors}</div>
              <div className="text-caption text-gray-600">Total Errors</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
              <div className="text-2xl font-semibold text-gray-900">{displayStats.totalSegments}</div>
              <div className="text-caption text-gray-600">Your Segments</div>
            </div>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-body text-blue-800">
              💡 Click on any highlighted word with errors to see detailed pronunciation feedback and improvement tips.
            </p>
          </div>
        </div>

        {/* Conversation Transcript */}
        <div className="space-y-4">
          {transcript.map((item, index) => {
            // 실제 API 데이터에서 원본 세그먼트 찾기
            const originalSegment = useRealData ? 
              analysisResults?.segments.find(s => s.correct_text === item.text) : undefined;
            
            // 클릭 가능한 조건 (에러가 있거나 마스킹된 텍스트가 있는 경우)
            const hasErrors = (item.errors && item.errors.length > 0) || 
                             (originalSegment && originalSegment.masked_text && originalSegment.masked_text.includes('[w]'));
            
            return (
              <div
                key={index}
                className={`
                  premium-card p-6 border-l-4 transition-premium 
                  ${getSpeakerStyle(item.speaker)}
                  ${selectedSegment?.text === item.text ? 'segment-highlight' : ''}
                  ${item.speaker === userName && hasErrors ? 'cursor-pointer hover:shadow-premium-lg' : ''}
                `}
                onClick={() => handleSegmentClick(item, originalSegment)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    px-4 py-2 rounded-full text-sm font-medium min-w-fit
                    ${getSpeakerBadgeStyle(item.speaker)}
                  `}>
                    {item.speaker}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-body leading-relaxed text-gray-900">
                      {renderTextWithErrors(item, originalSegment)}
                    </p>
                    {(hasErrors) && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-gray-700 flex items-center font-medium">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          {originalSegment && originalSegment.masked_text ? 
                            (() => {
                              const errorCount = countErrorWordsFromMaskedText(originalSegment.correct_text, originalSegment.masked_text);
                              return `${errorCount} pronunciation ${errorCount === 1 ? 'error' : 'errors'} detected`;
                            })() :
                            `${item.errors?.length || 0} pronunciation ${(item.errors?.length || 0) === 1 ? 'error' : 'errors'} detected`}
                        </p>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Feedback Summary Panel */}
        {showAllFeedback && (
          <div className="premium-card p-6">
            <h3 className="text-subtitle font-semibold text-gray-900 mb-6">
              Complete Feedback Summary
            </h3>
            <div className="space-y-4">
              {userSegments
                .filter(item => {
                  const originalSegment = useRealData ? 
                    analysisResults?.segments.find(s => s.correct_text === item.text) : undefined;
                  return (item.errors && item.errors.length > 0) || 
                         (originalSegment && originalSegment.masked_text && originalSegment.masked_text.includes('[w]'));
                })
                .map((item, segmentIndex) => (
                  <div
                    key={segmentIndex}
                    className="premium-card p-4 cursor-pointer hover:shadow-premium transition-premium border border-gray-200"
                    onClick={() => {
                      const originalSegment = useRealData ? 
                        analysisResults?.segments.find(s => s.correct_text === item.text) : undefined;
                      setSelectedSegment({
                        ...item,
                        originalSegment: originalSegment
                      });
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-body font-semibold text-gray-900 mb-2">
                          "{item.text.substring(0, 50)}..."
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
