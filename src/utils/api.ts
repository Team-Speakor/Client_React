// API Base URL - 개발 환경에서는 프록시 사용, 프로덕션에서는 .env에서 가져옴
const API_BASE_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_BASE_URL;

// API 응답 타입 정의
export interface SessionInitResponse {
  message: string;
  nickname: string;
  participant_count: number;
  session_id: string;
}

export interface UploadResponse {
  message: string;
  saved_path: string;
  duration: number;
}

export interface DiarizationResponse {
  message: string;
}

export interface SpeakerPreview {
  speaker: string;
  url: string;
}

export interface SpeakerPreviewResponse {
  count: number;
  previews: SpeakerPreview[];
}

export interface SpeakerSelectResponse {
  message: string;
}

// STT 응답 타입
export interface STTResponse {
  message: string;
}

// LLM 응답 타입 - API.md의 실제 응답 구조 기반
export interface LLMSegment {
  segment_id: number;
  speaker_name: string;
  correct_text: string;
  masked_text: string;
  correct_ipa: string;
  improvement_tips: string;
  common_mistakes: string;
  focus_areas: string;
  practice_tips: string;
}

export interface LLMResponse {
  message: string;
  final_response: LLMSegment[];
}

export interface InferenceResponse {
  transcript?: Array<{
    speaker: string;
    text: string;
    errors?: Array<{
      word: string;
      position: number;
      suggestion: string;
      ipa?: string;
      confidence?: number;
    }>;
  }>;
  overall_score?: number;
  total_errors?: number;
}

// API 호출 함수들
export const api = {
  // 세션 초기화
  initSession: async (nickname: string, participantCount: number): Promise<SessionInitResponse> => {
    const url = `${API_BASE_URL}/api/session/init`;
    const payload = { nickname, participant_count: participantCount };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Session init failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  },

  // 파일 업로드
  uploadAudio: async (sessionId: string, file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('file', file);
    
    const url = `${API_BASE_URL}/api/upload`;
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  },

  // 화자 분리
  diarizeAudio: async (sessionId: string): Promise<DiarizationResponse> => {
    const url = `${API_BASE_URL}/api/diarization`;
    const payload = { session_id: sessionId };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Diarization failed: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  },

  // 화자 미리보기
  previewSpeakers: async (sessionId: string): Promise<SpeakerPreviewResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/speaker/preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId })
    });
    
    if (!response.ok) {
      throw new Error(`Speaker preview failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  // 화자 선택
  selectSpeaker: async (sessionId: string, speaker: string): Promise<SpeakerSelectResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/speaker/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, speaker })
    });
    
    if (!response.ok) {
      throw new Error(`Speaker selection failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  // STT 음성 인식
  performSTT: async (sessionId: string): Promise<STTResponse> => {
    const url = `${API_BASE_URL}/api/inference/stt`;
    const payload = { session_id: sessionId };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`STT failed: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  },

  // LLM 발음 분석
  performLLMAnalysis: async (sessionId: string): Promise<LLMResponse> => {
    const url = `${API_BASE_URL}/api/inference/llm`;
    const payload = { session_id: sessionId };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM analysis failed: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  },

  // 음성 분석 (기존 - 제거)
  analyzeAudio: async (sessionId: string): Promise<InferenceResponse | null> => {
    return null;
  },

  // 화자 음성 파일 URL 생성 (현재 이슈 있음)
  getSpeakerAudioUrl: (url: string): string => {
    // URL이 상대경로인 경우 base URL 추가
    if (url.startsWith('/')) {
      return `${API_BASE_URL}${url}`;
    }
    return url;
  }
};

// 오류 처리 유틸리티
export const handleApiError = (error: any) => {
  if (error.detail) {
    // 422 Validation Error
    return `Validation Error: ${error.detail.map((d: any) => d.msg).join(', ')}`;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};

// ===========================================
// 데이터 처리 유틸리티 함수들 (Flow.md 기반)
// ===========================================

// 화자 이름 매핑 함수
export const mapSpeakerNames = (segments: LLMSegment[], selectedSpeaker: string, userNickname: string) => {
  const speakerMap = new Map();
  let speakerCounter = 1;
  
  return segments.map(segment => {
    let displayName = segment.speaker_name;
    
    if (segment.speaker_name === selectedSpeaker) {
      // 선택한 화자는 사용자 이름으로 표시
      displayName = userNickname;
    } else {
      // 다른 화자들은 "Speaker 1", "Speaker 2" 등으로 표시
      if (!speakerMap.has(segment.speaker_name)) {
        speakerMap.set(segment.speaker_name, `Speaker ${speakerCounter}`);
        speakerCounter++;
      }
      displayName = speakerMap.get(segment.speaker_name);
    }
    
    return {
      ...segment,
      display_name: displayName
    };
  });
};

// 데이터 정제 함수
export const cleanSegmentData = (segments: LLMSegment[]) => {
  return segments.filter(segment => {
    // 빈 데이터나 ERROR가 있는 세그먼트 제외
    return segment.correct_text && 
           segment.correct_text !== "[ERROR]" && 
           segment.correct_text.trim() !== "";
  }).map(segment => ({
    ...segment,
    // [unk] 태그 제거
    correct_text: segment.correct_text.replace(/\[unk\]/g, ''),
    // Set default values for empty fields
    improvement_tips: segment.improvement_tips || "Tips are being prepared for you.",
    common_mistakes: segment.common_mistakes || "Common mistakes analysis is being prepared.",
    focus_areas: segment.focus_areas || "Focus areas are being prepared.",
    practice_tips: segment.practice_tips || "Practice methods are being prepared."
  }));
};

// 통계 계산 함수 - 선택한 화자(사용자)의 세그먼트만 계산
export const calculateStats = (segments: (LLMSegment & { display_name?: string })[], selectedSpeaker: string, userNickname: string) => {
  // 매핑된 세그먼트에서 사용자 닉네임(display_name)이 사용자와 일치하는 세그먼트만 필터링
  const userSegments = segments.filter(s => s.display_name === userNickname);
  
  const totalSegments = userSegments.length;
  const segmentsWithErrors = userSegments.filter(s => s.masked_text && s.masked_text.includes('[w]')).length;
  const perfectSegments = totalSegments - segmentsWithErrors;
  const totalErrors = userSegments.reduce((acc, s) => {
    return acc + (s.masked_text ? (s.masked_text.match(/\[w\]/g) || []).length : 0);
  }, 0);
  
  const segmentAccuracy = totalSegments > 0 ? Math.round((perfectSegments / totalSegments) * 100) : 100;
  
  return {
    segmentAccuracy,
    perfectSegments,
    totalErrors,
    totalSegments
  };
};

// 오류 단어 추출 함수
export const extractErrorWords = (correctText: string, maskedText: string) => {
  if (!correctText || !maskedText) return [];
  
  const correctWords = correctText.split(' ');
  const maskedWords = maskedText.split(' ');
  const errorWords = [];
  
  for (let i = 0; i < Math.min(correctWords.length, maskedWords.length); i++) {
    if (maskedWords[i] && maskedWords[i].includes('[w]')) {
      errorWords.push({
        index: i,
        word: correctWords[i],
        position: i
      });
    }
  }
  
  return errorWords;
};

// 전체 분석 플로우 함수
export const runFullAnalysis = async (
  sessionId: string, 
  selectedSpeaker: string, 
  userNickname: string,
  onProgressUpdate?: (step: 'stt' | 'llm', message: string) => void
) => {
  try {
    if (onProgressUpdate) {
      onProgressUpdate('stt', 'Converting audio to text...');
    }
    const sttResult = await api.performSTT(sessionId);
    
    if (onProgressUpdate) {
      onProgressUpdate('llm', 'AI is analyzing pronunciation...');
    }
    const llmResult = await api.performLLMAnalysis(sessionId);
    
    const cleanedSegments = cleanSegmentData(llmResult.final_response);
    const mappedSegments = mapSpeakerNames(cleanedSegments, selectedSpeaker, userNickname);
    const stats = calculateStats(mappedSegments, selectedSpeaker, userNickname);
    
    return {
      segments: mappedSegments,
      stats: stats,
      originalData: {
        sttResult,
        llmResult
      }
    };
  } catch (error) {
    throw new Error(`Analysis failed: ${error.message}`);
  }
}; 