import { useEffect } from 'react';

// ref로 감싼 영역 밖을 클릭하면 onOutsideClick을 호출 - 드롭다운/팝오버를 바깥 클릭으로 닫는 용도
const useClickOutside = (ref, onOutsideClick) => {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutsideClick();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, onOutsideClick]);
};

export default useClickOutside;
