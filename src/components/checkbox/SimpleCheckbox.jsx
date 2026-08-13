import CheckSquare from './CheckSquare';

/* useState로 checked 상태 관리 해주면 됩니다!
 * 일반적인 동의용 checkbox 컴포넌트 */

const SimpleCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center gap-3 p-4 rounded-[0.625rem] border border-[#DBDBDB]">
      <CheckSquare checked={checked} onChange={onChange} size="md" borderColor="border-[#181818]" />
      <span className="text-[#181818] font-wantedsans text-xs font-medium leading-4.5">
        {label}
      </span>
    </label>
  );
};

export default SimpleCheckbox;