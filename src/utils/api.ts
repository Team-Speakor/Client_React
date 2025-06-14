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
    
    console.log('🌐 API 호출:', { url, payload, API_BASE_URL });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log('📡 API 응답:', { status: response.status, statusText: response.statusText });
    
    if (!response.ok) {
      throw new Error(`Session init failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    console.log('📦 API 결과:', result);
    return result;
  },

  // 파일 업로드
  uploadAudio: async (sessionId: string, file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('session_id', sessionId);
    formData.append('file', file);
    
    const url = `${API_BASE_URL}/api/upload`;
    console.log('📤 파일 업로드 API 호출:', { url, sessionId, fileName: file.name, fileSize: file.size, API_BASE_URL });
    
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    
    console.log('📡 파일 업로드 API 응답:', { status: response.status, statusText: response.statusText });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 파일 업로드 오류 상세:', errorText);
      throw new Error(`Upload failed: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('📦 파일 업로드 결과:', result);
    return result;
  },

  // 화자 분리
  diarizeAudio: async (sessionId: string): Promise<DiarizationResponse> => {
    const url = `${API_BASE_URL}/api/diarization`;
    const payload = { session_id: sessionId };
    
    console.log('🎭 화자 분리 API 호출:', { url, payload, API_BASE_URL });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    console.log('📡 화자 분리 API 응답:', { status: response.status, statusText: response.statusText });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ 화자 분리 오류 상세:', errorText);
      throw new Error(`Diarization failed: ${response.statusText} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('📦 화자 분리 결과:', result);
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

  // 음성 분석
  analyzeAudio: async (sessionId: string): Promise<InferenceResponse | null> => {
    const response = await fetch(`${API_BASE_URL}/api/inference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId })
    });
    
    if (!response.ok) {
      throw new Error(`Inference failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result; // null일 수 있음 (아직 구현 안됨)
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
  console.error('API Error:', error);
  
  if (error.detail) {
    // 422 Validation Error
    return `Validation Error: ${error.detail.map((d: any) => d.msg).join(', ')}`;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
}; 