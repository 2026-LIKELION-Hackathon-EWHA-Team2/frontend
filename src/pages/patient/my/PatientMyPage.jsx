// 2-2 프로필

import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import QueryState from '../../../components/state/QueryState';
import ListButton from '../../../components/button/ListButton';
import { usePatientProfileQuery } from '../../../hooks/useMockQueries';

const getInfoRows = (patient) => [
  { icon: '/icons/profile-name.svg', label: '이름', value: patient.name },
  { icon: '/icons/profile-birth.svg', label: '생년월일', value: patient.birth },
  { icon: '/icons/profile-adress.svg', label: '주소', value: patient.address },
  { icon: '/icons/profile-phone.svg', label: '전화번호', value: patient.phone },
];

const PatientMyPage = () => {
  const { data: patient, isLoading, isError } = usePatientProfileQuery();

  return (
    <>
      <Header title="프로필" showBack rightSlot={<></>} />

      <PageContainer className="flex flex-col gap-6 pt-6 pb-10">
        <QueryState isLoading={isLoading} isError={isError} isEmpty={!patient}>
          {patient && (
            <>
              <section className="flex items-center gap-4 rounded-[10px] border border-[#EDEDF1] bg-white px-4 py-6 shadow-[-1px_-1px_10px_0_rgba(192,192,192,0.01),1px_1px_20px_0_rgba(192,192,192,0.40)]">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
                  <img src="/icons/profile-gray.svg" alt="" className="h-7 w-5.5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-wantedsans text-lg font-semibold text-[#181818]">{patient.name}</p>
                  <p className="font-wantedsans text-xs font-normal text-[#8C8C8C]">
                    여권번호 <span className="ml-1">{patient.passportNumber}</span>
                  </p>
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-wantedsans text-sm font-bold text-[#181818]">기본 정보</h2>
                <div className="flex flex-col gap-4 rounded-[10px] border border-[#EDEDF1] bg-white px-5 py-5">
                  {getInfoRows(patient).map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={row.icon} alt="" className="h-5 w-5" />
                        <span className="font-wantedsans text-sm font-medium text-[#181818]">{row.label}</span>
                      </div>
                      <span className="font-wantedsans text-sm font-normal text-[#686868]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <ListButton label="시술 이력 (여권)" to="/patient/my/passport" />
            </>
          )}
        </QueryState>
      </PageContainer>
    </>
  );
};

export default PatientMyPage;
