// 병원 상세 보기 (네트워크 병원 상세보기와 동일)

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import QueryState from '../../../../../components/state/QueryState';
import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/button/Button';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';
import useToastStore from '../../../../../store/useToastStore';
import { useSelectMatchRecommendationMutation } from '../../../../../hooks/useMockQueries';

const INFO_ROWS = [
  { key: 'address', icon: '/icons/location-black.svg', label: '주소' },
  { key: 'business_hours', icon: '/icons/clock-black.svg', label: '진료 시간' },
  { key: 'phone', icon: '/icons/phone-black.svg', label: '전화번호' },
  { key: 'website', icon: '/icons/earth-black.svg', label: '웹사이트' },
  { key: 'description', icon: '/icons/info-black.svg', label: '병원 소개' },
];

const Step3Detail = ({ nextStep, prevStep }) => {
  const { recommendedHospitals, selectedHospitalId, selectedRecommendationId, setPartnerHospital } =
    useHospitalMatchStore();
  const showToast = useToastStore((state) => state.showToast);
  const selectRecommendation = useSelectMatchRecommendationMutation();

  // recommendedHospitals는 Step1Setting에서 매칭 응답을 그대로 저장해둔 것이라 별도 API 호출 없이 바로 조회
  const recommendation = recommendedHospitals.find((r) => r.hospital.hospital_id === selectedHospitalId);
  const hospital = recommendation?.hospital;

  const handleSelect = () => {
    selectRecommendation.mutate(selectedRecommendationId, {
      onSuccess: (data) => {
        // 서버가 이 시점에 기존 매칭 동의 4개 항목을 전부 초기화하므로, 재선택 케이스를 대비해
        // personalInfoAgreed도 setPartnerHospital 안에서 같이 false로 리셋함
        setPartnerHospital({
          partnerHospitalId: data.partner_hospital_id,
          partnerHospitalUserId: data.partner_hospital_user_id,
          partnerHospitalName: data.partner_hospital_name,
        });
        nextStep();
      },
      onError: () => {
        showToast('병원 선택에 실패했습니다. 다시 시도해주세요.');
      },
    });
  };

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title={hospital?.name ?? '병원 상세'} showBack onBack={prevStep}  rightSlot={<></>}/>

      <QueryState isLoading={false} isError={false} isEmpty={!hospital}>
        {hospital && (
          <>
            <p className="mt-1 text-center font-wantedsans text-xs font-medium leading-normal text-[#626262]">
              {hospital.specialties.map((s) => s.specialty_name).join(', ')}
            </p>

            <div className="mt-4 flex h-45 w-full items-center justify-center overflow-hidden bg-[#A78AF4]/10">
              {hospital.image_url ? (
                <img src={hospital.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <img src="/icons/case-hospital.svg" alt="" className="h-12 w-12 opacity-40" />
              )}
            </div>

            <PageContainer className="-mt-5 flex flex-1 flex-col rounded-t-[1.25rem] bg-white pt-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <img src="/icons/location-black.svg" alt="" className="h-3 w-3" />
                  <span className="font-wantedsans text-[10px] font-medium leading-normal text-[#626262]">
                    {recommendation.distance_km}km
                  </span>
                </div>
                {hospital.collaboration_count > 0 && (
                  <Badge tone="info" rounded="full" size="lg">
                    협진 경험 {hospital.collaboration_count}회
                  </Badge>
                )}
              </div>

              {/* 평균 소요 시간/지원 언어는 이 API 응답에 없는 필드라 임의 값 없이 생략함 - 백엔드 필드 추가 여부 협의 필요 */}

              <p className="mt-6 font-wantedsans text-sm font-medium leading-normal text-black">진료 분야</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {hospital.specialties.map((specialty) => (
                  <Badge key={specialty.hospital_specialty_id} tone="info" rounded="full" size="lg">
                    {specialty.specialty_name}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-6">
                {INFO_ROWS.map(({ key, icon, label }) => (
                  <div key={key} className="flex items-start gap-2">
                    <img src={icon} alt="" className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="w-14 shrink-0 font-wantedsans text-[13px] font-medium leading-normal text-black">
                      {label}
                    </span>
                    {key === 'website' ? (
                      <a
                        href={hospital.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 font-wantedsans text-[11px] font-normal leading-normal text-[#3B82F6] underline"
                      >
                        {hospital.website}
                      </a>
                    ) : (
                      <span className="flex-1 whitespace-pre-line font-wantedsans text-[11px] font-normal leading-normal text-[#626262]">
                        {hospital[key]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </PageContainer>

            <div className="px-5.5 pb-6 pt-3">
              <Button variant="primary" disabled={selectRecommendation.isPending} onClick={handleSelect}>
                {selectRecommendation.isPending ? '신청 중...' : '이 병원으로 매칭 신청'}
              </Button>
            </div>
          </>
        )}
      </QueryState>
    </div>
  );
};

export default Step3Detail;