# Speakor API Documentation

한국어 발음 분석 서비스 Speakor의 API 문서입니다.

## Base URL
```

```

## Authentication
현재 인증이 필요하지 않음

---

## 📝 Session Management

### Initialize Session
새로운 분석 세션을 시작합니다.

**Endpoint:** `POST /api/session/init`

**Request Body:**
```json
{
  "nickname": "뉴트리아",
  "participant_count": 3
}
```

**Parameters:**
- `nickname` (string): 사용자 닉네임
- `participant_count` (integer): 참여자 수

**Response:**
```json
"2f8b4e5c-42b6-4a4d-bf67-f29dd2e1092a"
```

**HTTP Status Codes:**
- `200`: 성공적으로 세션이 생성됨
- `422`: 유효성 검사 오류

---

## 🎵 Audio Management

### Upload Audio
분석할 오디오 파일을 업로드합니다.

**Endpoint:** `POST /api/upload`

**Content-Type:** `multipart/form-data`

**Form Parameters:**
- `session_id` (string, required): 세션 ID
- `file` (binary, required): 오디오 파일

**Response:**
```json
"string"
```

**HTTP Status Codes:**
- `200`: 성공적으로 파일이 업로드됨
- `422`: 유효성 검사 오류

**지원 파일 형식:**
- MP3
- WAV
- M4A

---

## 🎤 Speech-to-Text (STT)

### Inference
업로드된 오디오에 대해 음성 인식을 수행합니다.

**Endpoint:** `POST /api/inference`

**Request Body:**
```json
{
  "session_id": "2f8b4e5c-42b6-4a4d-bf67-f29dd2e1092a"
}
```

**Parameters:**
- `session_id` (string): 세션 ID

**Response:**
```json
"string"
```

**HTTP Status Codes:**
- `200`: 성공적으로 음성 인식이 완료됨
- `422`: 유효성 검사 오류

---

## 👥 Speaker Management

### Diarize Audio
화자 분리(Speaker Diarization)를 수행합니다.

**Endpoint:** `POST /api/diarization`

**Request Body:**
```json
{
  "session_id": "2f8b4e5c-42b6-4a4d-bf67-f29dd2e1092a"
}
```

**Parameters:**
- `session_id` (string): 세션 ID

**Response:**
```json
"string"
```

**HTTP Status Codes:**
- `200`: 성공적으로 화자 분리가 완료됨
- `422`: 유효성 검사 오류

### Preview Speakers
분리된 화자들의 미리보기를 제공합니다.

**Endpoint:** `POST /api/speaker/preview`

**Request Body:**
```json
{
  "session_id": "2f8b4e5c-42b6-4a4d-bf67-f29dd2e1092a"
}
```

**Parameters:**
- `session_id` (string): 세션 ID

**Response:**
```json
"string"
```

**HTTP Status Codes:**
- `200`: 성공적으로 화자 미리보기를 반환
- `422`: 유효성 검사 오류

### Select Speaker
분석할 화자를 선택합니다.

**Endpoint:** `POST /api/speaker/select`

**Request Body:**
```json
{
  "session_id": "2f8b4e5c-42b6-4a4d-bf67-f29dd2e1092a",
  "speaker": "SPEAKER_00"
}
```

**Parameters:**
- `session_id` (string): 세션 ID
- `speaker` (string): 선택할 화자 ID (예: "SPEAKER_00", "SPEAKER_01")

**Response:**
```json
"string"
```

**HTTP Status Codes:**
- `200`: 성공적으로 화자가 선택됨
- `422`: 유효성 검사 오류

---

## 🔍 Error Handling

모든 API 엔드포인트에서 발생할 수 있는 공통 오류 응답입니다.

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["string", 0],
      "msg": "string",
      "type": "string"
    }
  ]
}
```

**필드 설명:**
- `loc`: 오류가 발생한 필드의 위치
- `msg`: 오류 메시지
- `type`: 오류 타입

---

## 📋 API Flow

일반적인 API 사용 흐름은 다음과 같습니다:

1. **세션 초기화**: `POST /api/session/init`
   - 사용자 정보와 참여자 수를 제공
   - 세션 ID 반환

2. **오디오 업로드**: `POST /api/upload`
   - 분석할 오디오 파일 업로드
   - 세션 ID와 함께 파일 전송

3. **화자 분리**: `POST /api/diarization`
   - 업로드된 오디오에서 화자들을 분리

4. **화자 미리보기**: `POST /api/speaker/preview`
   - 분리된 화자들의 정보 확인

5. **화자 선택**: `POST /api/speaker/select`
   - 분석할 특정 화자 선택

6. **음성 인식**: `POST /api/inference`
   - 선택된 화자의 음성에 대해 STT 수행

---

## 📝 Notes

- 현재 모든 응답이 단순 문자열로 반환되고 있습니다. 실제 구현에서는 더 구조화된 JSON 응답이 제공될 것으로 예상됩니다.
- Health check 엔드포인트가 언급되었지만 상세 정보가 제공되지 않았습니다.
- 파일 크기 제한, 세션 만료 시간 등의 제약사항에 대한 정보가 필요할 수 있습니다.

---

## 🚀 SDK & Examples

추후 JavaScript/TypeScript, Python 등의 SDK와 사용 예제가 제공될 예정입니다.
