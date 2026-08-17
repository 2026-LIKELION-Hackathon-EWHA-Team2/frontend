import Button from '../button/Button';

// 중앙에 뜨는 확인/취소 모달
// props: open, title, description, confirmLabel, cancelLabel, onConfirm, onCancel

const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = '네',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      {/* 하단 GNB(z-50)보다 위에 뜨면서, 어두운 배경은 모바일 앱 폭(max-w-md) 안쪽에만 적용되도록 감싸는 컨테이너 */}
      <div className="relative mx-auto flex h-full max-w-md items-center justify-center">
        <button type="button" className="absolute inset-0 bg-black/50" onClick={onCancel} aria-label="닫기" />

        <div className="relative flex h-61 w-87.5 flex-col justify-between rounded-[20px] bg-[#FEFEFE] p-6">
          <button
            type="button"
            onClick={onCancel}
            className="absolute right-4 top-4 flex h-6 w-6 cursor-pointer items-center justify-center"
          >
            <img src="/icons/close.svg" alt="닫기" className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center gap-4 pt-10 text-center">
            <p className="self-stretch font-wantedsans text-lg font-semibold leading-normal text-[#181818]">
              {title}
            </p>
            <p className="self-stretch font-wantedsans text-[11px] font-normal leading-normal text-[#686868]">
              {description}
            </p>
          </div>

          <div className="flex w-full gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              {cancelLabel}
            </Button>
            <Button variant="primary" onClick={onConfirm} className="flex-1">
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
