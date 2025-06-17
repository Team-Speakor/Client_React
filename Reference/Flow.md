# Speakor 사용자 플로우 및 API 통합 문서

한국어 발음 분석 서비스 Speakor의 사용자 플로우와 API 연동 가이드입니다.

## 📋 서비스 개요

**서비스명:** Speakor - Korean Pronunciation Analysis  
**목적:** 한국어 대화 음성을 분석하여 발음 개선 피드백 제공  
**대상:** 한국어 학습자 및 발음 개선을 원하는 사용자  
**API Base URL:** 

---

## 🎯 사용자 목표 (User Goals)

1. **Primary Goal**: 한국어 발음 정확도 분석 및 개선점 파악
2. **Secondary Goals**: 
   - 실시간 녹음 또는 파일 업로드를 통한 편리한 분석
   - 개인별 맞춤 발음 피드백 제공
   - 화자별 구분을 통한 정확한 분석

---

## 🚀 전체 사용자 플로우 및 API 연동 (Complete User Flow with API Integration)

### 📍 **페이지 1: 사용자 정보 입력 및 녹음 방식 선택**
**상태:** `'input'` (Index.tsx)  
**컴포넌트:** `AudioInput.tsx`

#### 🔗 API 연동:
**1단계: 세션 초기화**
```http
POST /api/session/init
Content-Type: application/json

{
  "nickname": "사용자닉네임",
  "participant_count": 2
}
```

**응답:**
```json
{
  "message": "세션이 생성되었습니다.",
  "nickname": "사용자닉네임",
  "participant_count": 2,
  "session_id": "8174cf77-c3ea-4f40-845b-f91f9fcde421"
}
```

#### 사용자 액션:
1. **이름 입력** - 사용자 닉네임 입력
2. **참여자 수 설정** - 대화 참여자 수 선택 (1-10명)
3. **세션 생성** - `/api/session/init` 호출하여 `session_id` 획득
4. **녹음 방식 선택**:
   - **실시간 녹음**: "Start Recording" 버튼 클릭 → 페이지 1-A로 이동
   - **파일 업로드**: 오디오 파일 선택 → 바로 업로드 API 호출

**2단계: 오디오 업로드 (파일 선택 시)**
```http
POST /api/upload
Content-Type: multipart/form-data

session_id: "8174cf77-c3ea-4f40-845b-f91f9fcde421"
file: [오디오파일.wav]
```

**응답:**
```json
{
  "message": "오디오 업로드 및 변환 성공",
  "saved_path": "/app/tmp_audio/8174cf77-c3ea-4f40-845b-f91f9fcde421/converted.wav",
  "duration": 79.7574375
}
```

#### 🔄 다음 단계 분기:
```
세션 생성 → 녹음 방식 선택
├─ 실시간 녹음 → 페이지 1-A (RecordingInterface)
└─ 파일 업로드 → 업로드 완료 후 페이지 2 (Processing Audio)
```

---

### 📍 **페이지 1-A: 실시간 녹음**
**상태:** `'recording'` (Index.tsx)  
**컴포넌트:** `RecordingInterface.tsx`

#### 🔗 API 연동:
**녹음 완료 후 업로드**
```http
POST /api/upload
Content-Type: multipart/form-data

session_id: "8174cf77-c3ea-4f40-845b-f91f9fcde421"
file: [녹음된파일.wav]
```

#### 사용자 액션:
1. **녹음 시작**: 큰 녹음 버튼 클릭
2. **녹음 진행**: 실시간 녹음 상태 표시 (타이머, 음성 감지 표시)
3. **녹음 종료**: "Stop Recording" 버튼 클릭
4. **자동 업로드**: 녹음 완료 시 .wav 형태로 자동 업로드
5. **뒤로가기**: Back 버튼으로 페이지 1로 복귀 가능

#### 🔄 다음 단계:
```
녹음 완료 → 자동 업로드 → 페이지 2 (Processing Audio)
```

---

### 📍 **페이지 2: 오디오 처리 및 화자 분리 (로딩)**
**상태:** `'processing'` (Index.tsx)  
**컴포넌트:** `Processing.tsx`

#### 🔗 API 연동:
**화자 분리 요청**
```http
POST /api/diarization
Content-Type: application/json

{
  "session_id": "8174cf77-c3ea-4f40-845b-f91f9fcde421"
}
```

**응답:**
```json
{
  "message": "Diarization completed. Proceed to speaker preview page."
}
```

#### 처리 과정:
1. **오디오 업로드 완료** 확인
2. **화자 분리 시작** - `/api/diarization` 호출
3. **로딩 스피너 표시** - "화자 분리 중..." 메시지
4. **완료 응답 대기** - 응답이 올 때까지 폴링 또는 대기
5. **자동 페이지 전환** - 완료 시 페이지 3으로 이동

#### 🔄 다음 단계:
```
화자 분리 완료 → 페이지 3 (Speaker Selection)
```

---

### 📍 **페이지 3: 화자 선택**
**상태:** `'speaker-selection'` (Index.tsx)  
**컴포넌트:** `SpeakerSelection.tsx`

#### 🔗 API 연동:
**1단계: 화자 미리보기 요청**
```http
POST /api/speaker/preview
Content-Type: application/json

{
  "session_id": "8174cf77-c3ea-4f40-845b-f91f9fcde421"
}
```

**응답:**
```json
{
  "count": 2,
  "previews": [
    {
      "speaker": "SPEAKER_00",
      "url": "/media/8174cf77-c3ea-4f40-845b-f91f9fcde421/SPEAKER_00_001.wav"
    },
    {
      "speaker": "SPEAKER_01", 
      "url": "/media/8174cf77-c3ea-4f40-845b-f91f9fcde421/SPEAKER_01_001.wav"
    }
  ]
}
```

**⚠️ 현재 이슈:** 
- 음성 파일 URL의 완전한 경로가 불명확 (prefix 확인 필요)
- 현재 `{"detail":"Not Found"}` 응답으로 음성 재생 불가
- 백엔드 개발자 확인 예정

**2단계: 화자 선택**
```http
POST /api/speaker/select
Content-Type: application/json

{
  "session_id": "8174cf77-c3ea-4f40-845b-f91f9fcde421",
  "speaker": "SPEAKER_00"
}
```

**응답:**
```json
{
  "message": "SPEAKER_00 mapped to current user"
}
```

#### 사용자 액션:
1. **화자 목록 확인**: API에서 받은 화자 수만큼 표시
2. **음성 샘플 재생**: 각 화자별 "Play" 버튼 (현재 작동 안함)
3. **본인 음성 선택**: 라디오 버튼으로 본인 화자 선택
4. **계속 진행**: "Continue to Results" 버튼 클릭 → `/api/speaker/select` 호출

#### 🔄 다음 단계:
```
화자 선택 완료 → 페이지 4 (Analysis Results)
```

---

### 📍 **페이지 4: 분석 결과**
**상태:** `'results'` (Index.tsx)  
**컴포넌트:** `AnalysisResults.tsx`

#### 🔗 API 연동 순서:
**1단계: STT (Speech-to-Text) 분석**
```http
POST /api/inference/stt
Content-Type: application/json

{
  "session_id": "8174cf77-c3ea-4f40-845b-f91f9fcde421"
}
```

**응답:**
```json
{
  "message": "STT inference completed. Transcriptions saved to .json files."
}
```

**2단계: LLM 기반 발음 분석**
```http
POST /api/inference/llm
Content-Type: application/json

{
  "session_id": "8174cf77-c3ea-4f40-845b-f91f9fcde421"
}
```

**응답 구조:**
```json
{
  "message": "LLM inference completed.",
  "final_response": [
    {
      "segment_id": 1,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음, 우리 마트 갈까?",
      "masked_text": "[w], [w][w] [w][w] [w][w]?",
      "correct_ipa": "/ɯm/ /uɾi/ /maɾtɯ/ /kal.k͈a/",
      "improvement_tips": "\"Pronounce 'um' with a short, relaxed 'uh' sound.\", \"Make 'u' in 'uri' sound like 'oo' in 'food'.\", \"Soften 'gal' in 'gal-kkah' but emphasize the final 'k' sound crisply.\"",
      "common_mistakes": "\"Replacing the final vowel sound in '마트' with a short 'a' sound, making it sound like '맛'\", \"Omitting the final consonant 'ㄲ' in '갈까' and replacing it with 'ㄹ' sound\"",
      "focus_areas": "\"Proper consonant articulation\", \"Correct vowel length and quality\", \"Accurate final consonant pronunciation\"",
      "practice_tips": "\"Focus on distinguishing vowel sounds like ㅡ (eu) and ㅏ (a)\", \"Practice the ㄹ (r/l) and ㄹ 받침 sounds by repeating minimal pairs\", \"Listen and mimic native speakers asking questions intonation\""
    }
    // ... 더 많은 세그먼트들
  ]
}
```

#### 🎯 **핵심 구현 로직:**

**A. 화자 이름 매핑:**
- `/api/session/init`에서 받은 `nickname` = 사용자가 입력한 이름
- `/api/speaker/select`에서 선택한 `speaker` (예: "SPEAKER_00") = 사용자의 음성
- `final_response`에서 `speaker_name`이 선택한 speaker와 동일하면 → 사용자 이름으로 표시
- 다른 speaker들은 "Speaker 1", "Speaker 2" 등으로 표시

**B. 데이터 처리 순서:**
1. **화자 선택 완료 후 → STT 호출**
2. **STT 완료 응답 받으면 → LLM 호출**
3. **LLM 응답 받으면 → 결과 페이지 표시**

**C. 로딩 상태 관리:**
- 화자 선택 → "음성을 텍스트로 변환 중..." (STT 진행)
- STT 완료 → "발음 분석 중..." (LLM 진행) 
- LLM 완료 → 결과 표시

#### 📊 **결과 페이지 데이터 구성:**

**1. 전체 통계 계산:**
```typescript
// 통계 계산 로직 (코드 구현 시 참고)
const calculateStats = (segments: Segment[]) => {
  const totalSegments = segments.length;
  const segmentsWithErrors = segments.filter(s => s.masked_text.includes('[w]')).length;
  const perfectSegments = totalSegments - segmentsWithErrors;
  const totalErrors = segments.reduce((acc, s) => {
    return acc + (s.masked_text.match(/\[w\]/g) || []).length;
  }, 0);
  
  const segmentAccuracy = Math.round((perfectSegments / totalSegments) * 100);
  
  return {
    segmentAccuracy,
    perfectSegments,
    totalErrors,
    totalSegments
  };
};
```

**2. 화자별 대화 표시:**
- `segment_id` 순서대로 대화 내용 표시
- `speaker_name`을 사용자 이름 또는 "Speaker X"로 변환
- `correct_text`를 기본 텍스트로 표시
- `masked_text`에서 `[w]` 있는 단어는 빨간색으로 하이라이트

**3. 상세 피드백 모달:**
- 오류 단어 클릭 시 해당 세그먼트의 상세 정보 표시:
  - `improvement_tips`
  - `common_mistakes`  
  - `focus_areas`
  - `practice_tips`
  - `correct_ipa`

#### ⚠️ **데이터 품질 이슈 및 처리 방안:**

**A. 현재 알려진 이슈:**
- 일부 세그먼트에서 빈 값들 (`""`) 존재
- `[ERROR]` 태그가 포함된 세그먼트 존재
- `[unk]` 태그가 일부 텍스트에 포함

**B. 데이터 정제 로직:**
```typescript
// 구현 시 참고할 데이터 정제 로직
const cleanSegmentData = (segments: Segment[]) => {
  return segments.filter(segment => {
    // 빈 데이터나 ERROR가 있는 세그먼트 제외
    return segment.correct_text && 
           segment.correct_text !== "[ERROR]" && 
           segment.correct_text.trim() !== "";
  }).map(segment => ({
    ...segment,
    // [unk] 태그 제거
    correct_text: segment.correct_text.replace(/\[unk\]/g, ''),
    // 빈 필드들에 기본값 설정
    improvement_tips: segment.improvement_tips || "개선 팁이 준비 중입니다.",
    common_mistakes: segment.common_mistakes || "일반적인 실수 분석이 준비 중입니다.",
    focus_areas: segment.focus_areas || "집중 학습 영역이 준비 중입니다.",
    practice_tips: segment.practice_tips || "연습 방법이 준비 중입니다."
  }));
};
```

#### 🔄 **API 호출 플로우 상세:**

```
화자 선택 페이지 완료
    ↓
setAppState('processing') + "음성을 텍스트로 변환 중..."
    ↓
POST /api/inference/stt
    ↓ (성공 응답 대기)
"발음 분석 중..." 메시지 변경
    ↓
POST /api/inference/llm  
    ↓ (성공 응답 대기)
final_response 데이터 파싱
    ↓
setAppState('results') + 결과 데이터 표시
```

#### 🎨 **UI 업데이트 전략:**

**현재 디자인 유지하면서 데이터만 채우기:**
1. **통계 카드들**: 계산된 stats로 숫자 업데이트
2. **대화 목록**: segments 데이터로 채우기
3. **오류 하이라이트**: masked_text 기반으로 빨간색 처리
4. **모달 내용**: 클릭한 세그먼트의 상세 정보 표시

**로딩 상태 처리:**
- STT 진행 중: 스피너 + "음성을 텍스트로 변환 중..."
- LLM 진행 중: 스피너 + "AI가 발음을 분석 중..."
- 완료: 결과 페이지 표시

#### 📋 **구현 체크리스트:**

**Phase 1: API 연동**
- [ ] 화자 선택 후 STT API 호출
- [ ] STT 완료 후 LLM API 호출  
- [ ] 로딩 상태 관리 (processing 상태에서 메시지 변경)

**Phase 2: 데이터 처리**
- [ ] 화자 이름 매핑 로직 (session nickname ↔ selected speaker)
- [ ] 통계 계산 함수
- [ ] 데이터 정제 및 필터링

**Phase 3: UI 업데이트**
- [ ] 통계 카드 데이터 바인딩
- [ ] 대화 목록 렌더링 
- [ ] 오류 단어 하이라이트
- [ ] 상세 피드백 모달 연동

#### 🚨 **에러 처리 계획:**

**API 오류 시:**
- STT 실패: "음성 변환에 실패했습니다. 다시 시도해주세요."
- LLM 실패: "분석에 실패했습니다. 다시 시도해주세요."  
- 네트워크 오류: "네트워크 연결을 확인해주세요."

**데이터 오류 시:**
- 빈 응답: "분석 결과를 불러올 수 없습니다."
- 형식 오류: "데이터 형식에 문제가 있습니다."

#### 📈 **성능 최적화:**

**대용량 세그먼트 처리:**
- 세그먼트가 많을 경우 가상화(virtualization) 고려
- 상세 모달은 필요시에만 데이터 로드
- 오류가 있는 세그먼트만 먼저 표시하는 필터 옵션

**메모리 관리:**
- 큰 audio 파일들은 결과 페이지에서 해제
- 이전 세션 데이터 정리

---

## 🔄 업데이트된 전체 플로우 상태 관리 및 API 연동

### 현재 구현된 상태들:
```typescript
type AppState = 'input' | 'recording' | 'processing' | 'speaker-selection' | 'results';
```

### 상태 전환 및 API 호출:
```
input → /api/session/init → session_id 획득
  ├─ recording → /api/upload (녹음 파일) → processing
  └─ /api/upload (업로드 파일) → processing

processing → /api/diarization → speaker-selection

speaker-selection → /api/speaker/preview → 화자 목록 표시
                 → /api/speaker/select → processing (STT/LLM)

processing (STT/LLM) → /api/inference/stt → STT 완료
                    → /api/inference/llm → LLM 완료 → results

results → 분석 결과 표시
        → "Start Over" → input (새 세션)
```

---

## 📊 API 응답 상태 및 구현 현황

### ✅ 완전 구현된 API:
| API | 상태 | 응답 형태 | 비고 |
|-----|------|-----------|------|
| `/api/session/init` | ✅ 완료 | JSON 객체 | 세션 ID 정상 반환 |
| `/api/upload` | ✅ 완료 | JSON 객체 | 파일 업로드 및 변환 성공 |
| `/api/diarization` | ✅ 완료 | JSON 객체 | 화자 분리 완료 메시지 |
| `/api/speaker/select` | ✅ 완료 | JSON 객체 | 화자 선택 성공 |
| `/api/inference/stt` | ✅ 완료 | JSON 객체 | STT 변환 완료 메시지 |
| `/api/inference/llm` | ✅ 완료 | JSON 객체 | 상세 발음 분석 결과 반환 |

### ⚠️ 부분 구현된 API:
| API | 상태 | 이슈 | 해결 방안 |
|-----|------|------|--------|
| `/api/speaker/preview` | ⚠️ 부분 | 음성 URL 접근 불가 | 백엔드 개발자와 URL prefix 확인 |

### ❌ 더 이상 사용하지 않는 API:
| API | 상태 | 변경 사항 | 대체 API |
|-----|------|-----------|----------|
| `/api/inference` | ❌ 사용중지 | STT와 LLM으로 분리 | `/api/inference/stt` + `/api/inference/llm` |

---

## 🛠 개발 우선순위 및 개선 계획

### **Phase 1: 마지막 페이지 구현** 🚀
1. ✅ ~~세션 관리 API 연동~~
2. ✅ ~~파일 업로드 API 연동~~
3. ✅ ~~화자 분리 API 연동~~
4. ✅ ~~화자 선택 API 연동~~
5. ✅ ~~STT 및 LLM API 연동 준비~~
6. [ ] **STT → LLM 순차 호출 로직 구현**
7. [ ] **화자 이름 매핑 로직 구현**
8. [ ] **통계 계산 및 데이터 정제 구현**
9. [ ] **결과 페이지 데이터 바인딩 구현**

### **Phase 2: 데이터 품질 개선**
1. [ ] 빈 세그먼트 필터링
2. [ ] ERROR 태그 처리
3. [ ] [unk] 태그 정제
4. [ ] 기본값 설정 로직
5. ⚠️ **화자 미리보기 음성 URL 수정** (백엔드 확인 필요)

### **Phase 3: UX 개선**
1. [ ] 로딩 상태 메시지 세분화 (STT/LLM 구분)
2. [ ] 오류 처리 및 재시도 로직
3. [ ] 네트워크 오류 처리
4. [ ] 상세 피드백 모달 UX 개선

### **Phase 4: 고급 기능**
1. [ ] 발음 점수 시각화
2. [ ] 학습 히스토리 관리
3. [ ] 세션 만료 처리
4. [ ] 오류 세그먼트 우선 표시 필터

---

## 🔧 기술적 구현 세부사항

### API 호출 패턴:
```typescript
// 세션 초기화
const initSession = async (nickname: string, participantCount: number) => {
  const response = await fetch('/api/session/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, participant_count: participantCount })
  });
  return response.json(); // { session_id, message, nickname, participant_count }
};

// 파일 업로드
const uploadAudio = async (sessionId: string, file: File) => {
  const formData = new FormData();
  formData.append('session_id', sessionId);
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  return response.json(); // { message, saved_path, duration }
};

// 화자 분리
const diarizeAudio = async (sessionId: string) => {
  const response = await fetch('/api/diarization', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  return response.json(); // { message }
};

// 화자 미리보기
const previewSpeakers = async (sessionId: string) => {
  const response = await fetch('/api/speaker/preview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  return response.json(); // { count, previews: [{ speaker, url }] }
};

// 화자 선택
const selectSpeaker = async (sessionId: string, speaker: string) => {
  const response = await fetch('/api/speaker/select', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, speaker })
  });
  return response.json(); // { message }
};

// STT 음성 인식
const performSTT = async (sessionId: string) => {
  const response = await fetch('/api/inference/stt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  return response.json(); // { message: "STT inference completed..." }
};

// LLM 발음 분석
const performLLMAnalysis = async (sessionId: string) => {
  const response = await fetch('/api/inference/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  return response.json(); // { message, final_response: [...] }
};

// 전체 분석 플로우
const runFullAnalysis = async (sessionId: string, selectedSpeaker: string, userNickname: string) => {
  try {
    // 1. STT 실행
    const sttResult = await performSTT(sessionId);
    console.log('STT 완료:', sttResult.message);
    
    // 2. LLM 실행
    const llmResult = await performLLMAnalysis(sessionId);
    
    // 3. 데이터 정제 및 화자 매핑
    const cleanedSegments = cleanSegmentData(llmResult.final_response);
    const mappedSegments = mapSpeakerNames(cleanedSegments, selectedSpeaker, userNickname);
    
    return {
      segments: mappedSegments,
      stats: calculateStats(mappedSegments)
    };
  } catch (error) {
    throw new Error(`분석 실패: ${error.message}`);
  }
};

// 화자 이름 매핑 함수
const mapSpeakerNames = (segments: Segment[], selectedSpeaker: string, userNickname: string) => {
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

// 오류 단어 추출 함수
const extractErrorWords = (correctText: string, maskedText: string) => {
  const correctWords = correctText.split(' ');
  const maskedWords = maskedText.split(' ');
  const errorWords = [];
  
  for (let i = 0; i < Math.min(correctWords.length, maskedWords.length); i++) {
    if (maskedWords[i].includes('[w]')) {
      errorWords.push({
        index: i,
        word: correctWords[i],
        position: i
      });
    }
  }
  
  return errorWords;
};

// 진행률 계산 함수
const calculateProgress = (currentStep: 'stt' | 'llm') => {
  const steps = {
    stt: 50,   // STT 완료 시 50%
    llm: 100   // LLM 완료 시 100%
  };
  return steps[currentStep];
};
```

### 오류 처리:
```typescript
const handleApiError = (error: any) => {
  if (error.detail) {
    // 422 Validation Error
    console.error('Validation Error:', error.detail);
  } else {
    // 기타 오류
    console.error('API Error:', error);
  }
};
```

---

## 📋 현재 알려진 이슈 및 해결 방안

### 🔴 긴급 이슈:
1. **화자 미리보기 음성 재생 불가**
   - **문제**: URL prefix 불명확으로 404 오류
   - **임시 해결**: 음성 재생 버튼 비활성화
   - **해결 방안**: 백엔드 개발자와 올바른 URL 형식 확인

### 🟡 데이터 품질 개선 필요:
1. **LLM 응답 데이터 정제**
   - 빈 필드들 (`""`) 처리
   - `[ERROR]` 세그먼트 필터링
   - `[unk]` 태그 제거
   - 기본 메시지 설정

2. **화자 매핑 로직 구현**
   - session nickname ↔ selected speaker 연결
   - 다른 화자들을 "Speaker 1", "Speaker 2"로 표시

3. **통계 계산 로직 구현**
   - masked_text의 [w] 개수 기반 오류 계산
   - 세그먼트 정확도 계산

### 🟡 UX 개선 필요:
1. **로딩 상태 세분화**
   - STT 진행 중: "음성을 텍스트로 변환 중..."
   - LLM 진행 중: "AI가 발음을 분석 중..."
   - 진행률 표시 (50% → 100%)

2. **오류 처리 강화**
   - API 호출 실패 시 재시도 로직
   - 네트워크 오류 대응
   - 사용자 친화적 오류 메시지

3. **결과 페이지 최적화**
   - 대화 내용 하이라이트 (오류 단어 빨간색)
   - 상세 피드백 모달 연동
   - 통계 카드 데이터 바인딩

---

## 📊 성능 지표 (KPIs)

### API 성능 지표:
- **세션 초기화**: ~200ms
- **파일 업로드**: 파일 크기에 따라 가변
- **화자 분리**: ~10-30초 (오디오 길이에 따라)
- **음성 분석**: 구현 후 측정 예정

### 사용자 경험 지표:
- **완료율**: 전체 플로우 완료한 사용자 비율
- **이탈률**: 각 단계별 사용자 이탈률
- **재사용률**: 서비스 재사용 사용자 비율

---

**마지막 업데이트:** 2024-12-19  
**작성자:** AI Assistant  
**버전:** 3.0 (마지막 페이지 구현 계획 완료)

## 📋 **구현 우선순위 요약**

**🎯 즉시 구현 필요:**
1. **STT → LLM 순차 호출** (화자 선택 후)
2. **화자 이름 매핑** (선택된 speaker = 사용자 이름)
3. **데이터 정제 및 필터링** (빈 값, ERROR, unk 태그)
4. **통계 계산** (오류 개수, 정확도)
5. **결과 페이지 데이터 바인딩** (디자인 유지하면서 내용만 채우기)

**🔄 API 호출 순서:**
```
화자선택완료 → STT API → LLM API → 데이터처리 → 결과표시
```

**📊 핵심 로직:**
- `session_id` 전체 플로우에서 유지
- `nickname` (사용자 입력) = `selected_speaker` 이름으로 표시
- `masked_text`의 `[w]` 개수로 오류 통계 계산
- 빈 데이터 필터링 및 기본값 설정
