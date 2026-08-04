import { useNavigate, useLocation } from 'react-router-dom';

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // 탭 정보 배열 (이 부분은 아직 정해진 이름이 없기 때문에 추후 수정하시면 됩니다!!)
  const tabs = [
    { id: 'home', label: '홈', path: '/', icon: 'gnb-home' },
    { id: 'case', label: '케이스', path: '/case', icon: 'gnb-case' },
    { id: 'hospital', label: '병원', path: '/hospital', icon: 'gnb-hospital' },
    { id: 'my', label: '마이', path: '/my', icon: 'gnb-my' },
  ];

  return (

    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white rounded-t-[10px] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] flex justify-between items-center pt-4 pb-7 px-10 z-50">
      {tabs.map((tab) => {
        // 현재 URL 경로와 탭의 path가 일치하면 isActive는 true가 됨
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center gap-1 cursor-pointer" 
          >
            <img
              // active 여부에 따라 파일명 뒤에 -active.svg 또는 -inactive.svg가 붙음
              src={`/icons/${tab.icon}-${isActive ? 'active' : 'inactive'}.svg`}
              alt={tab.label}
              className="w-6 h-6"
            />
            <span 
              className={`text-xs font-medium font-pretendard `}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomBar;