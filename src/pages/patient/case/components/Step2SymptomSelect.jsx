// [step 2] 증상 제시 체크 박스 선택 화면

import { useState, useEffect, useRef } from 'react';
import SymptomCheckbox from '../../../../components/checkbox/SymptomCheckbox';
import useCaseFormStore from '../../../../store/useCaseFormStore';

const SYMPTOM_OPTIONS = [
  { id: 'redness', label: '붉음', description: '시술 부위가 평소보다 붉게 나타나요.', icon: '/icons/symptom-redness.svg' },
  { id: 'swelling', label: '붓기', description: '시술 부위가 부어오르고 묵직한 느낌이 들어요.', icon: '/icons/symptom-swelling.svg' },
  { id: 'pain', label: '통증', description: '시술 부위에 통증이나 뻐근함이 있어요.', icon: '/icons/symptom-pain.svg' },
  { id: 'bruise', label: '멍 / 출혈', description: '멍이 들었거나 출혈이 발생했어요.', icon: '/icons/symptom-bruise.svg' },
  { id: 'discharge', label: '분비물', description: '진물이나 고름 같은 분비물이 나와요.', icon: '/icons/symptom-discharge.svg' },
  { id: 'itching', label: '가려움', description: '가려움이나 따가운 느낌이 있어요.', icon: '/icons/symptom-itching.svg' },
];

const Step2SymptomSelect = () => {
  const { checkedSymptoms, setCheckedSymptoms } = useCaseFormStore();
  const [customText, setCustomText] = useState('');

  const toggleSymptom = (id) => {
    setCheckedSymptoms(
      checkedSymptoms.includes(id) ? checkedSymptoms.filter((v) => v !== id) : [...checkedSymptoms, id]
    );
  };

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [customText]);

  // 기타 증상 입력 텍스트를 checkedSymptoms 배열에 그대로 같이 넣기
  const handleCustomChange = (e) => {
    const value = e.target.value;
    const withoutPrevCustom = checkedSymptoms.filter((v) => v !== customText);
    setCheckedSymptoms(value ? [...withoutPrevCustom, value] : withoutPrevCustom);
    setCustomText(value);
  };

  return (
    <>
    <div className="rounded-[0.625rem] border border-solid border-[#EDEDF1] p-4">
      <p className="mb-3 text-[#6B5DD6] font-wantedsans text-[0.875rem] font-bold leading-normal">증상 제시</p>
      <p className="mb-4 text-[#626262] font-wantedsans text-[0.625rem] font-medium leading-[0.875rem]">
        현재 느끼고 있는 증상을 선택해주세요.
        <br />
        여러 가지 증상을 선택할 수 있습니다.
      </p>

      <div className="mb-[0.375rem] flex flex-col gap-[0.375rem]">
        {SYMPTOM_OPTIONS.map((opt) => (
          <SymptomCheckbox
            key={opt.id}
            label={opt.label}
            description={opt.description}
            icon={<img src={opt.icon} className="h-5 w-5" alt={opt.label} />}
            checked={checkedSymptoms.includes(opt.id)}
            onChange={() => toggleSymptom(opt.id)}
          />
        ))}
      </div>

      <div className="rounded-[0.625rem] border border-[#EDEDF1] p-2">
        <p className="text-black font-wantedsans text-[0.625rem] font-bold leading-normal">기타 증상</p>
        <textarea
          ref={textareaRef}
          value={customText}
          onChange={handleCustomChange}
          placeholder="입력해주세요."
          rows={1}
          className="w-full resize-none text-[#1E1E1E] overflow-hidden font-wantedsans text-[0.5625rem] font-normal leading-normal outline-none placeholder:text-[#1E1E1E]"
        />
      </div>
    </div>
    </>
  );
};

export default Step2SymptomSelect;