import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Shell 컴포넌트 불러오기
import OnboardingShell from './components/layout/OnboardingShell';
import PatientShell from './components/layout/PatientShell';
import HospitalShell from './components/layout/HospitalShell';

// [온보딩]
import SplashPage from './pages/onboarding/SplashPage';
import SelectRolePage from './pages/onboarding/SelectRolePage';
import LoginPage from './pages/onboarding/LoginPage';
import SignupPage from './pages/onboarding/signup/SignupPage'; // 회원가입 퍼널

// [환자]
import PatientHomePage from './pages/patient/home/PatientHomePage';
// 환자 - 케이스 등록
import CaseUploadPage from './pages/patient/case/CaseUploadPage'; // 케이스 등록 퍼널
// 환자 - 마이페이지
import PatientMyPage from './pages/patient/my/PatientMyPage';
import MedicalPassportPage from './pages/patient/my/passport/MedicalPassportPage';
import ProcedureDetailPage from './pages/patient/my/passport/ProcedureDetailPage';
import PatientConsultHistoryPage from './pages/patient/my/passport/ConsultHistoryPage';
// 환자 - 병원 매칭 및 네트워크
import HospitalMainPage from './pages/patient/hospital/HospitalMainPage';
import HospitalSelectCase from './pages/patient/hospital/HospitalSelectCase'; // 케이스 선택 - AI 추천/네트워크 둘러보기 분기점
import AiMatchingPage from './pages/patient/hospital/matching/AiMatchingPage'; // AI 매칭 퍼널
import NetworkListPage from './pages/patient/hospital/network/NetworkListPage';
import NetworkDetailPage from './pages/patient/hospital/network/NetworkDetailPage';
import PatientCaseSyncPage from './pages/patient/hospital/sync/CaseSyncPage'; // 케이스 동기화 퍼널

// [병원]
import HospitalHomePage from './pages/hospital/home/HospitalHomePage';
// 병원 - 환자 조회
import PatientListPage from './pages/hospital/patients/PatientListPage';
import HospitalPatientDetailPage from './pages/hospital/patients/PatientDetailPage';
// 병원 - 협진
import ConsultRequestListPage from './pages/hospital/consult/ConsultRequestListPage';
import ConsultRoomPage from './pages/hospital/consult/ConsultRoomPage';
import ConsultAgreementPage from './pages/hospital/consult/agreement/ConsultAgreementPage'; // AI 합의서 퍼널
import ConsultRequestDetail from './pages/hospital/consult/ConsultRequestDetail';
// 병원 - 케이스 동기화
import HospitalCaseSyncPage from './pages/hospital/sync/HospitalCaseSyncPage'; // 동기화 퍼널



function App() {

  return (
    <BrowserRouter>

      {/* 화면 여백 색상 채움 */}
      <div className="min-h-screen w-full bg-[#F1F3F5]">
        {/* 모바일 웹 표준 레이아웃 컨테이너 */}
        <div className="max-w-md mx-auto min-h-screen bg-white relative">
      
          <Routes>

            {/* Onboarding 라우트 */}
            <Route element={<OnboardingShell />}>

              <Route path="/" element={<SplashPage />} />
              <Route path="/select-role" element={<SelectRolePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Patient 라우트 */}
            <Route path="/patient" element={<PatientShell />}>
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
            <Route path="/hospital" element={<HospitalShell />}>
              <Route path="home" element={<HospitalHomePage />} />
              
              {/* 환자 탭 */}
              <Route path="patients" element={<PatientListPage />} />
              <Route path="patients/:id" element={<HospitalPatientDetailPage />} />
              <Route path="patients/request/:id" element={<ConsultRequestDetail />} />
              
              {/* 협진 탭 */}
              <Route path="consult" element={<ConsultRequestListPage />} />
              <Route path="consult/room/:id" element={<ConsultRoomPage />} />
              <Route path="consult/agreement/:id" element={<ConsultAgreementPage />} />

              {/* 동기화 플로우 */}
              <Route path="sync" element={<HospitalCaseSyncPage />} />
            </Route>
            
          </Routes>
          
        </div>
      </div>
    </BrowserRouter>
  );
} 

export default App
