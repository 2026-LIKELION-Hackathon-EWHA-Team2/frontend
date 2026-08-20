import { useState } from 'react';
import Header from '../../../components/layout/Header';
import ProgressSteps from '../../../components/ProgressSteps';
import Step1Info from './components/Step1Info';
import Step2Terms from './components/Step2Terms';
import Step3Complete from './components/Step3Complete';
import useAuthStore from '../../../store/useAuthStore';
import useSignupStore from '../../../store/useSignupStore';
import { useSignupPatientMutation, useSignupHospitalMutation } from '../../../hooks/useMockQueries';
import { toApiDateFormat } from '../../../utils/format'; // 'YYYY.MM.DD' → 'YYYY-MM-DD' 변환용
import { inferPreferredLanguage } from '../../../utils/country';

const STEP_LABELS = ['정보 입력', '약관 동의', '가입 완료'];

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [signupError, setSignupError] = useState('');

  const isHospital = useAuthStore((state) => state.role === 'hospital');
  const patientInfo = useSignupStore((state) => state.patientInfo);
  const hospitalInfo = useSignupStore((state) => state.hospitalInfo);
  const terms = useSignupStore((state) => state.terms);

  const signupPatientMutation = useSignupPatientMutation();
  const signupHospitalMutation = useSignupHospitalMutation();
  const isSubmitting = signupPatientMutation.isPending || signupHospitalMutation.isPending;

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleTermsNext = () => {
    setSignupError('');

    if (isHospital) {
      // countryCity 입력칸이 한 칸으로 되어있어서 split 처리함
      const [city = '', country = ''] = hospitalInfo.countryCity.split(',').map((s) => s.trim());

      signupHospitalMutation.mutate(
        {
          name: hospitalInfo.hospitalName,
          login_id: hospitalInfo.userId,
          password: hospitalInfo.password,
          preferred_language: inferPreferredLanguage(hospitalInfo.countryCity),
          specialty_names: hospitalInfo.department,
          country,
          city,
          address: hospitalInfo.hospitalAddress,
          phone: hospitalInfo.phone,
          website: hospitalInfo.website,
          terms_agreed: terms.service,
          privacy_agreed: terms.privacy,
          overseas_info_agreed: terms.hospitalShare,
          location_info_agreed: terms.location,
          marketing_agreed: terms.marketing,
        },
        {
          onSuccess: () => nextStep(),
          onError: (err) => {
            console.error(err);
            setSignupError('회원가입에 실패했어요. 입력 정보를 다시 확인해주세요.');
          },
        }
      );
    } else {
      signupPatientMutation.mutate(
        {
          name: patientInfo.name,
          login_id: patientInfo.userId,
          password: patientInfo.password,
          address: patientInfo.address,
          phone: patientInfo.phone,
          birth_date: toApiDateFormat(patientInfo.birth), // 'YYYY.MM.DD' → 'YYYY-MM-DD' 변환해서 전송
          passport_number: patientInfo.passportNumber,
          terms_agreed: terms.service,
          privacy_agreed: terms.privacy,
          overseas_info_agreed: terms.hospitalShare,
          overseas_transfer_agreed: terms.overseasTransfer,
          marketing_agreed: terms.marketing,
          location_info_agreed: terms.location,
        },
        {
          onSuccess: () => nextStep(),
          onError: (err) => {
            console.error(err);
            setSignupError('회원가입에 실패했어요. 입력 정보를 다시 확인해주세요.');
          },
        }
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header title="회원가입" showBack rightSlot={<></>} />

      {step < 3 && (
        <div className="px-6 pt-6">
          <ProgressSteps steps={STEP_LABELS} currentIndex={step - 1} />
        </div>
      )}

      {step === 1 && <Step1Info onNext={nextStep} />}
      {step === 2 && (
        <Step2Terms
          onNext={handleTermsNext}
          onPrev={prevStep}
          isSubmitting={isSubmitting}
          error={signupError}
        />
      )}
      {step === 3 && <Step3Complete />}
    </div>
  );
};

export default SignupPage;