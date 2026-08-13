// 2-4 인계 서류 페이지에 있는 공유하기, 다운로드 버튼

const ResultActionButton = ({ 
  variant = 'share', // 'share' (공유하기) | 'download' (다운로드)
  onClick, 
  className = '' 
}) => {

  const handleClick = (e) => {
    if (onClick) onClick(e);

    // 다운로드 모드일 경우 PDF 저장을 위한 인쇄창 띄우기
    if (variant === 'download') {
      window.print();
    } else if (variant === 'share') {
      if (navigator.share) {
        navigator.share({
          title: '의료정보 공유',
          text: '진단 및 의료정보 결과를 확인해보세요.',
          url: window.location.href,
        }).catch(console.error);
      } else {
        alert('공유하기 기능이 지원되지 않는 브라우저입니다.');
      }
    }
  };

  // 모드에 따른 텍스트 설정
  const title = variant === 'share' ? '공유하기' : '다운로드';
  const description = variant === 'share' ? '의료정보 공유' : 'Pdf 문서로 저장';
  const iconPath = variant === 'share' ? '/icons/result-share.svg' : '/icons/result-download.svg';

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        flex w-full shrink-0 items-center justify-center gap-3 rounded-lg border border-[#EDEDF1] px-3 py-2 bg-white
        cursor-pointer transition-colors hover:bg-gray-50 active:bg-gray-100
        ${className}
      `}
    >
      {/* 보라색 원 & 아이콘 영역 */}
      <div className="flex  h-10 w-10 -ml-4 shrink-0 items-center justify-center rounded-full bg-[#A78AF4]/10">
        <img 
          src={iconPath} 
          alt={title} 
          className="h-6 w-6" 
        />
      </div>

      {/* 텍스트 영역  */}
      <div className="flex flex-col items-start gap-0.5">
        {/* 메인 타이틀 */}
        <span className="font-wantedsans text-sm font-medium text-[#333333]">
          {title}
        </span>
        {/* 서브 설명  */}
        <span className="font-wantedsans text-[10px] font-medium leading-4 text-[#626262]">
          {description}
        </span>
      </div>
    </button>
  );
};

export default ResultActionButton;