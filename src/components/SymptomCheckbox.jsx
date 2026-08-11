import CheckSquare from './CheckSquare';

/* useState로 checked 상태 관리 해주면 됩니다!
 * 증상 선택용 checkbox 컴포넌트
 * icon은 <img src="/icons/symptom-redness.svg" className="" />처럼 나중에 넣어서 쓰시면 됩니당 */

const SymptomCheckbox = ({ label, description, icon, checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-[0.625rem] border p-2 text-left transition-colors border-[#EDEDF1]`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-[2.22925rem] w-[2.22925rem] shrink-0 items-center justify-center rounded-full border border-[#EDEDF1]`}>{icon}</div>
        <div>
          <p className="text-black font-wantedsans text-[0.625rem] font-bold leading-normal">{label}</p>
          {description && <p className="mt-1 text-[#1E1E1E] font-wantedsans text-[0.5625rem] font-normal leading-normal">{description}</p>}
        </div>
      </div>
      <CheckSquare checked={checked} onChange={onChange} size="sm" borderColor="border-[#DADADA]" />
    </button>
  );
};

export default SymptomCheckbox;