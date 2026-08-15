/* 화면 상단 헤더. 
뒤로가기(showBack)와 우측 알림 아이콘(onBellClick)을 선택적으로 노출할 수 있도록 만듦!!
일단은 혹시 몰라서 rightslot을 만들어 별도 지정 시에는 설정/ 저장 등의 형태로 변형 가능하도록 만들었음*/

import { useNavigate } from 'react-router-dom';

const Header = ({ title, showBack = false, onBellClick, rightSlot }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#FEFEFE] px-4 py-3 pt-5">
      <div className="flex w-10 items-center">
        {showBack && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center justify-center"
          >
            <img src="/icons/header-back.svg" alt="뒤로가기" className="w-5 h-5" />
          </button>
        )}
      </div>
      <h1 className="text-base font-semibold text-ink-900">{title}</h1>
      <div className="flex w-10 items-center justify-end">
        {rightSlot ?? (
          <button type="button" onClick={onBellClick} className="flex cursor-pointer items-center justify-center">
            <img src="/icons/header-bell.svg" alt="알림" className="w-6.5 h-6.5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
