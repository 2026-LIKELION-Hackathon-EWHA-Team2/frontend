import CheckSquare from './CheckSquare';

/* useState로 checked, expanded 상태 관리 해주면 됩니다!
 * 자세한 약관이나 설명이 있는 checkbox 컴포넌트 */

const ConsentCheckbox = ({
  label,
  checked,
  onChange,
  expandable = false,
  expanded = false,
  onToggleExpand,
  children,
}) => {
  return (
    <div className="rounded-[0.625rem] border border-[#DBDBDB] px-4">
      <div className="flex items-center justify-between gap-3 py-4">
        <label className="flex flex-1 items-center gap-2">
          <CheckSquare checked={checked} onChange={onChange} size="md" borderColor="border-[#626262]" />
          <span className="text-[#626262] font-wantedsans text-xs font-medium leading-[1.125rem]">{label}</span>
        </label>
        {expandable && (
          <button type="button" onClick={onToggleExpand} className="rounded pl-1">
            <img
              src="/icons/down-pop.svg"
              className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
      {expandable && expanded && (
        <div className="pb-4 pl-8 pr-2">{children}</div>
      )}
    </div>
  );
};

export default ConsentCheckbox;