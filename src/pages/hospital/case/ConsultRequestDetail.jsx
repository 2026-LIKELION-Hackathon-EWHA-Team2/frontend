// 협진 요청 상세 (협진 시작하기 버튼 있는 화면)

// 백엔드 연동 시 참고할 부분입니당.
// useConsultPatientDetailQuery(id) 내부의 mock fetch만 실제 단건 조회 API로 교체할 것.
// 협진 시작하기 버튼은 지금은 채팅방으로 바로 이동만 시키는데,
// 협진 시작 API 호출 후 성공 시 이동하도록 바꿔야 할 거 같습니다.. 예상?이에요 아닐 수도

import { useNavigate, useParams } from 'react-router-dom';

import Header from '../../../components/layout/Header';
import PageContainer from '../../../components/layout/PageContainer';
import Button from '../../../components/button/Button';
import SmallButton from '../../../components/button/SmallButton';
import CaseSummaryCard from '../../../components/card/CaseSummaryCard';
import QueryState from '../../../components/state/QueryState'
import { useConsultPatientDetailQuery } from '../../../hooks/useMockQueries';

// 섹션(아이콘 + 텍스트)
const SectionTitle = ({ icon, children }) => (
  <div className="mb-2 flex items-center gap-1">
    <img src={icon} alt="" className="h-4.75 w-4.75" />
    <h2 className="text-[#181818] font-wantedsans text-sm font-medium leading-4.5">{children}</h2>
  </div>
);

const ConsultRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: detail, isLoading } = useConsultPatientDetailQuery(id);

  // 협진 시작하기 클릭 -> 나중에 api 호출로!
  const handleStartConsult = () => {
    navigate(`/hospital/chat/room/${id}`);
  };

  // 완료된 케이스는 최종 합의안(협진 합의 4단계)으로 이동
  const handleViewAgreement = () => {
    navigate(`/hospital/chat/agreement/${id}`, { state: { initialStep: 4 } });
  };

  if (isLoading) {
    return (
      <>
        <Header title="협진 요청 상세" showBack rightSlot={<></>} />
        <PageContainer>
        <QueryState isLoading={true}/>
        </PageContainer>
      </>
    );
  }

  if (!detail) {
    return (
      <>
        <Header title="협진 요청 상세" showBack rightSlot={<></>} />
        <PageContainer>
        <QueryState isError={true} errorMessage="해당 케이스 정보를 찾을 수 없습니다"/>
        </PageContainer>
      </>
    );
  }

  return (
    <>
    <div className="flex h-[calc(100dvh-4.875rem)] flex-col bg-white">
      <Header title="협진 요청 상세" showBack rightSlot={<></>} />

      <PageContainer>
        <p className="mb-8 text-[#626262] font-wantedsans text-[0.625rem] font-normal leading-normal text-center">
          CROSS-BORDER COLLABORATION RECORD
        </p>

        <CaseSummaryCard
          patientName={detail.name}
          caseId={detail.caseId}
          consultType={detail.consultType}
          hospital={detail.hospital}
          requestedAt={detail.requestedAt}
          className="mb-6"
          rightContent={
            <SmallButton variant="arrow" label="상세 보기" to={`/hospital/case/${id}`} />
          }
        />

        <SectionTitle icon="/icons/docs-check.svg">시술 정보</SectionTitle>
        <div className="mb-2.5 rounded-[0.625rem] border border-[#EDEDF1] px-3 py-1.5">
          {[
            ['시술명', detail.procedureName],
            ['시술 부위', detail.procedureArea],
            ['시술 일자', detail.procedureDate],
          ].map(([label, value], i, arr) => (
            <div
              key={label}
              className={`flex items-center py-1 ${
                i !== arr.length - 1 ? 'border-b border-[#EDEDF1]' : ''
              }`}
            >
              <span className="w-24 shrink-0 text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-4.5">{label}</span>
              <span className="text-[#626262] font-wantedsans text-[0.6875rem] font-medium leading-4.5">{value}</span>
            </div>
          ))}
        </div>

        <SectionTitle icon="/icons/flask.svg">약물 재료 성분명</SectionTitle>
        <div className="mb-2.5 flex flex-col gap-1">
          {detail.ingredients.map((ingredient) => (
            <div
              key={ingredient}
              className="rounded-[0.625rem] border border-[#EDEDF1] bg-white px-3 py-1 text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-4.5"
            >
              {ingredient}
            </div>
          ))}
        </div>

        <SectionTitle icon="/icons/chat-check.svg">의료진 소견</SectionTitle>
        <div className="rounded-[0.625rem] border border-[#EDEDF1] px-3 py-1 text-[#181818] font-wantedsans text-[0.6875rem] font-medium leading-4.5">
          {detail.doctorNote}
        </div>
        </PageContainer>

        <div className="flex flex-col px-5.5 pb-[0.83rem] pt-1.5">
        {detail.status === 'done' ? (
          <Button variant="primary" onClick={handleViewAgreement}>
            최종 합의안 보기
          </Button>
        ) : (
          <Button variant="primary" onClick={handleStartConsult}>
            협진 시작하기
          </Button>
        )}
        </div>
      </div>
    </>
  );
};

export default ConsultRequestDetail;