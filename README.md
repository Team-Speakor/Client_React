# Speakor - Korean Pronunciation Analysis

An AI-based Korean pronunciation analysis and feedback system that provides accurate pronunciation analysis and improvement suggestions for Korean language learners using STT models.

## Project Introduction

**Speakor** is a web application that provides customized pronunciation feedback to Korean language learners through **kresnik/wav2vec2-large-xlsr-korean based STT (Speech-to-Text)** and **LLM-based pronunciation analysis**. It supports real-time recording and file upload, and enables accurate analysis even in multi-speaker environments through speaker separation technology.

## Key Features

- **Multiple Input Methods**: Support for real-time recording or audio file upload
- **Speaker Separation**: Accurate speaker separation and selection using pyannote-audio
- **AI-based Analysis**: Precise pronunciation analysis through wav2vec2 STT + LLM
- **Detailed Feedback**: Pronunciation error highlighting, IPA notation, improvement tips
- **Learning Statistics**: Visual statistics including segment accuracy and error analysis

## Service Flow

### 1. Main Page - User Information Input
![Main Page](./Reference/Main_Page.png)

Enter user name and number of participants, then choose between real-time recording or file upload method.

### 2. Real-time Recording (Optional)
![Real-time Recording](./Reference/Direct_Record.png)

Provides real-time voice recording functionality through the browser.

### 3. Speaker Selection
![Speaker Selection](./Reference/Select_Speaker.png)

Select your own voice from the speakers separated by AI for analysis.

### 4. Analysis Results
![Analysis Results](./Reference/Analysis_Results.png)

Visually displays conversation content and pronunciation errors by segment, providing overall statistics.

### 5. Detailed Feedback
![Detailed Feedback](./Reference/Detail_Feedback.png)

Provides detailed pronunciation analysis, improvement tips, and practice methods for selected segments.

## System Architecture

![System Diagram](./Reference/System_Diagram.png)

The system consists of the following structure:

- **Frontend (React)**: User interface and progress management
- **Server (FastAPI)**: API integration, session management, pipeline coordination
- **Pre-processing**: Audio preprocessing, speaker separation, normalization
- **AI Model (wav2vec2)**: STT model fine-tuned with native/non-native speech data
- **LLM API**: Pronunciation analysis and feedback generation

## Processing Flow

![User Flow](./Reference/Userflow_Diagram.png)

**Complete Processing Steps:**
1. **Upload Audio File** → Audio file upload
2. **Audio Pre-processing** → Preprocessing through FFmpeg and MeCab-ko
3. **Speaker Diarization** → Speaker separation using Pyannote-Audio Toolkit
4. **STT Processing** → wav2vec2 model fine-tuned with native/non-native data
5. **Compare Module** → Compare two STT results and identify errors
6. **Integration Module** → LLM-based comprehensive analysis and feedback generation
7. **Display Output Result** → Final result display

## Technology Stack

### **Frontend**
- **React 18** + **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui**
- **React Router DOM**

### **Backend & AI**
- **FastAPI**
- **kresnik/wav2vec2-large-xlsr-korean** (Facebook's Self-supervised Speech Recognition model)
- **pyannote-audio** (Speaker separation and voice segmentation)
- **FFmpeg** (Audio processing and conversion)
- **MeCab-ko** (Korean morphological analysis)

## Developer Information

<table>
    <tr height="160px">
        <td align="center" width="160px">
            <a href="https://github.com/KJ-Min"><img height="120px" width="120px" src="https://avatars.githubusercontent.com/KJ-Min"/></a>
            <br/>
            <a href="https://github.com/KJ-Min"><strong>Min Kyung Jin</strong></a>
            <br />
        </td>
        <td>
            <strong>Frontend Developer</strong><br/>
            • Full frontend development based on React + TypeScript<br/>
            • User interface design and implementation<br/>
            • API integration and state management<br/>
            • Responsive web design implementation<br/>
            • Real-time recording feature development<br/>
            • Data visualization and feedback UI implementation
        </td>
    </tr>
</table>