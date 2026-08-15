/* 화면 상단 헤더. 
뒤로가기(showBack)와 우측 알림 아이콘(onBellClick)을 선택적으로 노출할 수 있도록 만듦!!
일단은 혹시 몰라서 rightslot을 만들어 별도 지정 시에는 설정/ 저장 등의 형태로 변형 가능하도록 만들었음*/

import { useNavigate } from 'react-router-dom';

// onBack: 추가된 prop! 별도로 넘기지 않으면 기존처럼 navigate(-1) 로 동작하고,
// 넘기면 그 함수가 대신 실행됨 (케이스 등록처럼 한 페이지 안에서 step 상태로만 화면을 전환하는 경우,
// 브라우저 히스토리가 아니라 이전 step으로 되돌리고 싶을 때 사용)

const Header = ({ title, showBack = false, onBack, onBellClick, rightSlot }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between bg-[#FEFEFE] px-4 py-3 pt-5 print:hidden">
      <div className="flex w-10 items-center">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            className="flex cursor-pointer items-center justify-center"
          >
            <img src="/icons/header-back.svg" alt="뒤로가기" className="w-5 h-5" />
          </button>
        )}
      </div>
      <h1 className="text-center font-wantedsans text-lg font-medium leading-normal text-[#181818] font-features-['liga'_off,'clig'_off]">
        {title}
      </h1>
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
