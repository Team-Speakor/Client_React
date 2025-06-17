import { Button } from "@/components/ui/button";
import { X, Lightbulb, BookOpen, Target } from "lucide-react";
import { createPortal } from "react-dom";
import { LLMSegment } from "@/utils/api";

interface Error {
  word: string;
  position: number;
  suggestion: string;
}

interface TranscriptItem {
  speaker: string;
  text: string;
  errors: Error[];
  originalSegment?: LLMSegment;
}

interface FeedbackPanelProps {
  segment: TranscriptItem;
  onClose: () => void;
}

const FeedbackPanel = ({ segment, onClose }: FeedbackPanelProps) => {
  const hasRealData = segment.originalSegment && 
                     (segment.originalSegment.improvement_tips &&
                      segment.originalSegment.improvement_tips.trim() !== "" &&
                      segment.originalSegment.improvement_tips !== "Tips are being prepared for you.") ||
                     (segment.originalSegment.masked_text && 
                      segment.originalSegment.masked_text.includes('[w]'));

  const parseApiTips = (tipsString: string): string[] => {
    if (!tipsString || tipsString.trim() === "") return [];
    
    const matches = tipsString.match(/"([^"]+)"/g);
    if (matches) {
      return matches.map(match => match.replace(/"/g, ''));
    }
    
    return tipsString.split(',').map(tip => tip.trim()).filter(tip => tip.length > 0);
  };

  const analyzeSegmentErrors = () => {
    if (hasRealData && segment.originalSegment) {
      const apiSegment = segment.originalSegment;
      
      return [{
        word: segment.text,
        ipa: apiSegment.correct_ipa || '',
        tips: parseApiTips(apiSegment.improvement_tips),
        commonMistakes: parseApiTips(apiSegment.common_mistakes),
        focusAreas: parseApiTips(apiSegment.focus_areas),
        practiceTips: parseApiTips(apiSegment.practice_tips)
      }];
    } else {
      return [];
    }
  };

  const errorAnalysis = analyzeSegmentErrors();

  if (!hasRealData || errorAnalysis.length === 0) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-premium-lg border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in-up">
        <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex-1">
            <h3 className="text-subtitle font-semibold text-gray-900 mb-2">
              Segment Analysis
            </h3>
            <p className="text-body text-gray-700 mb-3">
              "{segment.text}"
            </p>
            <div className="flex items-center space-x-2">
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-caption font-medium">
                {segment.errors?.length || 0} errors found
              </span>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg touch-target"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto scrollbar-hide p-6 pb-8 space-y-8" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {errorAnalysis.map((analysis, index) => (
            <div key={index} className="premium-card p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-body font-medium text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                    Improvement Tips
                  </h5>
                  {analysis.tips && analysis.tips.length > 0 ? (
                    <ul className="space-y-3">
                      {analysis.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs font-medium">{tipIndex + 1}</span>
                          </div>
                          <span className="text-body text-gray-900">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-body text-gray-600 italic">Tips are being prepared for you.</p>
                  )}
                </div>

                <div>
                  <h5 className="text-body font-medium text-gray-900 mb-4 flex items-center">
                    <Target className="w-4 h-4 mr-2 text-red-600" />
                    Common Mistakes
                  </h5>
                  {analysis.commonMistakes && analysis.commonMistakes.length > 0 ? (
                    <ul className="space-y-3">
                      {analysis.commonMistakes.map((mistake, mistakeIndex) => (
                        <li key={mistakeIndex} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <span className="text-body text-gray-900">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-body text-gray-600 italic">Common mistakes analysis is being prepared.</p>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                <h5 className="text-body font-medium text-blue-800 mb-4 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Overall Pronunciation Guidance
                </h5>
                <div className="grid md:grid-cols-2 gap-4 text-body">
                  <div>
                    <h6 className="font-medium text-blue-800 mb-2">Focus Areas:</h6>
                    {analysis.focusAreas && analysis.focusAreas.length > 0 ? (
                      <ul className="space-y-1 text-blue-700">
                        {analysis.focusAreas.map((area, areaIndex) => (
                          <li key={areaIndex}>• {area}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-blue-700 italic">Focus areas are being prepared.</p>
                    )}
                  </div>
                  <div>
                    <h6 className="font-medium text-blue-800 mb-2">Practice Tips:</h6>
                    {analysis.practiceTips && analysis.practiceTips.length > 0 ? (
                      <ul className="space-y-1 text-blue-700">
                        {analysis.practiceTips.map((tip, tipIndex) => (
                          <li key={tipIndex}>• {tip}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-blue-700 italic">Practice tips are being prepared.</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-blue-200 mt-4">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-subtitle font-semibold text-gray-900">{analysis.word}</span>
                      {analysis.ipa && (
                        <p className="text-caption text-gray-600 font-mono mt-1">{analysis.ipa}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FeedbackPanel;
