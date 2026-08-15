// [2/3] 회원가입 - 약관 동의 화면 (환자 / 병원 공용, 국외 이전 동의는 환자만 노출)

import { useState } from 'react';
import Button from '../../../../components/button/Button';
import ConsentCheckbox from '../../../../components/checkbox/ConsentCheckbox';
import useAuthStore from '../../../../store/useAuthStore';
import useSignupStore from '../../../../store/useSignupStore';

const TERMS_CONFIG = [
  {
    key: 'service',
    label: '서비스 이용약관 (필수)',
    required: true,
    detail: 'aftor 서비스 이용을 위한 기본 약관입니다.',
  },
  {
    key: 'privacy',
    label: '개인정보 수집 및 이용 동의 (필수)',
    required: true,
    detail: '회원가입 및 서비스 제공을 위해 개인정보를 수집·이용합니다.',
  },
  {
    key: 'hospitalShare',
    label: '해외 병원 정보 공유 동의 (필수)',
    required: true,
    detail: '신속한 협진을 위해 시술/증상 정보를 해외 병원과 공유할 수 있습니다.',
  },
  {
    key: 'overseasTransfer',
    label: '개인정보 국외 이전 동의',
    required: true,
    patientOnly: true,
    sections: [
      {
        title: '1. 이전되는 개인정보 항목',
        body: '성명(이니셜), 여권번호, 생년월일, 시술 정보(시술명·부위·일자), 사용된 약물·재료 성분명, 부작용 유형 및 경과 정보, 의료진 소견',
      },
      {
        title: '2. 개인정보를 이전받는 자',
        body: '회원이 선택하고 매칭에 동의한 협력 네트워크 병원. 실제 이전받는 병원명은 케이스 전송 시점에 별도로 특정하여 고지합니다.',
      },
      {
        title: '3. 이전되는 국가·시기 및 방법',
        body: '국가는 회원이 등록한 거주국가 내 협력 병원 소재지이며, 시기는 회원이 케이스 전송에 동의한 시점, 방법은 암호화된 네트워크를 통한 전자적 전송입니다.',
      },
      {
        title: '4. 이용 목적',
        body: '귀국 후 시술 부작용 확인 및 사후관리를 위한 병원 간 협진, 그 과정에서 자국 의료진의 진료 참고 자료로 활용됩니다.',
      },
      {
        title: '5. 보유 및 이용 기간',
        body: '협진 종료 후 1년간 보관하며, 보관 기간 경과 또는 회원 탈퇴 시 지체없이 파기합니다.',
      },
      {
        title: '6. 동의 거부 권리 및 불이익',
        body: '회원은 개인정보의 국외이전에 대한 동의를 거부할 권리가 있습니다. 다만 동의를 거부할 경우 자국 병원과의 협진 서비스 이용이 제한될 수 있습니다.',
      },
    ],
  },
  {
    key: 'marketing',
    label: '마케팅 정보 수신 동의 (선택)',
    required: false,
    detail: '이벤트 및 혜택 정보를 이메일/알림으로 받아볼 수 있습니다.',
  },
  {
    key: 'location',
    label: '위치 정보 공유 동의 (선택)',
    required: false,
    detail: '주변 병원 추천 등에 위치 정보를 활용할 수 있습니다.',
  },
];

const Step2Terms = ({ onNext }) => {
  const isHospital = useAuthStore((state) => state.role === 'hospital');
  const terms = useSignupStore((state) => state.terms);
  const setTerm = useSignupStore((state) => state.setTerm);
  const setAllTerms = useSignupStore((state) => state.setAllTerms);

  const [expandedKey, setExpandedKey] = useState(null);

  const visibleTerms = TERMS_CONFIG.filter((term) => !term.patientOnly || !isHospital);
  const requiredKeys = visibleTerms.filter((term) => term.required).map((term) => term.key);

  const allChecked = visibleTerms.every((term) => terms[term.key]);
  const canSubmit = requiredKeys.every((key) => terms[key]);

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-6">
      <p className="font-wantedsans text-base font-medium leading-[1.4] text-[#181818]">
        서비스 이용을
        <br />
        위해 아래 약관에 동의해주세요.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {visibleTerms.map((term) => (
          <ConsentCheckbox
            key={term.key}
            label={term.label}
            checked={terms[term.key]}
            onChange={(next) => setTerm(term.key, next)}
            expandable
            expanded={expandedKey === term.key}
            onToggleExpand={() => setExpandedKey((prev) => (prev === term.key ? null : term.key))}
          >
            {term.sections ? (
              <div className="flex flex-col gap-3">
                {term.sections.map((section) => (
                  <div key={section.title}>
                    <p className="font-wantedsans text-xs font-semibold text-[#181818]">{section.title}</p>
                    <p className="mt-1 font-wantedsans text-[0.6875rem] font-normal leading-4.5 text-[#8C8C8C]">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <p className="font-wantedsans text-[0.6875rem] font-normal leading-4.5 text-[#8C8C8C]">
                  {term.detail}
                </p>
                <p className="font-wantedsans text-[0.6875rem] font-normal leading-4.5 text-[#8C8C8C]">
                  더 자세한 상세 약관은 준비 중입니다.
                </p>
              </div>
            )}
          </ConsentCheckbox>
        ))}
      </div>

      <div className="mt-6">
        <ConsentCheckbox label="모두 동의합니다" checked={allChecked} onChange={(next) => setAllTerms(next)} />
      </div>

      <Button variant="primary" className="mt-8" disabled={!canSubmit} onClick={onNext}>
        완료
      </Button>
    </div>
  );
};

export default Step2Terms;
