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
---
# 마지막 페이지 API 완료
Session


POST
/api/session/init
Init Session

Parameters
Cancel
Reset
No parameters

Request body

application/json
Edit Value
Schema
{
  "nickname": "AA",
  "participant_count": 2
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  ' /api/session/init' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "nickname": "AA",
  "participant_count": 2
}'
Request URL
 /api/session/init
Server response
Code	Details
200	
Response body
Download
{
  "message": "세션이 생성되었습니다.",
  "nickname": "AA",
  "participant_count": 2,
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}
Response headers
 access-control-allow-credentials: true 
 content-length: 136 
 content-type: application/json 
 date: Tue,17 Jun 2025 07:27:10 GMT 
 server: uvicorn 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
Audio


POST
/api/upload
Upload Audio

Parameters
Cancel
Reset
No parameters

Request body

multipart/form-data
session_id *
string
77818f6c-d1b4-40f0-91ec-166c252919fa
file *
string($binary)
TEST3_100.wav
Execute
Clear
Responses
Curl

curl -X 'POST' \
  ' /api/upload' \
  -H 'accept: application/json' \
  -H 'Content-Type: multipart/form-data' \
  -F 'session_id=77818f6c-d1b4-40f0-91ec-166c252919fa' \
  -F 'file=@TEST3_100.wav;type=audio/wav'
Request URL
 /api/upload
Server response
Code	Details
200	
Response body
Download
{
  "message": "오디오 업로드 및 변환 성공",
  "duration": 53.84
}
Response headers
 access-control-allow-credentials: true 
 content-length: 68 
 content-type: application/json 
 date: Tue,17 Jun 2025 07:27:31 GMT 
 server: uvicorn 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
Speaker


POST
/api/diarization
Diarize Audio

Parameters
Cancel
Reset
No parameters

Request body

application/json
Edit Value
Schema
{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  ' /api/diarization' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}'
Request URL
 /api/diarization
Server response
Code	Details
200	
Response body
Download
{
  "message": "Diarization completed. Proceed to speaker preview page."
}
Response headers
 access-control-allow-credentials: true 
 content-length: 69 
 content-type: application/json 
 date: Tue,17 Jun 2025 07:27:56 GMT 
 server: uvicorn 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/speaker/preview
Preview Speakers

Parameters
Cancel
Reset
No parameters

Request body

application/json
Edit Value
Schema
{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  ' /api/speaker/preview' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}'
Request URL
 /api/speaker/preview
Server response
Code	Details
200	
Response body
Download
{
  "count": 2,
  "previews": [
    {
      "speaker": "SPEAKER_00",
      "url": "/media/77818f6c-d1b4-40f0-91ec-166c252919fa/SPEAKER_00_001.wav"
    },
    {
      "speaker": "SPEAKER_01",
      "url": "/media/77818f6c-d1b4-40f0-91ec-166c252919fa/SPEAKER_01_001.wav"
    }
  ]
}
Response headers
 access-control-allow-credentials: true 
 content-length: 216 
 content-type: application/json 
 date: Tue,17 Jun 2025 07:28:10 GMT 
 server: uvicorn 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/speaker/select
Select Speaker

Parameters
Cancel
Reset
No parameters

Request body

application/json
Edit Value
Schema
{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa",
  "speaker": "SPEAKER_00"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  ' /api/speaker/select' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa",
  "speaker": "SPEAKER_00"
}'
Request URL
 /api/speaker/select
Server response
Code	Details
200	
Response body
Download
{
  "message": "SPEAKER_00 mapped to current user"
}
Response headers
 access-control-allow-credentials: true 
 content-length: 47 
 content-type: application/json 
 date: Tue,17 Jun 2025 07:28:39 GMT 
 server: uvicorn 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links
Inference


POST
/api/inference/stt
Stt Inference

Parameters
Cancel
Reset
No parameters

Request body

application/json
Edit Value
Schema
{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  ' /api/inference/stt' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}'
Request URL
 /api/inference/stt
Server response
Code	Details
200	
Response body
Download
{
  "message": "STT inference completed. Transcriptions saved to .json files."
}
Response headers
 access-control-allow-credentials: true 
 content-length: 75 
 content-type: application/json 
 date: Tue,17 Jun 2025 07:28:53 GMT 
 server: uvicorn 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}
No links

POST
/api/inference/llm
Llm Inference

Parameters
Cancel
Reset
No parameters

Request body

application/json
Edit Value
Schema
{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}
Execute
Clear
Responses
Curl

curl -X 'POST' \
  ' /api/inference/llm' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "session_id": "77818f6c-d1b4-40f0-91ec-166c252919fa"
}'
Request URL
 /api/inference/llm
Server response
Code	Details
200	
Response body
Download
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
    },
    {
      "segment_id": 2,
      "speaker_name": "SPEAKER_01",
      "correct_text": "음 맞대",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 3,
      "speaker_name": "SPEAKER_01",
      "correct_text": "",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 4,
      "speaker_name": "SPEAKER_00",
      "correct_text": "면",
      "masked_text": "[w]",
      "correct_ipa": "/miʌn/",
      "improvement_tips": "\"Pronounce 'm' with your lips gently closed at the start.\", \"Say 'yeon' with a glide sound between 'y' and 'eo' (like 'yuh').\", \"End the syllable softly without overemphasizing the 'n' sound.\"",
      "common_mistakes": "\"Pronouncing the initial consonant 'ㅁ' as 'y' instead of 'm'\", \"Substituting the vowel 'ㅕ' with 'ㅕ' pronounced as 'yeo' instead of the correct 'yeo' in context\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Correct initial consonant sound\", \"Precise vowel quality\"",
      "practice_tips": "\"Practice the pronunciation of the initial consonant 'ㅁ' by repeatedly saying minimal pairs like '면' vs '연'\", \"Use a mirror to watch your lip closure to ensure the 'm' sound is properly formed\", \"Record and compare your pronunciation with native speakers focusing on the nasal 'm' sound\""
    },
    {
      "segment_id": 5,
      "speaker_name": "SPEAKER_01",
      "correct_text": "음 왜?",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 6,
      "speaker_name": "SPEAKER_00",
      "correct_text": "야.",
      "masked_text": "[w].",
      "correct_ipa": "/ja/",
      "improvement_tips": "\"Pronounce 'ya' with a clear 'y' sound at the beginning.\", \"Make the 'a' sound like the 'a' in 'father', open and long.\", \"Avoid adding a hidden vowel sound after 'ya'; keep it short and sharp.\"",
      "common_mistakes": "\"Not pronouncing the final consonant '야' clearly, leading to an incomplete vowel sound\", \"Omitting the pitch rise typically present in the interjection '야'\"",
      "focus_areas": "\"Accurate vowel length\", \"Proper consonant release\", \"Intonation and pitch control\"",
      "practice_tips": "\"Practice the short and sharp 'ya' sound\", \"Emphasize the vowel length, keep it short\", \"Listen to native speakers to capture intonation\""
    },
    {
      "segment_id": 7,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음 냉장고.",
      "masked_text": "[w] [w][w][w].",
      "correct_ipa": "/ɯm/ /nɛŋ/ /ɾaŋɡo/",
      "improvement_tips": "\"Pronounce 'eum' with a short, tight 'eu' sound, like 'uh' but more closed.\", \"Make 'naeng' nasal and hold the 'ng' sound clearly at the end.\", \"Pronounce 'jang' with a clear 'j' sound and emphasize the 'a' as in 'father'.\"",
      "common_mistakes": "\"Skipping the initial vowel sound in '음'\", \"Omitting the final syllable '고' from the word\"",
      "focus_areas": "\"Complete syllable articulation\", \"Final consonant pronunciation\", \"Full word pronunciation\"",
      "practice_tips": "\"Practice pronouncing final consonants clearly\", \"Listen and repeat full words, not just parts\", \"Focus on vowel length and clarity in syllables\""
    },
    {
      "segment_id": 8,
      "speaker_name": "SPEAKER_00",
      "correct_text": "왜?",
      "masked_text": "[w]?",
      "correct_ipa": "/wɛ/",
      "improvement_tips": "\"Pronounce 'wae' like the English word 'way' with a clear 'w' sound.\", \"Make the vowel sound long and open, similar to 'ay' in 'play'.\", \"Avoid adding any extra sounds after the vowel; end crisply.\"",
      "common_mistakes": "\"Missing the glottal stop at the end of the sentence\", \"Pronouncing 'ㅐ' as a long 'a' sound instead of a diphthong\"",
      "focus_areas": "\"Accurate vowel length\", \"Glottal stop articulation\", \"Pitch and intonation control\"",
      "practice_tips": "\"Practice the vowel sound 'ㅐ' by repeating minimal pairs like '왜' and '와'\", \"Focus on the ending sound to ensure the question intonation is clear\", \"Listen to native speakers asking questions with '왜' to mimic natural rhythm\""
    },
    {
      "segment_id": 9,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음식?",
      "masked_text": "음식?",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 10,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음 없어요.",
      "masked_text": "[w] [w][w][w].",
      "correct_ipa": "/ɯm/ /ʌb.so.jo/",
      "improvement_tips": "\"Pronounce 'eum' with a clear 'eu' sound, like 'uh' but more rounded.\", \"Make the 'obs' in 'eob' sharp, stressing the 'b' sound.\", \"Say the ending 'seo' with a soft 's' and a clear 'o' vowel.\"",
      "common_mistakes": "\"Mispronouncing the vowel 'ㅡ' as 'oo' instead of the close back unrounded vowel\", \"Omitting the final consonant 'ㅂ' sound in '없어요', leading to a missing stop consonant\"",
      "focus_areas": "\"Accurate vowel length distinction\", \"Clear consonant articulation\", \"Proper intonation and pitch control\"",
      "practice_tips": "\"Practice pronouncing nasal sounds like '음' by listening to native speakers\", \"Focus on clearly differentiating '음' and '없어요' sounds to avoid blending\", \"Slow down your speech to ensure each syllable is articulated distinctly\""
    },
    {
      "segment_id": 11,
      "speaker_name": "SPEAKER_01",
      "correct_text": "하나도.",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 12,
      "speaker_name": "SPEAKER_00",
      "correct_text": "함부로 없어.",
      "masked_text": "[w][w][w] [w][w].",
      "correct_ipa": "/ham/ /puːɾo/ /ʌpʰsʰʌ/",
      "improvement_tips": "\"Pronounce the initial 'ham' with a strong 'ha' sound, like 'hahm'.\", \"Make the 'bu' sound short and sharp, similar to 'boo' but quicker.\", \"Soften the final 'eo' in 'eopseo' to sound like 'uh', and clearly pronounce the ending 'seo'.\"",
      "common_mistakes": "\"Mispronouncing the final consonant 'ㅁ' as '을' (inserting an extra vowel sound)\", \"Replacing '부' with '들' leading to incorrect syllable and consonant usage\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Proper vowel reduction\", \"Natural intonation patterns\"",
      "practice_tips": "\"Practice the pronunciation of vowel sounds 아 and 어 by listening to native speakers\", \"Break down the sentence into smaller parts and repeat each part slowly\", \"Focus on linking sounds smoothly between words to mimic natural Korean rhythm\""
    },
    {
      "segment_id": 13,
      "speaker_name": "SPEAKER_01",
      "correct_text": "아능장고 식이 하나도 없다.",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 14,
      "speaker_name": "SPEAKER_00",
      "correct_text": "내",
      "masked_text": "내",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 15,
      "speaker_name": "SPEAKER_01",
      "correct_text": "음 뭐 살 건데 뭐 살?",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 16,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음",
      "masked_text": "[w]",
      "correct_ipa": "/ɯm/",
      "improvement_tips": "\"Pronounce 'eu' as a short, tight vowel sound, similar to 'oo' in 'book' but more central.\", \"Make the 'm' sound by softly closing your lips and humming.\", \"Keep the sound smooth and avoid adding extra vowels before or after.\"",
      "common_mistakes": "\"Pronouncing a simple vowel sound as a complex consonant-vowel blend\", \"Replacing the unvoiced bilabial nasal '음' with voiced consonants '고리'\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Nasal sound production\", \"Correct vowel quality\"",
      "practice_tips": "\"Focus on differentiating vowel sounds\", \"Practice the 'ㅡ' vowel sound by holding it longer\", \"Listen to and mimic native pronunciations of simple syllables\""
    },
    {
      "segment_id": 17,
      "speaker_name": "SPEAKER_00",
      "correct_text": "야채?",
      "masked_text": "야[w]?",
      "correct_ipa": "/t͈ɕhɛ/",
      "improvement_tips": "\"Pronounce 'ya' with a clear 'yah' sound, similar to 'yacht'.\", \"Make the 'chae' sound like 'cheh', avoiding a long 'chay' diphthong.\", \"End with a soft 'e' sound, like the 'e' in 'bed'.\"",
      "common_mistakes": "\"Pronouncing final 'ㅔ' as 'ㅓ' sound\", \"Replacing final consonant 'ㅊ' with 'ㄹ' sound\"",
      "focus_areas": "\"Accurate final consonant articulation\", \"Distinction between similar consonants\", \"Proper vowel length and quality\"",
      "practice_tips": "\"Practice the difference between 'chae' and 'cheol' sounds by repeating minimal pairs\", \"Focus on the vowel sound 'ae' to avoid it sounding like 'eol'\", \"Listen to native speakers and mimic the intonation and pitch of the word '야채'\""
    },
    {
      "segment_id": 18,
      "speaker_name": "SPEAKER_00",
      "correct_text": "저기.",
      "masked_text": "[w]기.",
      "correct_ipa": "/ʨʌ/",
      "improvement_tips": "\"Pronounce 'jeo' with a soft 'j' sound, like 'j' in 'jug'.\", \"Make the vowel in 'geo' similar to the 'u' in 'cup', not 'ee' or 'ah'.\", \"End with a light 'gi' sound, ensuring the 'g' is soft, almost like a 'k'.\"",
      "common_mistakes": "\"Substituting the initial consonant 'ㅈ' with 'g' sound\", \"Mispronouncing the vowel 'ㅓ' as 'o' sound\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Differentiation of similar phonemes\", \"Proper vowel length and quality\"",
      "practice_tips": "\"Practice differentiating similar consonant sounds like 'ㅈ' and 'ㄱ'\", \"Slow down your pronunciation to hear subtle differences\", \"Listen and repeat native speakers saying short interjections\""
    },
    {
      "segment_id": 19,
      "speaker_name": "SPEAKER_00",
      "correct_text": "거기는.",
      "masked_text": "[w][w][w].",
      "correct_ipa": "/kʌ.ɡi.nɯn/",
      "improvement_tips": "\"Pronounce 'geo' like 'gaw' with a soft 'aw' sound.\", \"Make the 'gi' syllable clear with a hard 'g' as in 'go'.\", \"End with a soft 'neun' sound by lightly touching the tongue behind upper teeth.\"",
      "common_mistakes": "\"Replacing the final consonant 'ㄱ' with a 'k' sound plus an extra 'r' sound\", \"Adding an extra syllable '-랑' not present in the original word\"",
      "focus_areas": "\"Accurate consonant endings\", \"Distinction between similar consonants\", \"Proper vowel length and clarity\"",
      "practice_tips": "\"Practice pronouncing the final consonant 'ㄱ' clearly\", \"Contrast similar sounding syllables like '기' and '기' with different endings\", \"Listen and repeat native speakers focusing on vowel clarity\""
    },
    {
      "segment_id": 20,
      "speaker_name": "SPEAKER_00",
      "correct_text": "다음은 모델이 예측한 문장입니다.",
      "masked_text": "[w][w][w] [w][w][w] [w][w][w] [w][w][w][w][w].",
      "correct_ipa": "/ta̠k͈ɯm/ /ʝʌn/ /mo̞d̥ʌɭ/ /i/ /je̞t͈ɕʰikʰa̠n/ /munt͡ɕa̠n/ /ip͈ni̥da̠/",
      "improvement_tips": "\"Pronounce 'da-eum' by separating the syllables clearly without blending.\", \"Make the 'mo' in 'model' sharp and round like 'mo' in 'more'.\", \"Articulate the 'ye' in 'yegchihan' with a short, bright 'ye' sound, not 'yay'.\"",
      "common_mistakes": "\"Pronouncing 'ㅁ' in '모델이' as 'b' instead of 'm'\", \"Omitting the vowel sound in '예' leading to a clipped pronunciation\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Proper vowel length and distinction\", \"Intonation and sentence stress patterns\"",
      "practice_tips": "\"Practice linking syllables smoothly\", \"Emphasize the final consonants\", \"Use shadowing with native speakers' recordings\""
    },
    {
      "segment_id": 21,
      "speaker_name": "SPEAKER_00",
      "correct_text": "과이야.",
      "masked_text": "과[w][w].",
      "correct_ipa": "/ija/",
      "improvement_tips": "\"Pronounce 'gwa' by blending 'g' and 'w' sounds smoothly.\", \"Make the 'i' sound like the English long 'ee' in 'see'.\", \"End with a clear 'ya' sound, as in 'yacht', without softening.\"",
      "common_mistakes": "\"Mispronouncing the diphthong '과이' as the single syllable '과일' with an added 'l' sound\", \"Replacing the vowel '이' [i] with the vowel '일' [il], introducing an unintended consonant sound\"",
      "focus_areas": "\"Accurate vowel length distinction\", \"Final consonant pronunciation\", \"Precise syllable boundary recognition\"",
      "practice_tips": "\"Practice differentiating similar vowel sounds like ㅐ and ㅣ\", \"Use minimal pairs to hear and reproduce subtle differences\", \"Slow down your speech to focus on accurate vowel articulation\""
    },
    {
      "segment_id": 22,
      "speaker_name": "SPEAKER_01",
      "correct_text": "와인.",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 23,
      "speaker_name": "SPEAKER_00",
      "correct_text": "다음은 모델이 예측한 문장입니다.",
      "masked_text": "[w][w][w] [w][w][w] [w][w][w] [w][w][w][w][w].",
      "correct_ipa": "/ˈtaʊ.kʰɯm/ /ɯn/ /ˈmo.dʒʌɭ/ /i/ /jeːt͈sʰikʰan/ /ˈmʌn.dʒan.i.m.ni.da/",
      "improvement_tips": "\"Pronounce the initial 'da' in '다음' with a clear 'dah' sound.\", \"Make the 'mo' in '모델' sharp and crisp, similar to 'moh'.\", \"Articulate the final 'da' in '예측한' carefully, avoiding dropping the consonant.\"",
      "common_mistakes": "\"Pronouncing '모델이' as 'model-lee' with an elongated vowel instead of a quick 'l' sound\", \"Omitting the final consonant 'ㅂ' in '문장입니다' causing it to sound like '문장임니다'\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Proper vowel length and quality\", \"Correct intonation and stress patterns\"",
      "practice_tips": "\"Practice lip and tongue positioning for Korean consonants\", \"Listen to and mimic native speakers to capture intonation\", \"Break down sentences into smaller parts and repeat slowly\""
    },
    {
      "segment_id": 24,
      "speaker_name": "SPEAKER_01",
      "correct_text": "[unk]뭐가?",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 25,
      "speaker_name": "SPEAKER_00",
      "correct_text": "아니 비안하게 돼.",
      "masked_text": "아[w] [w][w][w][w] [w].",
      "correct_ipa": "/pi.an.hae.ge/ /twe/",
      "improvement_tips": "\"Pronounce 'ani' with a clear 'a' as in 'father'.\", \"Say 'bi' with a short 'i' sound, like in 'bit'.\", \"Make 'ha-ge' distinct by separating 'ha' and rolling the 'g' softly.\"",
      "common_mistakes": "\"Replacing the vowel '아니' with '아이', causing vowel elongation and diphthong confusion\", \"Omitting the final consonant sounds and syllables, leading to reduced clarity of '비안하게 돼'\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Proper vowel distinction\", \"Correct syllable structure\"",
      "practice_tips": "\"Practice the subtle vowel differences in '아니' and '비안하게'\", \"Listen to native speakers to capture the correct rhythm and intonation\", \"Break down the sentence into smaller parts and practice each slowly before combining\""
    },
    {
      "segment_id": 26,
      "speaker_name": "SPEAKER_01",
      "correct_text": "안.",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 27,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음, 혼자 시야.",
      "masked_text": "[w], [w][w] [w][w].",
      "correct_ipa": "/ɯm/ /hon.d͈ʑa/ /ɕija/",
      "improvement_tips": "\"Pronounce 'eum' with a clear 'eu' sound, like the 'u' in 'put'.\", \"Make the 'ho' syllable sharp and round your mouth slightly.\", \"In 'siya', pronounce 'si' as 'shee' and emphasize the 'ya' sound clearly.\"",
      "common_mistakes": "\"Replacing the initial vowel sound '으' with '여' which changes the original vowel quality\", \"Omitting the consonant sounds 'ㅁ', 'ㅎ', and final consonants leading to incomplete syllable pronunciation\"",
      "focus_areas": "\"Consonant articulation clarity\", \"Accurate vowel length and quality\", \"Proper syllable onset and coda pronunciation\"",
      "practice_tips": "\"Practice pronouncing the initial consonant 'ㅇ' sound clearly\", \"Slow down to distinguish vowel sounds accurately\", \"Listen and mimic native speakers focusing on similar words\""
    },
    {
      "segment_id": 28,
      "speaker_name": "SPEAKER_01",
      "correct_text": "",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 29,
      "speaker_name": "SPEAKER_00",
      "correct_text": "다음은 모델이 예측한 문장입니다:",
      "masked_text": "[w][w][w] [w][w][w] [w][w][w] [w][w][w][w][w]:",
      "correct_ipa": "/ta.uɡʌm/ /ɯn/ /mo.dɯ.li/ /i/ /je.tɕik/ /han/ /mʌn.dʑa.ni.m.ni.da/",
      "improvement_tips": "\"Pronounce 'sa' in 'sahang' with a sharp 's' sound, not 'sh'.\", \"Make the vowel in 'eo' (like in 'eom-su') sound like 'uh', not 'oh'.\", \"Softly tap the 'l' at the end of 'sahang-eul' to avoid a hard 'l' sound.\"",
      "common_mistakes": "\"Pronouncing '다음' as 'da-eum' without linking consonant blending\", \"Mispronouncing the final consonant 'ㅂ' in '입니다' as a voiced 'b' sound instead of unreleased 'p'\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Proper vowel length and clarity\", \"Smooth liaison and linking between words\"",
      "practice_tips": "\"Practice the rhythm and intonation of Korean sentences\", \"Focus on pronouncing batchim (final consonants) clearly\", \"Use shadowing technique with native Korean speakers\""
    },
    {
      "segment_id": 30,
      "speaker_name": "SPEAKER_01",
      "correct_text": "",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 31,
      "speaker_name": "SPEAKER_00",
      "correct_text": "다음은 모델이 예측한 문장입니다: [ERROR]",
      "masked_text": "[w][w][w] [w][w][w] [w][w][w] [w][w][w][w][w]: [[w][w][w][w][w]]",
      "correct_ipa": "/taɯŋ/ /ɯn/ /mo̞dɛɭi/ /i/ /jepʰikʰan/ /munʨan/ /iɭɯpsida/",
      "improvement_tips": "\"Pronounce 'dae' with a long 'a' sound, like 'day'.\", \"Make sure to clearly enunciate the 'um' as a soft 'oom'.\", \"Stress the 'nun' syllable softly, avoiding abrupt stops.\"",
      "common_mistakes": "\"Mispronouncing the vowel '으' as a more rounded vowel like 'oo' instead of the close unrounded vowel [ɯ]\", \"Failing to maintain the tense consonant 'ㅆ' sound, pronouncing it as a simple 's' instead\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Proper vowel length and quality\", \"Intonation and sentence rhythm\"",
      "practice_tips": "\"Practice the correct intonation and rhythm by listening to native speakers\", \"Break down difficult words into smaller syllables and repeat slowly\", \"Use tongue twisters that focus on similar sounds to improve articulation\""
    },
    {
      "segment_id": 32,
      "speaker_name": "SPEAKER_01",
      "correct_text": "",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 33,
      "speaker_name": "SPEAKER_00",
      "correct_text": "[ERROR]",
      "masked_text": "[ERROR]",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 34,
      "speaker_name": "SPEAKER_00",
      "correct_text": "다음은 모델이 예측한 문장입니다:",
      "masked_text": "[w][w][w] [w][w][w] [w][w][w] [w][w][w][w][w]:",
      "correct_ipa": "/ta.um/ /ɯn/ /mo.dʑel.i/ /je.pʰi.ɡan/ /mun.dʑan.i.mnida/",
      "improvement_tips": "\"Pronounce the initial syllable 'ae' in '아래' with a bright open 'a' sound, like 'ah'.\", \"Make the 's' in '사항' sharp and clear, avoiding a soft 'sh' sound.\", \"Articulate the final consonant 'ㅅ' in '엄수하세요' lightly, almost like a soft 't'.\"",
      "common_mistakes": "\"Replacing '다음' with '팔', indicating confusion of sounds instead of syllable approximation\", \"Omission of most syllables from the original sentence, showing difficulty in producing multisyllabic Korean phrases\"",
      "focus_areas": "\"Complete syllable articulation\", \"Accurate consonant pronunciation\", \"Proper vowel length and clarity\"",
      "practice_tips": "\"Practice pronouncing the ending consonants clearly\", \"Listen and repeat native speaker recordings focusing on sentence rhythm\", \"Break the sentence into smaller parts and practice each slowly before combining\""
    },
    {
      "segment_id": 35,
      "speaker_name": "SPEAKER_00",
      "correct_text": "맛있다.",
      "masked_text": "맛있[w].",
      "correct_ipa": "/ta/",
      "improvement_tips": "\"Pronounce the initial 'mat' with a sharp 't' sound, avoiding a soft 'd'.\", \"Make the vowel in 'mat' short and clear, like the 'a' in 'cat'.\", \"End with a quick, crisp 'da', where the 'd' is lightly tapped, similar to the 'd' in 'ladder'.\"",
      "common_mistakes": "\"Adding an extra syllable '-기' after the verb ending '-다'\", \"Mispronouncing the final consonant 'ㄷ' as a more voiced consonant 'ㄱ'\"",
      "focus_areas": "\"Accurate word-final consonant articulation\", \"Proper vowel length and reduction\", \"Correct syllable boundary recognition\"",
      "practice_tips": "\"Focus on final consonant endings\", \"Practice the 'tt' sound with minimal pairs\", \"Listen to native speaker pronunciation repeatedly\""
    },
    {
      "segment_id": 36,
      "speaker_name": "SPEAKER_00",
      "correct_text": "다음은 모델이 예측한 문장입니다:",
      "masked_text": "[w][w][w] [w][w][w] [w][w][w] [w][w][w][w][w]:",
      "correct_ipa": "/taːɯm/ /ɯn/ /mo̞dʒʌɾi/ /jeːpʃikʰan/ /munsaŋimnida/",
      "improvement_tips": "\"Pronounce 'dae' with a clear 'd' sound, avoiding a soft 't'.\", \"Stress the 'mul' syllable strongly, with a short 'u' like 'pull'.\", \"Make the 'han' in 'hanseong' crisp and nasalized, not overly soft.\"",
      "common_mistakes": "\"Not pronouncing the final consonant 'ㄴ' in '다음은' clearly\", \"Replacing the 'ㅅ' sound in '모델이' with an 's' sound instead of the softer 'sh' sound\"",
      "focus_areas": "\"Accurate vowel length and distinction\", \"Proper consonant batchim articulation\", \"Natural intonation and sentence rhythm\"",
      "practice_tips": "\"Practice the correct vowel lengths, especially differentiating between 어 and 아 sounds\", \"Work on the pronunciation of 받침, focusing on final consonants like ㄱ and ㅅ\", \"Listen to native speakers and mimic the intonation patterns of sentences\""
    },
    {
      "segment_id": 37,
      "speaker_name": "SPEAKER_00",
      "correct_text": "다음은 모델이 예측한 문장입니다: [ERROR]",
      "masked_text": "[w][w][w] [w][w][w] [w][w][w] [w][w][w][w][w]: [[w][w][w][w][w]]",
      "correct_ipa": "/taɯɡ/ /ɯn/ /moːdɛɾi/ /i/ /jɛt͈ɕʰiɡʌn/ /munsaɲiɾɯpsida/",
      "improvement_tips": "\"Pronounce 'da' with a soft 'd', similar to 'duh' but shorter.\", \"Make 'eum' sound like 'um' with a slight 'e' at the start.\", \"Soften 'neun' by blending 'eu' and 'n' smoothly without a hard stop.\"",
      "common_mistakes": "\"Failing to distinguish between the Korean vowel 'ㅡ' and the English vowel sounds\", \"Mispronouncing the consonant cluster in '모델이' by adding an extra vowel sound\"",
      "focus_areas": "\"Consonant cluster articulation\", \"Intonation and pitch control\", \"Accurate vowel length and quality\"",
      "practice_tips": "\"Listen carefully to native speakers pronouncing similar sentences\", \"Practice breaking down the sentence into smaller parts and repeat each slowly\", \"Focus on pronouncing 받침 (final consonants) clearly\""
    },
    {
      "segment_id": 38,
      "speaker_name": "SPEAKER_00",
      "correct_text": "비가 많나",
      "masked_text": "[w][w] [w][w]",
      "correct_ipa": "/piɡa/ /man.na/",
      "improvement_tips": "\"Pronounce the first syllable 'bi' with a short 'ee' sound, like 'bee' in English.\", \"Make 'ga' clear and sharp, avoiding a soft 'g' sound.\", \"Keep 'nan' nasal and pronounce the final 'na' softly, blending smoothly.\"",
      "common_mistakes": "\"Omits the initial syllable '비' completely\", \"Fails to pronounce the nasal consonant 'ㄴ' in '많나'\"",
      "focus_areas": "\"Complete syllable articulation\", \"Accurate consonant distinction\", \"Correct vowel length and quality\"",
      "practice_tips": "\"Practice differentiating similar consonant sounds like 'b' and 'm'\", \"Slow down and articulate the initial consonants clearly\", \"Use minimal pair exercises to hear and produce subtle sound differences\""
    },
    {
      "segment_id": 39,
      "speaker_name": "SPEAKER_00",
      "correct_text": "저 여기 왜 가?",
      "masked_text": "[w] [w][w] [w] [w]?",
      "correct_ipa": "/ʈ͡ʂʌ/ /jʌŋi/ /we/ /ka/",
      "improvement_tips": "\"Pronounce 'jeo' with a soft 'j' sound, almost like 'juh'.\", \"Say 'yeo' in 'yeogi' as a open 'aw' sound, similar to 'yaw'.\", \"Make the ending 'ga' sharp and short, avoiding a drawn-out vowel.\"",
      "common_mistakes": "\"Missing the initial consonant 'ㅈ' sound in '저'\", \"Replacing '가' with '뭐', leading to incorrect vocabulary and final consonant sound\"",
      "focus_areas": "\"Accurate consonant endings\", \"Correct particle pronunciation\", \"Distinct vowel articulation\"",
      "practice_tips": "\"Practice the correct particle sounds like '를' and '왜'\", \"Slow down to clearly differentiate each syllable\", \"Listen and repeat after native speakers focusing on sentence endings\""
    },
    {
      "segment_id": 40,
      "speaker_name": "SPEAKER_00",
      "correct_text": "제냐.",
      "masked_text": "제[w].",
      "correct_ipa": "/ɲa/",
      "improvement_tips": "\"Pronounce 'je' like 'jeh' with a soft 'j' sound.\", \"Say 'nya' as one smooth syllable, similar to 'nyah'.\", \"Make sure to blend 'n' and 'ya' sounds together without a pause.\"",
      "common_mistakes": "\"Replacing the final vowel '야' with '일'\", \"Confusing the palatal glide 'ㅇ' sound with a separate vowel sound\"",
      "focus_areas": "\"Accurate final consonant pronunciation\", \"Distinction between similar vowel sounds\", \"Precise consonant articulation\"",
      "practice_tips": "\"Practice the pronunciation of the 'ㅈ' consonant as a soft 'j' sound\", \"Focus on differentiating similar sounding syllables like '냐' and '일'\", \"Use slow and deliberate repetition of the target syllable '제냐'\""
    },
    {
      "segment_id": 41,
      "speaker_name": "SPEAKER_00",
      "correct_text": "어울림 머무야?",
      "masked_text": "[w][w][w] [w][w][w]?",
      "correct_ipa": "/ʌ.ul.lim/ /mʌ.mu.ja/",
      "improvement_tips": "\"Pronounce the vowel 'eo' in 'eo-ul' as a short 'uh' sound, not 'ee'.\", \"Clearly separate the syllables 'mul' and 'ya' to avoid blending them together.\", \"For 'ya', make sure to pronounce the 'y' sound strongly, like in 'yes'.\"",
      "common_mistakes": "\"Replacing the diphthong '어' with a monophthong '오'\", \"Omitting the syllables ‘울림’ and ‘머무야’ resulting in incomplete pronunciation\"",
      "focus_areas": "\"Complete syllable articulation\", \"Final consonant pronunciation\", \"Accurate vowel differentiation\"",
      "practice_tips": "\"Practice linking consonants and vowels smoothly\", \"Focus on differentiating vowel sounds like 'eo' and 'o'\", \"Listen and mimic native speakers' intonation patterns\""
    },
    {
      "segment_id": 42,
      "speaker_name": "SPEAKER_01",
      "correct_text": "저 영어 다른.",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 43,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음, 잘해.",
      "masked_text": "[w], [w][w].",
      "correct_ipa": "/ɯm/ /t͈ʰal/",
      "improvement_tips": "\"Pronounce the initial vowel 'eu' as a short 'uh' sound, not 'ee'.\", \"Make the 'j' in 'jal' sharp, like the 'j' in 'jungle'.\", \"End 'hae' with a clear 'e' sound, similar to 'hey' but shorter.\"",
      "common_mistakes": "\"Replacing the nasal consonant '음' with an unrelated sound '따이'\", \"Omitting the final consonant and vowel sounds, resulting in an incomplete pronunciation\"",
      "focus_areas": "\"Accurate consonant articulation\", \"Correct vowel length and quality\", \"Proper syllable stress and intonation\"",
      "practice_tips": "\"Practice the vowel sound 으 by rounding your lips slightly\", \"Focus on pronouncing the initial consonant ㅈ as a soft 'j' sound instead of 'tt'\", \"Listen and repeat after native speakers to capture the natural intonation\""
    },
    {
      "segment_id": 44,
      "speaker_name": "SPEAKER_01",
      "correct_text": "",
      "masked_text": "",
      "correct_ipa": "",
      "improvement_tips": "",
      "common_mistakes": "",
      "focus_areas": "",
      "practice_tips": ""
    },
    {
      "segment_id": 45,
      "speaker_name": "SPEAKER_00",
      "correct_text": "바람",
      "masked_text": "바[w]",
      "correct_ipa": "/ɾa̠ːm/",
      "improvement_tips": "\"Pronounce 'ba' with a clear 'ah' vowel, not 'uh'.\", \"Make the 'r' sound soft, similar to a quick flap between 'd' and 'l'.\", \"End with an 'm' sound, closing your lips gently but fully.\"",
      "common_mistakes": "\"Omits the final consonant 'ㄹ' sound in '람'\", \"Ends the word abruptly without the final syllable '람'\"",
      "focus_areas": "\"Complete syllable articulation\", \"Final consonant pronunciation\", \"Vowel length and clarity\"",
      "practice_tips": "\"Practice distinguishing final consonants\", \"Focus on pronouncing the full word\", \"Use minimal pairs to hear and produce differences\""
    },
    {
      "segment_id": 46,
      "speaker_name": "SPEAKER_00",
      "correct_text": "음, 아.",
      "masked_text": "[w], [w].",
      "correct_ipa": "/ɯm/ /a/",
      "improvement_tips": "\"Pronounce '음' with a closed 'eu' vowel, like the 'u' in 'put'.\", \"Make the final consonant 'm' in '음' nasal and soft.\", \"Say '아' with an open 'a' sound, like the 'a' in 'father'.\"",
      "common_mistakes": "\"Pronouncing final consonant 'ㅁ' as 'n' instead of 'm'\", \"Substituting vowel '아' with '알', adding extra consonant sound\"",
      "focus_areas": "\"Accurate vowel length distinction\", \"Proper consonant articulation\", \"Correct syllable closure\"",
      "practice_tips": "\"Practice the vowel sounds '으' and '아' separately\", \"Listen and mimic native speakers focusing on short interjections\", \"Use minimal pairs to differentiate similar sounding syllables\""
    }
  ]
}
Response headers
 access-control-allow-credentials: true 
 content-length: 30022 
 content-type: application/json 
 date: Tue,17 Jun 2025 07:29:26 GMT 
 server: uvicorn 
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string"
    }
  ]
}