import { Button } from "@/components/ui/button";
import { X, Lightbulb, BookOpen, Target } from "lucide-react";
import { createPortal } from "react-dom";

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

interface FeedbackPanelProps {
  segment: TranscriptItem;
  onClose: () => void;
}

const FeedbackPanel = ({ segment, onClose }: FeedbackPanelProps) => {
  const getDetailedFeedback = (word: string) => {
    const feedbackMap: { [key: string]: { ipa: string; tips: string[]; commonMistakes: string[] } } = {
      '한국어를': {
        ipa: '[han.ɡu.ɡʌ.ɾɯl]',
        tips: [
          'Emphasize the first syllable "han" clearly',
          'The "ɡu" sound should be crisp, not soft',
          'End with a clear "ɾɯl" with tongue tap'
        ],
        commonMistakes: [
          'Pronouncing "국" as "gook" instead of "guk"',
          'Missing the tongue tap in final "을"'
        ]
      },
      '배우고': {
        ipa: '[pɛ.u.ɡo]',
        tips: [
          'Start with clear "pɛ" sound (like "pay" but shorter)',
          'Separate "u" vowel distinctly',
          'End with soft "go" sound'
        ],
        commonMistakes: [
          'Merging "배" and "우" sounds together',
          'Pronouncing final "고" too harshly'
        ]
      },
      '감사합니다': {
        ipa: '[kam.sa.ham.ni.da]',
        tips: [
          'Each syllable should be equally stressed',
          'Clear "m" consonant in "감" and "함"',
          'Soft final "다" without strong "a" vowel'
        ],
        commonMistakes: [
          'Rushing through middle syllables',
          'Over-emphasizing final syllable'
        ]
      },
      '조언해주셔서': {
        ipa: '[t͡ʃo.ʌn.hɛ.d͡ʒu.ʃʌ.sʌ]',
        tips: [
          'Break into clear syllables: 조-언-해-주-셔-서',
          'Soft "ʃʌ" sound in "셔", not hard "sher"',
          'Maintain rhythm throughout the word'
        ],
        commonMistakes: [
          'Blending syllables together',
          'Incorrect "ʃ" sound pronunciation'
        ]
      }
    };

    return feedbackMap[word] || {
      ipa: `[${word}]`,
      tips: ['Practice this word slowly and clearly'],
      commonMistakes: ['Focus on clear articulation']
    };
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-premium-lg border border-gray-200 w-full max-w-4xl max-h-[90vh] overflow-hidden animate-slide-in-up">
        {/* Header */}
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

        {/* Scrollable Content */}
        <div className="overflow-y-auto scrollbar-hide p-6 pb-8 space-y-8" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* Error Analysis */}
          {segment.errors?.map((error, index) => {
            const feedback = getDetailedFeedback(error.word);
            
            return (
              <div key={index} className="premium-card p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-800 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-body font-semibold text-gray-900">
                      "{error.word}"
                    </h4>
                    <p className="text-caption text-gray-600 font-mono">
                      IPA: {feedback.ipa}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Improvement Tips */}
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-4 flex items-center">
                      <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                      Improvement Tips
                    </h5>
                    <ul className="space-y-3">
                      {feedback.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs font-medium">{tipIndex + 1}</span>
                          </div>
                          <span className="text-body text-gray-900">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Mistakes */}
                  <div>
                    <h5 className="text-body font-medium text-gray-900 mb-4 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-red-600" />
                      Common Mistakes
                    </h5>
                    <ul className="space-y-3">
                      {feedback.commonMistakes.map((mistake, mistakeIndex) => (
                        <li key={mistakeIndex} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2.5 flex-shrink-0"></div>
                          <span className="text-body text-gray-900">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Practice Section */}
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h5 className="text-body font-medium text-blue-800 mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Practice Exercise
                  </h5>
                  <p className="text-body text-blue-700 mb-4">
                    Repeat this word 5 times slowly, focusing on the IPA pronunciation guide. 
                    Record yourself to compare with the correct pronunciation.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-subtitle font-semibold text-gray-900">{error.word}</span>
                        <p className="text-caption text-gray-600 font-mono mt-1">{feedback.ipa}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Overall Guidance */}
          <div className="premium-card p-6 bg-gray-50">
            <h5 className="text-body font-medium text-gray-900 mb-4">
              Overall Pronunciation Guidance
            </h5>
            <div className="grid md:grid-cols-2 gap-4 text-body">
              <div>
                <h6 className="font-medium text-gray-900 mb-2">Focus Areas:</h6>
                <ul className="space-y-1 text-gray-700">
                  <li>• Clear syllable separation</li>
                  <li>• Consistent rhythm and timing</li>
                  <li>• Accurate vowel pronunciation</li>
                </ul>
              </div>
              <div>
                <h6 className="font-medium text-gray-900 mb-2">Practice Tips:</h6>
                <ul className="space-y-1 text-gray-700">
                  <li>• Practice with native audio</li>
                  <li>• Record yourself regularly</li>
                  <li>• Focus on one error at a time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FeedbackPanel;
