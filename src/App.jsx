import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 하단 바 컴포넌트 불러오기
import Bottombar from './components/navigation/Bottombar';

// 각 페이지 컴포넌트 불러오기 (GNB바 만들기 위해 임시로 만들었습니다!! 추후 페이지명 확정지으면 수정해야 합니다)
import CheckComponentsPage from './pages/dev/CheckComponentsPage';

import HomePage from './pages/HomePage';
import CasePage from './pages/CasePage';
import HospitalPage from './pages/HospitalPage';
import MyPage from './pages/MyPage';

function App() {

  return (
    <BrowserRouter>

      <div className="min-h-screen w-full bg-[#F1F3F5]">
        {/* 
        모바일 웹 표준 레이아웃 컨테이너를 적용했습니다
        최대 넓이 제한, 가운데 정렬, 최소 화면 높이 꽉 채우기 등
        */}
        <div className="max-w-md mx-auto min-h-screen bg-white relative">
      
          <main className="pb-24">
            <Routes>
              <Route path="/dev/components" element={<CheckComponentsPage/>} />
              <Route path="/" element={<HomePage />} />
              <Route path="/case" element={<CasePage />} />
              <Route path="/hospital" element={<HospitalPage />} />
              <Route path="/my" element={<MyPage />} />
            </Routes>
          </main>

          <Bottombar />
      
        </div>
      </div>
    </BrowserRouter>
  );
} 

export default App
