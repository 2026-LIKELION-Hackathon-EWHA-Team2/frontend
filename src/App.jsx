import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import useToastStore from './store/useToastStore';
import LoadingState from './components/state/LoadingState';

// Shell 컴포넌트 불러오기
import OnboardingShell from './components/layout/OnboardingShell';
import PatientShell from './components/layout/PatientShell';
import HospitalShell from './components/layout/HospitalShell';
import Toast from './components/Toast';

import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// [어흥콘 리팩토링] 페이지 단위 lazy loading
// -> 지금 당장 안 쓰는 페이지 코드까지 초기 진입 시 전부 다운로드되던 문제 해결
// -> Shell/Toast 같은 공용 레이아웃만 정적 import로 남기고, 나머지 페이지는 lazy()로 전환

// [온보딩]
const SplashPage = lazy(() => import('./pages/onboarding/SplashPage'));
const SelectRolePage = lazy(() => import('./pages/onboarding/SelectRolePage'));
const LoginPage = lazy(() => import('./pages/onboarding/LoginPage'));
const SignupPage = lazy(() => import('./pages/onboarding/signup/SignupPage')); // 회원가입 퍼널

// [환자]
const PatientHomePage = lazy(() => import('./pages/patient/home/PatientHomePage'));
// 환자 - 케이스 등록
const CaseUploadPage = lazy(() => import('./pages/patient/case/CaseUploadPage')); // 케이스 등록 퍼널
// 환자 - 마이페이지
const PatientMyPage = lazy(() => import('./pages/patient/my/PatientMyPage'));
const MedicalPassportPage = lazy(() => import('./pages/patient/my/passport/MedicalPassportPage'));
const ProcedureDetailPage = lazy(() => import('./pages/patient/my/passport/ProcedureDetailPage'));
const PatientConsultHistoryPage = lazy(() => import('./pages/patient/my/passport/ConsultHistoryPage'));
// 환자 - 병원 매칭 및 네트워크
const HospitalMainPage = lazy(() => import('./pages/patient/hospital/HospitalMainPage'));
const HospitalSelectCase = lazy(() => import('./pages/patient/hospital/HospitalSelectCase')); // 케이스 선택 - AI 추천/네트워크 둘러보기 분기점
const AiMatchingPage = lazy(() => import('./pages/patient/hospital/matching/AiMatchingPage')); // AI 매칭 퍼널
const NetworkListPage = lazy(() => import('./pages/patient/hospital/network/NetworkListPage'));
const NetworkDetailPage = lazy(() => import('./pages/patient/hospital/network/NetworkDetailPage'));
const PatientCaseSyncPage = lazy(() => import('./pages/patient/hospital/sync/CaseSyncPage')); // 케이스 동기화 퍼널

// [병원]
const HospitalHomePage = lazy(() => import('./pages/hospital/home/HospitalHomePage'));
// 병원 - 케이스 (환자 조회 + 협진 요청)
const ConsultRequestListPage = lazy(() => import('./pages/hospital/case/ConsultRequestListPage'));
const HospitalPatientDetailPage = lazy(() => import('./pages/hospital/case/PatientDetailPage'));
const ConsultRequestDetail = lazy(() => import('./pages/hospital/case/ConsultRequestDetail'));
// 병원 - 채팅
const ChatListPage = lazy(() => import('./pages/hospital/chat/ChatListPage'));
const ChatRoomPage = lazy(() => import('./pages/hospital/chat/ChatRoomPage'));
const ConsultAgreementPage = lazy(() => import('./pages/hospital/chat/agreement/ConsultAgreementPage')); // AI 합의서 퍼널

// Suspense fallback - 페이지 chunk 로딩 중 보여줄 화면 - 기존 LoadingState 재사용했어요!! 
const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <LoadingState />
  </div>
);

// axiosInstance(response interceptor)가 access_token 만료(401) 시
// window.dispatchEvent(new CustomEvent('auth:sessionExpired'))로 쏘는 이벤트를 받아서
// 로그인 페이지로 부드럽게 이동시키는 역할만 하는 컴포넌트 추가!
const SessionExpiredHandler = () => {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
 
  useEffect(() => {
    const handleSessionExpired = () => {
      navigate('/login');
      showToast('세션이 만료되었어요! 다시 로그인해주세요', 4000);
    };
 
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    return () => window.removeEventListener('auth:sessionExpired', handleSessionExpired);
  }, [navigate, showToast]);
 
  return null;
};


function App() {

  return (
    <BrowserRouter>

      <SessionExpiredHandler />

      {/* 화면 여백 색상 채움 */}
      <div className="min-h-screen w-full bg-[#F1F3F5]">
        {/* 모바일 웹 표준 레이아웃 컨테이너 */}
        <div className="max-w-md mx-auto min-h-screen bg-white relative">
        {/* 렌더링 중 예외가 발생해도 화면 전체가 백지가 되지 않도록 최상단을 ErrorBoundary로 감쌈 */}
        <ErrorBoundary>
        {/* 페이지 chunk 로딩 중엔 RouteFallback(LoadingState) 보여줌 */}
        <Suspense fallback={<RouteFallback />}>
          <Routes>

            {/* Onboarding 라우트 */}
            <Route element={<OnboardingShell />}>

              <Route path="/" element={<SplashPage />} />
              <Route path="/select-role" element={<SelectRolePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
           
            {/* Patient 라우트 */}
            <Route path="/patient" element={
              <ProtectedRoute requiredRole="patient">
              <PatientShell />
            </ProtectedRoute> }>
              <Route path="home" element={<PatientHomePage />} />
              
              {/* 케이스 */}
              <Route path="case/upload" element={<CaseUploadPage />} />
              
              {/* 병원 탭 */}
              <Route path="hospital" element={<HospitalMainPage />} />
              <Route path="hospital/select-case" element={<HospitalSelectCase />} />
              <Route path="hospital/matching" element={<AiMatchingPage />} />
              <Route path="hospital/network" element={<NetworkListPage />} />
              <Route path="hospital/network/:id" element={<NetworkDetailPage />} />
              <Route path="hospital/sync" element={<PatientCaseSyncPage />} />

              {/* 마이페이지 탭 */}
              <Route path="my" element={<PatientMyPage />} />
              <Route path="my/passport" element={<MedicalPassportPage />} />
              <Route path="my/passport/:id" element={<ProcedureDetailPage />} />
              <Route path="my/passport/:id/consult" element={<PatientConsultHistoryPage />} />
            </Route>

            {/* Hospital 라우트 */}
            <Route path="/hospital" element={
              <ProtectedRoute requiredRole="hospital">
                <HospitalShell />
                </ProtectedRoute>}>
              <Route path="home" element={<HospitalHomePage />} />

              {/* 케이스 탭 */}
              <Route path="case" element={<ConsultRequestListPage />} />
              <Route path="case/:id" element={<HospitalPatientDetailPage />} />
              <Route path="case/request/:id" element={<ConsultRequestDetail />} />

              {/* 채팅 탭 */}
              <Route path="chat" element={<ChatListPage />} />
              <Route path="chat/room/:caseId/:roomId" element={<ChatRoomPage />} />
              <Route path="chat/agreement/:caseId/:roomId" element={<ConsultAgreementPage />} />
            </Route>
            
          </Routes>
          </Suspense>
          </ErrorBoundary>
          {/* 페이지 이동 후에도 유지되도록 라우트 밖(최상단)에서 한 번만 렌더링 */}
          <Toast />
        </div>
      </div>
    </BrowserRouter>
  );
} 

export default App