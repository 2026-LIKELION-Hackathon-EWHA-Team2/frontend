// [step 1] 환자 식별 정보 입력

import useCaseSyncStore from '../../../../../store/useCaseSyncStore';
import Input from '../../../../../components/Input';
import PillToggle from '../../../../../components/toggle/PillToggle';
import DateDropdown from '../../../../../components/DateDropDown';

const GENDER_OPTIONS = ['여성', '남성'];

const Step1Identify = () => {
  const { patientName, setPatientName, gender, setGender, birth, setBirth } = useCaseSyncStore();

  const handleBirthChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
    const parts = [digits.slice(0, 4), digits.slice(4, 6), digits.slice(6, 8)].filter(Boolean);
    setBirth(parts.join('.'));
  };
  
  return (
    <div className="flex flex-col">
      <div className="mb-9 flex flex-col items-center text-center">
        <div className="mb-4 flex h-17.5 w-17.5 items-center justify-center rounded-full bg-[#A78AF4]/10">
          <img src="/icons/icon-person.svg" alt="" className="h-8 w-8" />
        </div>
        <p className="mb-1 text-[#181818] text-center font-wantedsans text-xl font-medium leading-normal">
          환자 식별 정보 입력
        </p>
        <p className="text-[#626262] font-wantedsans text-[0.6875rem] font-medium leading-normal">
          최소한의 정보로 환자를 식별합니다.
        </p>
      </div>

      <Input
        variant="minimal"
        label="이름 (필수)"
        placeholder="이름 입력"
        className="mb-4"
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
      />

      <div className="mb-4 flex flex-col">
        <label className="mb-2 text-[#181818] font-wantedsans text-sm font-medium leading-[1.125rem]">
          성별 (선택)
        </label>
        <PillToggle options={GENDER_OPTIONS} selectedValue={gender} onChange={setGender} className='h-11' />
      </div>

      <Input
        variant="minimal"
        type="text"
        inputMode="numeric"
        label="생년월일 (선택)"
        placeholder="YYYY.MM.DD"
        value={birth}
        onChange={handleBirthChange}
      />

    </div>
  );
};

export default Step1Identify;