// [1/3] 회원가입 - 정보 입력 화면 (환자 / 병원 공용, role에 따라 필드 분기)

import { useState } from 'react';
import Input from '../../../../components/Input';
import Button from '../../../../components/button/Button';
import useAuthStore from '../../../../store/useAuthStore';
import useSignupStore from '../../../../store/useSignupStore';
import { MOCK_PATIENT, MOCK_HOSPITALS } from '../../../../mock/mockdata';
import { formatBirthDate, isBirthDateComplete } from '../../../../utils/format';
import { SPECIALTY_CODE_MAP } from '../../../../utils/specialty';

// 입력 예시(placeholder)는 mockdata.js에 이미 있는 값을 그대로 재사용
const mockHospital = MOCK_HOSPITALS[0];

const PATIENT_FIELDS = [
  { name: 'name', label: '이름', placeholder: MOCK_PATIENT.name },
  { name: 'userId', label: '아이디', placeholder: 'aftor123' },
  { name: 'password', label: '비밀번호', placeholder: '비밀번호 입력', type: 'password' },
  { name: 'address', label: '주소', placeholder: '', icon: '/icons/search-gray.svg' },
  // 전화번호는 자유 입력 유지 (해외 환자 고려, 자동 포맷 없음)
  { name: 'phone', label: '연락처', placeholder: '+82-10-0000-0000 형식으로 입력' },
  { name: 'birth', label: '생년월일', placeholder: 'YYYY.MM.DD' }, //
  { name: 'passportNumber', label: '여권번호', placeholder: MOCK_PATIENT.passportNumber },
];

const HOSPITAL_FIELDS = [
  { name: 'hospitalName', label: '병원명', placeholder: mockHospital.name },
  { name: 'userId', label: '아이디', placeholder: 'aftor123' },
  { name: 'password', label: '비밀번호', placeholder: '비밀번호 입력', type: 'password' },
  // 국가, 도시 라벨 파싱 로직이랑 일치시켰어요!
  { name: 'countryCity', label: '도시, 국가', placeholder: 'Tokyo, Japan' },
  { name: 'hospitalAddress', label: '병원 주소', placeholder: '', icon: '/icons/search-gray.svg' },
  { name: 'phone', label: '연락처', placeholder: '+81-3-1234-5678 형식으로 입력' },
  { name: 'website', label: '웹사이트', placeholder: mockHospital.website },
];

// 병원 계정은 계정 정보(1) -> 병원 상세 정보(2) 두 화면으로 나눠서 입력
const HOSPITAL_SUB_STEPS = [
  ['hospitalName', 'userId', 'password'],
  ['countryCity', 'hospitalAddress', 'phone', 'website'],
];

// 전문 분야 (병원 상세 정보 화면에서 다중 선택 토글로 선택)
const SPECIALTY_OPTIONS = Object.keys(SPECIALTY_CODE_MAP);

// 비밀번호 규칙: 8자 이상 + 영문/숫자/특수문자 중 2가지 이상 조합
const getPasswordError = (password) => {
  if (!password) return null;
  if (password.length < 8) return '최소 8자 이상 입력해주세요.';

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const comboCount = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

  if (comboCount < 2) return '영문, 숫자, 특수문자 중 2가지 이상을 조합해주세요.';
  return null;
};

const Step1Info = ({ onNext }) => {
  const isHospital = useAuthStore((state) => state.role === 'hospital');
  const info = useSignupStore((state) => (isHospital ? state.hospitalInfo : state.patientInfo));
  const setPatientInfo = useSignupStore((state) => state.setPatientInfo);
  const setHospitalInfo = useSignupStore((state) => state.setHospitalInfo);
  const setInfo = isHospital ? setHospitalInfo : setPatientInfo;

  const [subStep, setSubStep] = useState(0);
  const isLastSubStep = !isHospital || subStep === HOSPITAL_SUB_STEPS.length - 1;

  const allFields = isHospital ? HOSPITAL_FIELDS : PATIENT_FIELDS;
  const visibleFields = isHospital
    ? allFields.filter((field) => HOSPITAL_SUB_STEPS[subStep].includes(field.name))
    : allFields;

  // 전문 분야 (병원 상세 정보 화면에서만 노출되는 다중 선택 토글)
  const showSpecialty = isHospital && subStep === 1;
  const [customSpecialty, setCustomSpecialty] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customOptions, setCustomOptions] = useState([]);
  const specialtyOptions = [...SPECIALTY_OPTIONS, ...customOptions];
  const selectedSpecialties = info.department ?? [];

  const toggleSpecialty = (label) => {
    setInfo({
      department: selectedSpecialties.includes(label)
        ? selectedSpecialties.filter((d) => d !== label)
        : [...selectedSpecialties, label],
    });
  };

  const handleAddCustomSpecialty = () => {
    const trimmed = customSpecialty.trim();
    if (trimmed) {
      if (!customOptions.includes(trimmed)) setCustomOptions((prev) => [...prev, trimmed]);
      if (!selectedSpecialties.includes(trimmed)) setInfo({ department: [...selectedSpecialties, trimmed] });
    }
    setCustomSpecialty('');
    setShowCustomInput(false);
  };

  const passwordError = getPasswordError(info.password);

  // 생년월일이 화면에 보이는 필드인 경우, 8자리(YYYY.MM.DD)가 다 채워졌는지 체크
  // 덜 입력한 상태로는 '다음' 버튼이 눌리지 않도록 막음
  const hasBirthField = visibleFields.some((field) => field.name === 'birth');
  const isBirthValid = !hasBirthField || isBirthDateComplete(info.birth);

  const isFilled =
    visibleFields.every((field) => info[field.name]?.trim()) &&
    !passwordError &&
    isBirthValid &&
    (!showSpecialty || selectedSpecialties.length > 0);

  // 생년월일 자동 포맷 적용
  const handleChange = (name) => (e) => {
    const rawValue = e.target.value;

    if (name === 'birth') {
      setInfo({ birth: formatBirthDate(rawValue) }); // 숫자만 입력해도 자동으로 . 붙여서 변환
    } else {
      setInfo({ [name]: rawValue });
    }
  };

  const handleNext = () => {
    if (isLastSubStep) {
      onNext();
    } else {
      setSubStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-8">
      <div className="flex flex-col gap-5">
        {showSpecialty && (
          <div className="flex flex-col gap-3">
            <p className="font-wantedsans text-sm font-bold leading-normal text-[#181818]">전문 분야</p>
            <div className="flex flex-wrap gap-1.5">
              {specialtyOptions.map((label) => {
                const isSelected = selectedSpecialties.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggleSpecialty(label)}
                    className={`flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 font-wantedsans text-xs font-normal transition-colors duration-200 ease-in-out ${
                      isSelected
                        ? 'border border-[#6B5DD6] bg-[#F2F0FD] text-[#6B5DD6]'
                        : 'border border-transparent bg-[#F5F5F5] text-[#626262] hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              {showCustomInput ? (
                <input
                  type="text"
                  autoFocus
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSpecialty()}
                  onBlur={handleAddCustomSpecialty}
                  placeholder="직접 입력"
                  className="w-20 rounded-full border border-[#6B5DD6] bg-[#F2F0FD] px-3 py-1.5 font-wantedsans text-xs font-normal text-[#6B5DD6] outline-none placeholder:text-[#A78AF4]"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="flex cursor-pointer items-center justify-center gap-1 rounded-full bg-[#F2F0FD] px-3 py-1.5 font-wantedsans text-xs font-normal text-[#6B5DD6]"
                >
                  <span className="text-xs leading-none">+</span> 직접 추가하기
                </button>
              )}
            </div>
          </div>
        )}

        {visibleFields.map((field) => {
          const isBirthField = field.name === 'birth';

          return (
            <Input
              key={field.name}
              label={field.label}
              name={field.name}
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              value={info[field.name]}
              onChange={handleChange(field.name)}
              icon={field.icon}
              // 생년월일 8자리가 아직 안 채워졌으면 에러 문구 표시 (password 에러랑 겹치지 않게 분기)
              error={
                field.name === 'password'
                  ? passwordError
                  : isBirthField && info.birth && !isBirthDateComplete(info.birth)
                    ? '생년월일 8자리를 모두 입력해주세요. (예: 1992.05.20)'
                    : undefined
              }
              maxLength={isBirthField ? 10 : undefined} // 생년월일만 길이 제한 (YYYY.MM.DD = 10자)
            />
          );
        })}
      </div>

      <Button variant="primary" className="mt-8" disabled={!isFilled} onClick={handleNext}>
        다음
      </Button>
    </div>
  );
};

export default Step1Info;