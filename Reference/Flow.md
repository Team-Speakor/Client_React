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

#### 🔗 API 연동:
**음성 분석 및 결과 요청**
```http
POST /api/inference
Content-Type: application/json

{
  "session_id": "8174cf77-c3ea-4f40-845b-f91f9fcde421"
}
```

**현재 응답:**
```json
null
```

**⚠️ 현재 상태:** 
- API가 `null` 응답 반환 (아직 구현 미완료)
- 현재는 Mock 데이터로 결과 화면 표시

**예상 응답 구조 (구현 예정):**
```json
{
  "transcript": [
    {
      "speaker": "user",
      "text": "안녕하세요, 저는 한국어를 배우고 있습니다.",
      "errors": [
        {
          "word": "한국어를",
          "position": 2,
          "suggestion": "발음 개선 필요",
          "ipa": "[han.ɡu.ɡʌ.ɾɯl]",
          "confidence": 0.75
        }
      ]
    }
  ],
  "overall_score": 85,
  "total_errors": 3
}
```

#### 제공 기능:
1. **전체 통계**:
   - 세그먼트 정확도 (Segment Accuracy)
   - 완벽한 세그먼트 수 (Perfect Segments)
   - 총 오류 수 (Total Errors)
   - 총 세그먼트 수 (Total Segments)

2. **상호작용 버튼**:
   - **전체 녹음 재생**: "Play Recording" 버튼
   - **모든 피드백 보기**: "View All Feedback" 버튼
   - **처음부터 시작**: "Start Over" 버튼

3. **대화 내용 분석**:
   - 화자별 대화 내용 표시
   - 발음 오류 단어 하이라이트 (빨간색)
   - 오류 단어 클릭 시 상세 피드백 모달

#### 상세 피드백 모달:
- **개선 팁 (Improvement Tips)**
- **일반적인 실수 (Common Mistakes)**
- **연습 가이드 (Practice Exercise)**
- **IPA 발음 기호**

---

## 🔄 플로우 상태 관리 및 API 연동

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
                 → /api/speaker/select → results

results → /api/inference → 분석 결과 표시
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

### ⚠️ 부분 구현된 API:
| API | 상태 | 이슈 | 해결 방안 |
|-----|------|------|--------|
| `/api/speaker/preview` | ⚠️ 부분 | 음성 URL 접근 불가 | 백엔드 개발자와 URL prefix 확인 |

### ❌ 미구현된 API:
| API | 상태 | 현재 응답 | 예상 완료 |
|-----|------|-----------|----------|
| `/api/inference` | ❌ 미완료 | `null` | 백엔드 개발 진행 중 |

---

## 🛠 개발 우선순위 및 개선 계획

### **Phase 1: API 연동 완료** 🔄
1. ✅ ~~세션 관리 API 연동~~
2. ✅ ~~파일 업로드 API 연동~~
3. ✅ ~~화자 분리 API 연동~~
4. ⚠️ **화자 미리보기 음성 URL 수정** (백엔드 확인 필요)
5. ❌ **음성 분석 결과 API 구현 대기** (`/api/inference`)

### **Phase 2: UX 개선**
1. [ ] 실시간 API 상태 피드백
2. [ ] 오류 처리 및 재시도 로직
3. [ ] 로딩 상태 개선 (진행률 표시)
4. [ ] 네트워크 오류 처리

### **Phase 3: 고급 기능**
1. [ ] 실시간 음성 분석
2. [ ] 발음 점수 시각화
3. [ ] 학습 히스토리 관리
4. [ ] 세션 만료 처리

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

// 음성 분석 (구현 대기 중)
const analyzeAudio = async (sessionId: string) => {
  const response = await fetch('/api/inference', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId })
  });
  return response.json(); // 현재: null, 예상: 분석 결과 객체
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

2. **음성 분석 결과 미구현**
   - **문제**: `/api/inference`가 `null` 반환
   - **임시 해결**: Mock 데이터로 결과 화면 표시
   - **해결 방안**: 백엔드 구현 완료 대기

### 🟡 개선 필요:
1. **로딩 상태 관리**
   - 각 API 호출별 적절한 로딩 메시지
   - 진행률 표시 (가능한 경우)

2. **오류 복구**
   - 네트워크 오류 시 재시도 로직
   - 사용자 친화적 오류 메시지

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
**버전:** 2.0 (API 통합)
