/* 헤더랑 하단 GNB를 제외한 스크롤 가능한 본문 영역 래퍼!!*/

import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const PageContainer = ({ children, className = '' }) => {
  const mainRef = useRef(null);
  const { pathname } = useLocation();

  // 페이지(경로) 이동 시, 그리고 퍼널 페이지에서 step만 바뀌며 PageContainer가 새로 마운트될 때도
  // 이전 화면의 스크롤 위치가 남아있지 않도록 맨 위로 초기화
  // (페이지마다 min-h-screen 래퍼를 쓰는 경우 실제로는 main이 아니라 window가 스크롤되므로 둘 다 초기화)
  // useLayoutEffect: 브라우저가 그리기 전에 동기적으로 실행돼서, 옛 스크롤 위치가 잠깐이라도 보이는 걸 방지
  useLayoutEffect(() => {
    mainRef.current?.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main ref={mainRef} className={`pb-10 flex-1 overflow-y-auto scrollbar-none px-5.5 ${className}`}>
      {children}
    </main>
  );
};

export default PageContainer;