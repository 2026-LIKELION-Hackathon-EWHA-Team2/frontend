const CheckMark = () => <img src="/icons/check-mark.svg" className="h-3.5 w-3.5" />;

const CheckSquare = ({
  checked,
  onChange,
  size = 'sm',
  borderColor = 'border-[#626262]',
  activeClass = 'border-[#6429FF] bg-[#6429FF]',
  rounded = 'rounded-sm',
}) => {
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
      className={`flex ${sizeClass} shrink-0 cursor-pointer items-center justify-center ${rounded} border transition-colors ${
        checked ? `${activeClass} text-white` : `${borderColor} bg-white text-transparent`
      }`}
    >
      <CheckMark />
    </button>
  );
};

export default CheckSquare;