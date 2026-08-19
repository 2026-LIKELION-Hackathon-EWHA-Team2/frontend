import Button from '../button/Button';

// '신규 요청' 케이스 카드에서 '케이스 보기'를 눌렀을 때 뜨는 확인 모달
// props: open, patientName, onConfirm, onClose

const NewRequestModal = ({ open, patientName, onConfirm, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      {/* 어두운 배경은 모바일 앱 폭(max-w-md) 안쪽에만 적용 */}
      <div className="relative mx-auto flex h-full max-w-md items-center justify-center px-6">
        <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="닫기" />

        <div className="relative w-full rounded-[1.25rem] bg-white px-6 py-9">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-6 w-6 cursor-pointer items-center justify-center"
          >
            <img src="/icons/close.svg" alt="닫기" className="h-5 w-5" />
          </button>

          <p className="pt-2 text-center font-wantedsans text-lg font-medium leading-normal text-black">
            {patientName} 님의 협진 요청이 왔어요!
          </p>

          <Button variant="primary" className="mt-10" onClick={onConfirm}>
            협진 요청서 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewRequestModal;
