# Speakor Design Guide
## ChatGPT & Apple 디자인 시스템 적용 가이드

---

## 🎨 1. 색상 시스템 (Color System)

### 주요 브랜드 색상
```css
/* Primary Colors - ChatGPT Inspired */
--primary-green: #74AA9C;          /* ChatGPT 메인 그린 */
--primary-blue: #007AFF;           /* Apple iOS 블루 */
--primary-purple: #AB68FF;         /* ChatGPT Pro 퍼플 (프리미엄 기능용) */

/* Neutral Colors - Apple System */
--gray-900: #1C1C1E;              /* 메인 텍스트 - 강한 대비 */
--gray-800: #2C2C2E;              /* 보조 텍스트 */
--gray-700: #3A3A3C;              /* 본문 텍스트 */
--gray-600: #48484A;              /* 비활성 텍스트 */
--gray-500: #8E8E93;              /* 플레이스홀더 텍스트 */
--gray-400: #AEAEB2;              /* 보조 요소 */
--gray-300: #C7C7CC;              /* 경계선 */
--gray-200: #D1D1D6;              /* 입력 필드 테두리 */
--gray-100: #E5E5EA;              /* 배경 분리선 */
--gray-50: #F2F2F7;               /* 카드 배경 */
--white: #FFFFFF;                 /* 메인 배경 */

/* Semantic Colors */
--success: #34C759;               /* 성공 상태 - Apple 그린 */
--warning: #FF9F0A;               /* 경고 상태 - Apple 오렌지 */
--error: #FF3B30;                 /* 오류 상태 - Apple 레드 */
--info: #5AC8FA;                  /* 정보 상태 - Apple 라이트 블루 */
```

### 색상 사용 원칙
1. **텍스트 가독성**: 배경과 텍스트 간 최소 4.5:1 대비율 유지
2. **계층 구조**: 색상으로 정보의 중요도 구분
3. **브랜딩**: 주요 액션에만 브랜드 색상 사용

---

## 📝 2. 타이포그래피 (Typography)

### 폰트 시스템
```css
/* Font Family - Apple 시스템 폰트 우선 */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 
             'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
```

### 텍스트 계층 구조
```css
/* Display Text - 메인 제목 */
.text-display {
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: var(--gray-900);
}

/* Title - 섹션 제목 */
.text-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.3px;
  color: var(--gray-900);
}

/* Subtitle - 부제목 */
.text-subtitle {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--gray-800);
}

/* Body - 본문 */
.text-body {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: var(--gray-700);
}

/* Caption - 설명글 */
.text-caption {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Label - 라벨 */
.text-label {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--gray-600);
}
```

### 타이포그래피 원칙
1. **가독성**: 최소 16px 이상의 본문 크기
2. **줄 간격**: 1.4-1.6 배 줄 간격으로 편안한 읽기
3. **글자 간격**: 큰 제목은 음수 값으로 타이트하게

---

## 🔘 3. 버튼 시스템 (Button System)

### Primary Button (주요 액션)
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-blue) 0%, #0056D6 100%);
  color: var(--white);
  border: none;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  min-height: 48px;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Secondary Button (보조 액션)
```css
.btn-secondary {
  background: var(--gray-50);
  color: var(--gray-900);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  min-height: 48px;
  transition: all 0.15s ease;
}

.btn-secondary:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
}
```

### Ghost Button (텍스트 버튼)
```css
.btn-ghost {
  background: transparent;
  color: var(--primary-blue);
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

.btn-ghost:hover {
  background: rgba(0, 122, 255, 0.08);
}
```

---

## 📋 4. 입력 필드 (Input Fields)

### Text Input
```css
.input-field {
  background: var(--white);
  border: 1.5px solid var(--gray-200);
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 400;
  color: var(--gray-900);
  min-height: 48px;
  transition: all 0.2s ease;
}

.input-field:focus {
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
  outline: none;
}

.input-field::placeholder {
  color: var(--gray-500);
  font-weight: 400;
}
```

### File Upload Area
```css
.upload-area {
  background: var(--white);
  border: 2px dashed var(--gray-300);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--primary-blue);
  background: rgba(0, 122, 255, 0.02);
}

.upload-area.active {
  border-color: var(--primary-green);
  background: rgba(116, 170, 156, 0.05);
}
```

---

## 🎴 5. 카드 시스템 (Card System)

### Standard Card
```css
.card {
  background: var(--white);
  border: 1px solid var(--gray-100);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
```

### Interactive Card (Speaker Selection)
```css
.speaker-card {
  background: var(--white);
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.speaker-card:hover {
  border-color: var(--primary-blue);
  box-shadow: 0 4px 16px rgba(0, 122, 255, 0.1);
}

.speaker-card.selected {
  border-color: var(--primary-green);
  background: rgba(116, 170, 156, 0.05);
  box-shadow: 0 4px 16px rgba(116, 170, 156, 0.2);
}
```

---

## 🎯 6. 상태 표시 (Status Indicators)

### Success State
```css
.status-success {
  background: rgba(52, 199, 89, 0.1);
  color: var(--success);
  border: 1px solid rgba(52, 199, 89, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
}
```

### Error State
```css
.status-error {
  background: rgba(255, 59, 48, 0.1);
  color: var(--error);
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
}
```

### Processing State
```css
.status-processing {
  background: rgba(171, 104, 255, 0.1);
  color: var(--primary-purple);
  border: 1px solid rgba(171, 104, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
}
```

---

## 📱 7. 반응형 디자인 (Responsive Design)

### 모바일 최적화
```css
/* Mobile First Approach */
@media (max-width: 768px) {
  .container {
    padding: 16px;
    max-width: 100%;
  }
  
  .text-display {
    font-size: 28px;
  }
  
  .btn-primary {
    width: 100%;
    margin-bottom: 12px;
  }
  
  .input-field {
    font-size: 16px; /* iOS 줌 방지 */
  }
}
```

---

## 🎨 8. 애니메이션 & 인터랙션

### Smooth Transitions
```css
/* Easing Functions */
:root {
  --ease-out-cubic: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-in-out-cubic: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Micro-interactions */
.interactive-element {
  transition: all 0.2s var(--ease-out-cubic);
}

.interactive-element:hover {
  transform: translateY(-1px);
}

.interactive-element:active {
  transform: translateY(0) scale(0.98);
}
```

### Loading States
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 2s infinite;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideInUp 0.3s var(--ease-out-cubic);
}
```

---

## 🔧 9. 아이콘 시스템

### 아이콘 스타일
```css
.icon {
  width: 20px;
  height: 20px;
  color: var(--gray-600);
  stroke-width: 1.5;
  transition: color 0.15s ease;
}

.icon-large {
  width: 24px;
  height: 24px;
}

.icon-primary {
  color: var(--primary-blue);
}

.icon-success {
  color: var(--success);
}
```

### 아이콘 원칙
- **Lucide React** 라이브러리 사용 (일관된 스타일)
- 1.5px stroke-width로 통일
- 상태에 따른 색상 변화
- 호버시 부드러운 전환

---

## 📏 10. 간격 시스템 (Spacing System)

### 간격 토큰
```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}
```

### 적용 원칙
- **4px 기준**: 모든 간격은 4의 배수
- **일관성**: 같은 역할의 요소는 같은 간격
- **호흡감**: 충분한 여백으로 편안함 제공

---

## 🚨 11. UX 개선 포인트

### 현재 문제점 & 해결책

#### 1. 텍스트 가독성 개선
**문제**: 색상 대비 부족, 글자 크기 부적절
**해결책**:
- 메인 텍스트: `#1C1C1E` 사용
- 최소 16px 폰트 크기
- 줄 간격 1.5배 적용

#### 2. 버튼 시각적 피드백 강화
**문제**: 클릭 가능성 불분명
**해결책**:
- 호버 시 미묘한 상승 효과
- 클릭 시 스케일 다운 효과
- 명확한 색상 변화

#### 3. 로딩 상태 명확화
**문제**: 처리 중 상태 불분명
**해결책**:
- 스켈레톤 로딩 적용
- 진행률 표시
- 명확한 상태 메시지

#### 4. 에러 상태 개선
**문제**: 에러 메시지 불친절
**해결책**:
- 친근한 톤앤매너
- 구체적인 해결 방법 제시
- 시각적으로 눈에 띄는 디자인

#### 5. 모바일 터치 최적화
**문제**: 터치 영역 부족
**해결책**:
- 최소 44px 터치 영역
- 충분한 간격 확보
- 스와이프 제스처 지원

---

## 💡 12. 구현 우선순위

### Phase 1: 기초 시스템
1. 색상 시스템 적용
2. 타이포그래피 정리
3. 버튼 스타일 통일

### Phase 2: 컴포넌트 개선
1. 카드 디자인 업데이트
2. 입력 필드 스타일링
3. 상태 표시 개선

### Phase 3: 인터랙션 강화
1. 애니메이션 추가
2. 로딩 상태 개선
3. 에러 처리 향상

---

## 🎯 13. 성공 지표

### 사용성 지표
- **가독성**: WCAG AA 기준 충족 (4.5:1 대비율)
- **터치 친화성**: 최소 44px 터치 영역
- **로딩 시간**: 초기 렌더링 3초 이내

### 미적 지표
- **일관성**: 모든 컴포넌트 통일된 스타일
- **모던함**: 최신 디자인 트렌드 반영
- **브랜드 정체성**: ChatGPT & Apple 감성 구현

---

## 📚 14. 참고 자료

### 디자인 시스템
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [ChatGPT UI/UX Analysis](https://www.designpieces.com/palette/chatgpt-color-palette-hex-and-rgb/)
- [Kinsta ChatGPT Clone Guide](https://kinsta.com/blog/chatgpt-clone/)

### 색상 팔레트
- ChatGPT Green: `#74AA9C`
- Apple iOS Blue: `#007AFF`
- System Grays: SF 시스템 컬러 활용

---

*이 가이드를 바탕으로 Speakor 프로젝트의 UX/UI를 단계별로 개선하여 ChatGPT와 Apple의 세련된 디자인 감성을 구현하세요.*