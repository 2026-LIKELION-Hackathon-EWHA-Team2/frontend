/* 헤더랑 하단 GNB를 제외한 스크롤 가능한 본문 영역 래퍼!!*/

const PageContainer = ({ children, className = '' }) => (
    <main className={`flex-1 overflow-y-auto scrollbar-none ${className}`}>
      {children}
    </main>
  );
  
export default PageContainer;