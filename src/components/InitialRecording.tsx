
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface InitialRecordingProps {
  onComplete: () => void;
}

const InitialRecording = ({ onComplete }: InitialRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecordingToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      console.log("음성 등록 녹음 시작");
      
      setTimeout(() => {
        setIsRecording(false);
        setIsProcessing(true);
        
        setTimeout(() => {
          setIsProcessing(false);
          onComplete();
        }, 1000);
      }, 3000);
    } else {
      setIsRecording(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        onComplete();
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-3xl font-medium text-gray-900">
          음성을 등록해 주세요
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          정확한 발음 분석을 위해 먼저 음성을 등록해주세요.
        </p>
        <p className="text-sm text-gray-600">
          "안녕하세요, 저는 한국어를 배우고 있습니다"라고 말해주세요.
        </p>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <button
            onClick={handleRecordingToggle}
            disabled={isProcessing}
            className={`
              relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border-2
              ${isRecording 
                ? 'bg-red-500 border-red-400 hover:bg-red-600 scale-110' 
                : isProcessing
                ? 'bg-purple-500 border-purple-400'
                : 'bg-blue-600 border-blue-400 hover:bg-blue-700 hover:scale-105'
              }
              ${isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
          
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping" />
          )}
        </div>

        <p className="text-base font-medium text-gray-900">
          {isProcessing 
            ? '처리 중...' 
            : isRecording 
            ? '녹음 중...' 
            : '버튼을 눌러 녹음을 시작하세요'
          }
        </p>

        {isRecording && (
          <Button 
            onClick={handleRecordingToggle}
            variant="outline"
            className="rounded-full px-6"
          >
            녹음 완료
          </Button>
        )}
      </div>
    </div>
  );
};

export default InitialRecording;
