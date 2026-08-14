import { useNavigate, useLocation } from 'react-router-dom';

/* 각각 patient/hospital 만드는 거랑 app shell 활용한 거랑 
뭐가 좋을지 고민되어서 일단 이렇게 만들었어요!
 */
const BottomGNB = ({ items }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#FEFEFE] rounded-t-[0.625rem] shadow-[0_-2px_2px_0_rgba(0,0,0,0.05)] flex justify-between items-center pt-3.25 pb-[calc(1.625rem+env(safe-area-inset-bottom))] px-10 z-50">
      {items.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <button
            key={tab.path}
            type="button"
            onClick={() => navigate(tab.path)}
            className="flex cursor-pointer flex-col items-center gap-1 focus:outline-none"
          >
            <img
              src={`/icons/${tab.icon}-${isActive ? 'active' : 'inactive'}.svg`}
              alt={tab.label}
              className="h-6 w-6"
            />
            <span className={`text-[0.625rem] font-medium font-wantedsans ${isActive ? 'text-[#181818]' : 'text-[#686868]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomGNB;
