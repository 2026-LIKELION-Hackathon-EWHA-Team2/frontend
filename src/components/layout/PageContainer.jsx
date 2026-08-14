/* 헤더랑 하단 GNB를 제외한 스크롤 가능한 본문 영역 래퍼!!*/

const PageContainer = ({ children, className = '' }) => (
    <main className={`pb-10 flex-1 overflow-y-auto scrollbar-none px-6 ${className}`}>
      {children}
    </main>
  );
  
export default PageContainer;