// [step 3] 증상 상세 입력 화면

import ChipToggle from '../../../../components/toggle/ChipToggle';
import DateDropdown from '../../../../components/DateDropDown';
import PillToggle from '../../../../components/toggle/PillToggle';
import Textarea from '../../../../components/Textarea';
import DotToggle from '../../../../components/toggle/DotToggle';
import useCaseFormStore from '../../../../store/useCaseFormStore';

const SYMPTOM_AREA_OPTIONS = [
  { id: 'face', label: '얼굴', icon: '/icons/symptom-area-face.svg' },
  { id: 'chest', label: '가슴', icon: '/icons/symptom-area-chest.svg' },
  { id: 'eyes', label: '눈', icon: '/icons/symptom-area-eyes.svg' },
  { id: 'lips', label: '입술', icon: '/icons/symptom-area-lips.svg' },
  { id: 'nose', label: '코', icon: '/icons/symptom-area-nose.svg' },
];
const PAIN_LEVEL_OPTIONS = ['없음', '약간', '보통', '심함', '매우 심함'];
const TIMING_OPTIONS = ['시술 직후', '시술 후 며칠 뒤'];

const Step3SymptomDetail = () => {
  const {
    symptomArea,
    setSymptomArea,
    symptomStartDate,
    setSymptomStartDate,
    symptomTiming,
    setSymptomTiming,
    symptomDetail,
    setSymptomDetail,
    painLevel,
    setPainLevel,
  } = useCaseFormStore();

  return (
    <>
    <div className="rounded-[0.625rem] border border-solid border-[#EDEDF1] p-4">
      <p className="mb-3 text-[#6B5DD6] font-wantedsans text-[0.875rem] font-bold leading-normal">증상 입력</p>
      <p className="mb-5 text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-3.5">
        선택한 증상에 대해 자세한 정보를 입력해주세요.
      </p>

      <p className="mb-2 text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">증상 부위</p>
      <div className='px-2 mb-5'>
      <ChipToggle
        options={SYMPTOM_AREA_OPTIONS}
        selectedValues={symptomArea}
        onChange={setSymptomArea}
        />
      </div>

      <DateDropdown label="증상 시작일" value={symptomStartDate} onChange={setSymptomStartDate} />

      <p className="mt-5 mb-2 text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">증상 발생 시점</p>
      <PillToggle options={TIMING_OPTIONS} selectedValue={symptomTiming} onChange={setSymptomTiming} />
      
      <Textarea
          label="증상 상세 설명"
          placeholder="느끼는 증상을 자세히 입력해주세요."
          value={symptomDetail}
          onChange={(e) => setSymptomDetail(e.target.value)}
          className="mt-5"
        />

      <p className="mt-5 mb-2 text-[#181818] font-wantedsans text-[0.75rem] font-bold leading-normal">통증 정도</p>
      <DotToggle options={PAIN_LEVEL_OPTIONS} selectedValue={painLevel} onChange={setPainLevel} />
      
      </div>
    </>
  );
};

export default Step3SymptomDetail;