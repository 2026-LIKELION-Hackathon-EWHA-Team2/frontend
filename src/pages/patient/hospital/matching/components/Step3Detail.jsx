// 병원 상세 보기 (네트워크 병원 상세보기와 동일)

import Header from '../../../../../components/layout/Header';
import PageContainer from '../../../../../components/layout/PageContainer';
import QueryState from '../../../../../components/state/QueryState';
import Badge from '../../../../../components/Badge';
import Button from '../../../../../components/button/Button';
import { useHospitalListQuery } from '../../../../../hooks/useMockQueries';
import useHospitalMatchStore from '../../../../../store/useHospitalMatchStore';

const INFO_ROWS = [
  { key: 'address', icon: '/icons/location-black.svg', label: '주소' },
  { key: 'hours', icon: '/icons/clock-black.svg', label: '진료 시간' },
  { key: 'phone', icon: '/icons/phone-black.svg', label: '전화번호' },
  { key: 'website', icon: '/icons/earth-black.svg', label: '웹사이트' },
  { key: 'intro', icon: '/icons/info-black.svg', label: '병원 소개' },
];

const Step3Detail = ({ nextStep, prevStep }) => {
  const { data: hospitals, isLoading, isError } = useHospitalListQuery();
  const { selectedHospitalId } = useHospitalMatchStore();

  const hospital = hospitals?.find((item) => item.id === selectedHospitalId);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={hospital?.name ?? '병원 상세'} showBack onBack={prevStep}  rightSlot={<></>}/>

      <QueryState isLoading={isLoading} isError={isError} isEmpty={!isLoading && !hospital}>
        {hospital && (
          <>
            <p className="mt-1 text-center font-wantedsans text-xs font-medium leading-normal text-[#626262]">
              {hospital.department}
            </p>

            <div className="mt-4 flex h-45 w-full items-center justify-center overflow-hidden bg-[#A78AF4]/10">
              <img src="/icons/case-hospital.svg" alt="" className="h-12 w-12 opacity-40" />
            </div>

            <PageContainer className="-mt-5 flex flex-1 flex-col rounded-t-[1.25rem] bg-white pt-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <img src="/icons/location-black.svg" alt="" className="h-3 w-3" />
                  <span className="font-wantedsans text-[10px] font-medium leading-normal text-[#626262]">
                    {hospital.distance}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <img src="/icons/clock-black.svg" alt="" className="h-3 w-3" />
                  <span className="font-wantedsans text-[10px] font-medium leading-normal text-[#626262]">
                    평균 {hospital.avgTime}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                <Badge tone="info" rounded="full" size="lg">
                  외국어 지원 ({hospital.languages.join('/')})
                </Badge>
                {hospital.hasConsultExperience && (
                  <Badge tone="info" rounded="full" size="lg">
                    협진 경험 있음
                  </Badge>
                )}
              </div>

              <p className="mt-6 font-wantedsans text-sm font-medium leading-normal text-black">진료 분야</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {hospital.fields.map((field) => (
                  <Badge key={field} tone="info" rounded="full" size="lg">
                    {field}
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

              <div className="mt-auto pt-8">
                <Button variant="primary" onClick={nextStep}>
                  이 병원으로 매칭 신청
                </Button>
              </div>
            </PageContainer>
          </>
        )}
      </QueryState>
    </div>
  );
};

export default Step3Detail;
