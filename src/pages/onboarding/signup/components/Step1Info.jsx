// [1/3] 회원가입 - 정보 입력 화면 (환자 / 병원 공용, role에 따라 필드 분기)

import { useState } from 'react';
import Input from '../../../../components/Input';
import Button from '../../../../components/button/Button';
import useAuthStore from '../../../../store/useAuthStore';
import useSignupStore from '../../../../store/useSignupStore';
import { MOCK_PATIENT, MOCK_HOSPITALS } from '../../../../mock/mockdata';

// 입력 예시(placeholder)는 mockdata.js에 이미 있는 값을 그대로 재사용
const mockHospital = MOCK_HOSPITALS[0];

const PATIENT_FIELDS = [
  { name: 'name', label: '이름', placeholder: MOCK_PATIENT.name },
  { name: 'userId', label: '아이디', placeholder: 'aftor123' },
  { name: 'password', label: '비밀번호', placeholder: '비밀번호 입력', type: 'password' },
  { name: 'address', label: '주소', placeholder: '', icon: '/icons/search-gray.svg' },
  { name: 'phone', label: '연락처', placeholder: MOCK_PATIENT.phone },
  { name: 'birth', label: '생년월일', placeholder: MOCK_PATIENT.birth },
  { name: 'passportNumber', label: '여권번호', placeholder: MOCK_PATIENT.passportNumber },
];

const HOSPITAL_FIELDS = [
  { name: 'hospitalName', label: '병원명', placeholder: mockHospital.name },
  { name: 'userId', label: '아이디', placeholder: 'aftor123' },
  { name: 'password', label: '비밀번호', placeholder: '비밀번호 입력', type: 'password' },
  { name: 'department', label: '진료과', placeholder: mockHospital.department },
  { name: 'countryCity', label: '국가/도시', placeholder: 'Tokyo, Japan' },
  { name: 'hospitalAddress', label: '병원 주소', placeholder: '', icon: '/icons/search-gray.svg' },
  { name: 'phone', label: '연락처', placeholder: mockHospital.phone },
  { name: 'website', label: '웹사이트', placeholder: mockHospital.website },
];

// 병원 계정은 계정 정보(1) -> 병원 상세 정보(2) 두 화면으로 나눠서 입력
const HOSPITAL_SUB_STEPS = [
  ['hospitalName', 'userId', 'password'],
  ['department', 'countryCity', 'hospitalAddress', 'phone', 'website'],
];

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

  const passwordError = getPasswordError(info.password);
  const isFilled = visibleFields.every((field) => info[field.name]?.trim()) && !passwordError;

  const handleChange = (name) => (e) => setInfo({ [name]: e.target.value });

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
        {visibleFields.map((field) => (
          <Input
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
            value={info[field.name]}
            onChange={handleChange(field.name)}
            icon={field.icon}
            error={field.name === 'password' ? passwordError : undefined}
          />
        ))}
      </div>

      <Button variant="primary" className="mt-8" disabled={!isFilled} onClick={handleNext}>
        다음
      </Button>
    </div>
  );
};

export default Step1Info;
