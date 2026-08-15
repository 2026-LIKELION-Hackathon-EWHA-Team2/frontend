// [intro] 케이스 등록 안내 및 시작하기 버튼 화면
import CircleVerticalTimeline from '../../../../components/CircleVerticalTimeline'

const STEP_ITEMS = [
  { label: '사진 입력 (선택)', description: '시술 부위 사진을 첨부합니다.' },
  { label: '증상 입력', description: '부위·시작일·강도를 기록합니다.' },
  { label: '진단서 입력', description: '발급받은 진단서를 업로드합니다.' },
];

const Step0Intro = () => {
  return (
    <>
      <img src="/icons/case-intro-doc.svg" alt="" className="mb-5 h-25 w-25" />
      <h2 className="mb-3 text-center text-[#181818] font-wantedsans text-[1.5rem] font-medium leading-normal">케이스 등록</h2>
      <p className="mb-[2.31rem] text-center text-[#626262] font-wantedsans text-[0.8125rem] font-medium leading-[1.25rem]">
        사진, 증상, 진단서 정보를 순서대로 입력하면
        <br />
        자국 병원과의 협진에 활용돼요
      </p>

      <div className="mb-8 w-full text-left">
      <CircleVerticalTimeline items={STEP_ITEMS} />
      </div>
    </>
  );
};

export default Step0Intro;