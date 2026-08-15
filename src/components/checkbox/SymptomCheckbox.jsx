import CheckSquare from '../Checksquare';

const SymptomCheckbox = ({ label, description, icon, checked, onChange }) => {
  const toggle = () => onChange?.(!checked);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      }}
      className="flex w-full items-center justify-between gap-3 rounded-[0.625rem] border p-2 text-left transition-colors border-[#EDEDF1] cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-[2.22925rem] w-[2.22925rem] shrink-0 items-center justify-center rounded-full border border-[#EDEDF1]">
          {icon}
        </div>
        <div>
          <p className="text-black font-wantedsans text-[0.625rem] font-bold leading-normal">{label}</p>
          {description && (
            <p className="mt-1 text-[#1E1E1E] font-wantedsans text-[0.5625rem] font-normal leading-normal">
              {description}
            </p>
          )}
        </div>
      </div>
      <CheckSquare checked={checked} onChange={onChange} size="sm" borderColor="border-[#DADADA]" />
    </div>
  );
};

export default SymptomCheckbox;