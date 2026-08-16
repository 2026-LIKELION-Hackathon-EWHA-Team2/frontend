import Badge from '../Badge';
import SmallButton from '../button/SmallButton';

// 병원 홈 - 진행 중 협진 카드
// props: patient ({ id, caseId, name, gender, age, consultType, hospital, requestedAt })

const ConsultPatientCard = ({ patient }) => {
  return (
    <div className="flex items-start gap-3 rounded-[10px] border border-[#EDEDF1] p-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F1F0F3]">
        <img src="/icons/home-case.svg" alt="" className="h-7 w-7" />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="font-wantedsans text-[16px] font-medium text-[#181818]">
            Case #{patient.caseId}
          </span>
          <Badge tone="blue" size="lg">
            검토중
          </Badge>
        </div>
        <p className="mb-0.5 font-wantedsans text-[11px] font-normal text-[#626262]">
          {patient.name} ({patient.gender}, {patient.age}세) &nbsp;|&nbsp; {patient.consultType}
        </p>

        <div className="mt-1.5 flex items-center gap-1">
          <img src="/icons/case-hospital.svg" alt="" className="h-3 w-3" />
          <span className="font-wantedsans text-xs font-normal text-[#737373]">{patient.hospital}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <img src="/icons/case-clock.svg" alt="" className="h-3 w-3" />
            <span className="font-wantedsans text-xs font-normal text-[#737373]">
              요청시간 {patient.requestedAt}
            </span>
          </div>
          <SmallButton variant="arrow" label="협진 마무리" to={`/hospital/case/${patient.id}`} />
        </div>
      </div>
    </div>
  );
};

export default ConsultPatientCard;
