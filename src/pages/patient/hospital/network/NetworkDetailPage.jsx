// 병원 상세 보기 (matching의 Step3Detail과 동일)

import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../../components/layout/Header';
import PageContainer from '../../../../components/layout/PageContainer';
import QueryState from '../../../../components/state/QueryState';
import Badge from '../../../../components/Badge';
import Button from '../../../../components/button/Button';
import { useNetworkHospitalDetailQuery, useSelectNetworkHospitalMutation } from '../../../../hooks/useMockQueries';
import useHospitalMatchStore from '../../../../store/useHospitalMatchStore';
import useToastStore from '../../../../store/useToastStore';

const INFO_ROWS = [
  { key: 'address', icon: '/icons/location-black.svg', label: '주소' },
  { key: 'business_hours', icon: '/icons/clock-black.svg', label: '진료 시간' },
  { key: 'phone', icon: '/icons/phone-black.svg', label: '전화번호' },
  { key: 'website', icon: '/icons/earth-black.svg', label: '웹사이트' },
  { key: 'description', icon: '/icons/info-black.svg', label: '병원 소개' },
];

const NetworkDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCaseId, setSelectedHospitalId, setSelectedRecommendationId, setMatchRequestId, setPartnerHospital } =
    useHospitalMatchStore();
  const showToast = useToastStore((state) => state.showToast);
  const selectNetworkHospital = useSelectNetworkHospitalMutation();
  const { data: hospital, isLoading, isError } = useNetworkHospitalDetailQuery(id);

  // 이 화면(네트워크 직접 선택)도 선택 API를 호출하면 서버가 match_request/recommendation을
  // 새로 만들어줘서, 이후로는 AI 추천 병원을 선택했을 때와 완전히 동일한 흐름(동의 -> 전송)을 탄다
  const handleApply = () => {
    selectNetworkHospital.mutate(
      { hospitalId: hospital.hospital_id, symptomCaseId: selectedCaseId },
      {
        onSuccess: (data) => {
          setMatchRequestId(data.match_request_id);
          setSelectedHospitalId(data.partner_hospital_id);
          setSelectedRecommendationId(data.recommendation_id);
          setPartnerHospital({
            partnerHospitalId: data.partner_hospital_id,
            partnerHospitalUserId: data.partner_hospital_user_id,
            partnerHospitalName: data.partner_hospital_name,
          });
          // AI 추천 병원 선택 때와 동일하게 매칭 동의를 먼저 받아야 해서, 케이스 동기화가 아니라
          // 매칭 플로우로 보냄 (AiMatchingPage가 personalInfoAgreed를 보고 동의 화면부터 띄워줌)
          navigate('/patient/hospital/matching');
        },
        onError: () => {
          showToast('병원 선택에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  return (
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title={hospital?.name ?? '병원 상세'} showBack rightSlot={<></>} />

      <QueryState isLoading={isLoading} isError={isError} isEmpty={!isLoading && !hospital}>
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
                    {hospital.distance_km}km
                  </span>
                </div>
                {hospital.collaboration_count > 0 && (
                  <Badge tone="info" rounded="full" size="lg">
                    협진 경험 {hospital.collaboration_count}회
                  </Badge>
                )}
              </div>

              {/* 평균 소요 시간/지원 언어는 이 API 응답에 없는 필드라 임의 값 없이 생략함 (Step3Detail과 동일 처리) */}

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
              <Button variant="primary" disabled={selectNetworkHospital.isPending} onClick={handleApply}>
                {selectNetworkHospital.isPending ? '신청 중...' : '이 병원으로 매칭 신청'}
              </Button>
            </div>
          </>
        )}
      </QueryState>
    </div>
  );
};

export default NetworkDetailPage;