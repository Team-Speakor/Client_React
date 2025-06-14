import { Loader2 } from "lucide-react";

interface ProcessingProps {
  message: string;
}

const Processing = ({ message }: ProcessingProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in text-center min-h-[50vh]">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
      <p className="text-body text-gray-700">
        {message}
      </p>
    </div>
  );
};

export default Processing; 