const CheckMark = () => <img src="/icons/check-mark.svg" className="h-3.5 w-3.5" />;

const CheckSquare = ({ checked, onChange, size = 'sm', borderColor = 'border-[#626262]' }) => {
  const sizeClass = size === 'md' ? 'h-[1.25rem] w-[1.25rem]' : 'h-[0.875rem] w-[0.875rem]';
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.(!checked);
      }}
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-sm border transition-colors ${
        checked ? 'border-[#6429FF] bg-[#6429FF] text-white' : `${borderColor} bg-white text-transparent`
      }`}
    >
      <CheckMark />
    </button>
  );
};

export default CheckSquare;