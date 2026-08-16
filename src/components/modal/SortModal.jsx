import Button from '../button/Button';

// 카드 정렬 기준을 고르는 하단 시트 모달
// props: open, title, options([{value, label}]), value, onChange, onApply, onClose

const SortModal = ({
  open,
  title = '어떤 순서로 정렬할까요?',
  options,
  value,
  onChange,
  onApply,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60">
      {/* 하단 GNB(z-50)보다 위에 뜨면서, 어두운 배경은 모바일 앱 폭(max-w-md) 안쪽에만 적용되도록 감싸는 컨테이너 */}
      <div className="relative mx-auto flex h-full max-w-md flex-col justify-end">
        <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="닫기" />

        <div className="relative w-full rounded-t-[1.25rem] bg-white px-5.5 pb-6 pt-5">
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="flex h-6 w-6 cursor-pointer items-center justify-center">
              <img src="/icons/close.svg" alt="닫기" className="h-4 w-4" />
            </button>
          </div>

          <p className="font-wantedsans text-lg font-bold leading-normal text-black">{title}</p>

          <div className="mt-5 flex flex-col gap-5">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className="flex cursor-pointer items-center justify-between"
              >
                <span className="font-wantedsans text-sm font-medium leading-normal text-black">
                  {option.label}
                </span>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    value === option.value ? 'border-[#6B5DD6]' : 'border-[#DADADA]'
                  }`}
                >
                  {value === option.value && <span className="h-2.5 w-2.5 rounded-full bg-[#6B5DD6]" />}
                </span>
              </button>
            ))}
          </div>

          <Button variant="primary" className="mt-6" onClick={onApply}>
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SortModal;
