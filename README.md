![header](https://capsule-render.vercel.app/api?type=waving&height=150&color=0:7C3AED,50:8B5CF6,100:C4B5FD&section=header)
# Aftor

> 국경을 넘어 이어지는 의료 사후관리와 병원 간 협진 플랫폼

<img width="1757" height="1173" alt="image" src="https://github.com/user-attachments/assets/a2a4c976-4fd5-4ef8-a1d8-3aef824997cd" />


---

### 🌏 Borderless Track

> **Borderless**는 언어와 국가의 경계를 넘어 사용자의 문제를 해결하고,
> 서로 다른 지역의 사람과 서비스를 연결하는 트랙입니다.

Aftor(After + Doctor)는 한국에서 의료 시술을 받은 외국인 환자가 귀국한 이후에도 필요한 의료정보와 의료기관 연결을 지속적으로 지원하는 AI 기반 크로스보더 의료 협진 플랫폼입니다.

---

### 💜 서비스 소개

> 해외 의료 시술 이후 환자와 국내외 병원을 연결해 연속적인 사후관리를 돕는
> AI 기반 의료 협진 서비스

Aftor는 환자가 작성한 증상과 진단서 정보를 바탕으로 적절한 병원을 탐색하고,
시술 병원과 사후관리 병원 사이의 협진 과정을 연결합니다.

병원 간 대화는 사용자의 선호 언어에 맞게 제공되며, 양측의 대화와 전달된 의료
정보를 토대로 한국어·일본어 협진 합의안 초안을 생성합니다. AI가 생성한 내용은
의료진의 검토와 승인을 거쳐 최종 확정됩니다.

<!-- 서비스 소개 또는 프로젝트 목표 장표 이미지 삽입
<img width="1920" alt="Aftor 서비스 소개" src="" />
-->

---

### ✨ 핵심 기능

- 👤 **환자·병원 계정 관리** — 사용자 유형별 회원가입, JWT 인증 및 프로필 관리
- 📝 **환자 증상 접수** — 증상 사진, 부위, 유형, 시작일, 통증 정도와 진단서 등록
- 🤖 **AI 진단서 분석 및 증상 요약** — 제출 자료를 협진용 구조화 정보로 변환
- 🏥 **병원 탐색 및 매칭** — 진료 분야와 환자 정보를 기반으로 네트워크 병원 조회·추천·선택
- 🔐 **동의 기반 의료정보 전송** — 환자 동의 범위에 따라 병원에 케이스 정보 전달
- 🌐 **국가 간 병원 협진** — 협진 요청 접수·시작, 대화 흐름 및 읽음 상태 관리
- 💬 **AI 의료 메시지 번역** — 한국·일본 병원의 메시지를 상대 병원의 언어로 제공
- 📑 **AI 협진 합의안** — 양측 대화를 반영한 한국어·일본어 합의안 초안 생성, 검토 및 확정
- 📊 **병원 대시보드·케이스 관리** — 케이스 진행 상태와 주요 데이터 관리

---

### 🛠 기술 스택

<table>
  <tr>
    <th align="center">Plan / Design</th>
    <th align="center">Backend</th>
    <th align="center">Frontend</th>
    <th align="center">AI</th>
  </tr>
  <tr>
    <td valign="top" align="center">
      <img src="https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white" />
    </td>
    <td valign="top" align="center">
      <img src="https://img.shields.io/badge/Python_3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Django_5.2-092E20?style=for-the-badge&logo=django&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Django_REST_Framework-A30000?style=for-the-badge&logo=django&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Simple_JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/WhiteNoise-6B7280?style=for-the-badge" /><br />
      <img src="https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white" />
    </td>
    <td valign="top" align="center">
      <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" /><br />
      <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /><br />
      <img src="https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/TanStack-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /><br />
      <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
    </td>
    <td valign="top" align="center">
      <img src="https://img.shields.io/badge/OpenAI_API-412991?style=for-the-badge&logo=openai&logoColor=white" />
    </td>
  </tr>
</table>

### 👥 팀원 소개

<table>
  <tr align="center">
    <th width="33%">주영</th>
    <th width="33%">소담</th>
    <th width="33%">지민</th>
  </tr>
  <tr align="center">
    <td><b>PM / UI·UX Design</b></td>
    <td><b>PM / UI·UX Design</b></td>
    <td><b>Frontend</b></td>
  </tr>
  <tr align="center">
    <td valign="top">
      <b>[ 기획 ]</b><br />
      서비스 기획<br />
      IA + 기능 명세서<br />
      타겟 사용자 설정<br />
      사용자 흐름<br />
      유저 리서치<br /><br />
      <b>[ 디자인 ]</b><br />
      로고<br />
      프로토타입<br />
      디자인 시스템<br />
      발표 자료<br />
      영상
    </td>
    <td valign="top">
      <b>[ 기획 ]</b><br />
      서비스 기획<br />
      타겟 사용자 설정<br />
      사용자 흐름<br />
      BM 설계<br /><br />
      <b>[ 디자인 ]</b><br />
      와이어프레임<br />
      프로토타입<br />
      발표 자료<br />
      디자인 시스템
    </td>
    <td valign="top">
      <b>[ 초기 환경·배포 ]</b><br />
        프로젝트 초기 구조 설계<br />
        배포 환경 구축<br />
      <br />
      <b>[ 화면·UI 개발 ]</b><br />
        공통 UI 컴포넌트 제작<br />
        온보딩 페이지 제작<br />
        환자 마이페이지 & <br />AI 매칭 페이지 제작<br />
        병원 측 협진 페이지 제작<br />
      <br />
      <b>[ 기능·API 연동 ]</b><br />
        병원 간 협진 채팅 UI 및 <br />기능 구현<br />
        병원 매칭 기능<br /> & 케이스 API 연동
    </td>
  </tr>
</table>

<br />

<table>
  <tr align="center">
    <th width="33%">영진</th>
    <th width="33%">채원</th>
    <th width="33%">서인</th>
  </tr>
  <tr align="center">
    <td><b>Frontend</b></td>
    <td><b>Backend</b></td>
    <td><b>Backend</b></td>
  </tr>
  <tr align="center">
    <td valign="top">
      <b>[ 상태 관리·아키텍처 ]</b><br/>
        Zustand 기반 전역 상태 관리<br/> 설계 및 구현<br/>
        TanStack Query 기반<br/> 커스텀 훅 레이어 구축<br />
      <br/>
      <b>[ 네트워크·데이터 가공 ]</b><br/>
        Axios Instance 및 Interceptor 기반<br/> 공통 API 통신 환경 구축<br/>
        데이터 변환 및 매핑<br/> 유틸리티(Util) 제작<br />
      <br/>
      <b>[ 화면·UI 개발 ]</b><br/>
        공통 UI 컴포넌트 제작<br/>
        환자 케이스 등록 및<br/> 동기화 페이지 제작<br/>
        병원 케이스 조회<br/> 페이지 제작<br />
      <br/>
      <b>[ API 연동 ]</b><br/>
        계정 및 환자 케이스 API 연동
    </td>
    <td valign="top">
      <b>[ 계정·프로필 ]</b><br />
      환자·병원 계정 관리<br />
      환자 주소·위치정보 관리<br /><br />
      <b>[ 증상·의료정보 ]</b><br />
      환자 증상 접수·관리<br />
      증상·의료정보 병원 전달<br /><br />
      <b>[ 병원·매칭 ]</b><br />
      병원 탐색·검색<br />
      위치 기반 AI 병원 매칭<br /><br />
      <b>[ 협진·합의안 ]</b><br />
      병원 간 협진 요청 관리<br />
      AI 협진 합의안 관리<br /><br />
      <b>[ 번역·다국어 ]</b><br />
      협진 의료정보 AI 번역<br />
      병원별 언어 맞춤 제공
    </td>
    <td valign="top">
      <b>[ 계정·프로필 ]</b><br />
      JWT 회원가입·로그인<br />
      환자·병원 프로필 관리<br /><br />
      <b>[ 케이스·이력 ]</b><br />
      시술 이력 목록·상세 조회<br />
      케이스 동기화·의료정보 전송<br /><br />
      <b>[ 협진·AI ]</b><br />
      진단서 분석·증상 요약<br />
      병원 간 협진·채팅 번역<br />
      AI 합의안 생성·검토·승인<br /><br />
      <b>[ 배포·운영 ]</b><br />
      Render·PostgreSQL 배포
    </td>
  </tr>
</table>

### 📁 폴더 구조

#### Frontend

```text
frontend/
├── src/
│   ├── apis/          # 계정(Accounts), 케이스(Cases) 등 비동기 API 요청 모듈
│   ├── assets/       
│   ├── components/   # 공통 및 페이지별 UI 컴포넌트
│   ├── hooks/        # TanStack Query Custom Hooks 및 재사용 커스텀 훅
│   ├── pages/        # 라우팅 기반 주요 화면 페이지
│   ├── store/        # Zustand 기반 클라이언트 전역 상태 스토어
│   ├── styles/       
│   ├── utils/        # API 데이터 매핑, 필드명 변환, 포맷팅 등 유틸리티 함수
│   ├── App.jsx       # 최상위 라우팅 및 앱 진입 컴포넌트
│   └── main.jsx      # React 엔트리 포인트 및 Provider(QueryClient 등) 설정
├── public/           # icons, images 
├── index.html        
├── vite.config.js   
├── package.json      
└── README.md
```

#### Backend

```text
backend/
├── config/                  # Django 프로젝트 설정 및 최상위 URL
├── accounts/                # 환자·병원 계정, 인증 및 프로필
├── selfsymptoms/            # 환자 증상과 진단서 접수·분석
├── matching/                # 네트워크 병원 탐색 및 AI 병원 추천
├── cases/                   # 케이스 전송, 협진, 채팅 및 최종 합의안
├── media/                   # 로컬 실행 시 생성되는 업로드 파일 디렉터리
├── manage.py
├── requirements.txt
└── README.md
```

---

### 🚀 개발 환경에서 실행하기

#### 1. 저장소 및 가상환경 설정

```bash
git clone https://github.com/2026-LIKELION-Hackathon-EWHA-Team2/backend.git
cd backend
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Windows Git Bash:

```bash
source venv/Scripts/activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

#### 2. 패키지 및 환경변수 설정

```bash
pip install -r requirements.txt
```

프로젝트 루트에 `.env` 파일을 생성합니다.

```dotenv
SECRET_KEY=SECRET_KEY=django-insecure-local-development-only
DEBUG=True
DATABASE_URL=
OPENAI_API_KEY=

# 선택 설정: 미설정 시 기본 모델 사용
# OPENAI_TRANSLATION_MODEL=gpt-5.6-terra
# OPENAI_AGREEMENT_MODEL=gpt-5.6-terra
# OPENAI_MATCHING_MODEL=gpt-5.6-terra
# OPENAI_DOCUMENT_MODEL=gpt-5.6-terra

# 아래 두 방식 중 하나를 사용합니다.
CLOUDINARY_URL=

# CLOUDINARY_CLOUD_NAME=
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
```

로컬에서는 `DATABASE_URL`과 Cloudinary 설정을 비워 두면 각각 SQLite와 로컬
`media/` 저장소를 사용합니다. Render 배포 환경에서는 Cloudinary 설정이 필수입니다.

#### 3. 데이터베이스 및 서버 실행

```bash
python manage.py migrate
python manage.py runserver
```

기본 개발 서버는 `http://127.0.0.1:8000/`에서 실행됩니다.

#### 4. 테스트

```bash
python manage.py test
```

---

### 🔗 배포 링크

| 구분 | URL |
| --- | --- |
| Frontend | https://borderlesslion-front.vercel.app |
| Backend API | https://likelion-team2-backend.onrender.com/accounts/login/ |

---

![footer](https://capsule-render.vercel.app/api?type=waving&height=150&color=0:7C3AED,50:8B5CF6,100:C4B5FD&section=footer)
