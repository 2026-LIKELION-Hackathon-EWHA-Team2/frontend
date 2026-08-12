/**
 * span 느낌의 badge component
 * tone: 색상 - 주석 참고해서 선택
 * icon: 앞에 붙일 아이콘 - 주로 체크표시
 * rounded: 주석 참고해서 선택
 * size: 주석 참고해서 선택
 */

const TONE_CLASSES = {
    orange : 'bg-[#F7E6D3] text-[#9E580A]', /*진단서 대기중*/
    purple: 'bg-[#EEE7FF] text-[#6B5DD6]', /* 신속 협진 진행중 */
    blue: 'bg-[#EDF2FA] text-[#0042B3]', /* AI 분석 완료 */
    mint: 'bg-[#E9F5F3] text-[#0EA7AA]', /* 진단 완료 */
    gray: 'bg-[#F5F5F5] text-[#686868]', /*진단서 없음 */
    check: 'bg-[#A78AF4]/10 text-[#333333]', /* 철회 완료 */
    med: 'bg-[#F2F2F3] text-[#757575]', /*주사, 반영구 등 */
    symptom: 'bg-[#A78AF4]/10 text-[#181818]', /* 붓기, 가려움 등 미리보기용 */
    bsymptom: 'border border-[#A78AF4] bg-[#F2F2FF] text-[#6B5DD6]', /*테두리 있는 증상들 병원전달용*/
    sum: 'bg-[#A78AF4]/10 text-[#6B5DD6]', /*협진 ai 요약의 경미, 권장 등*/
    info: 'bg-[#A78AF4]/10 text-[#626262]', /* 병원 정보 */
  };
  
  const ROUNDED_CLASSES = {
    full: 'rounded-full', /* 붓기, 가려움 등, 병원 정보, 경미, 없음, 권장*/
    lg: 'rounded-lg', /*주사, 반영구 등 */
    md: 'rounded-[0.375rem]', /*진단서 대기중*/
    sm: 'rounded', /*철회완료*/
  };
  
  const SIZE_CLASSES = {
    sm: 'px-[0.375rem] py-[0.25rem] font-wantedsans text-[0.5rem] font-medium leading-[0.625rem]', /* 철회 완료 */
    md: 'px-[0.375rem] py-[0.0625rem] font-wantedsans text-[0.5rem] font-medium leading-4', /* 주사, 반영구 등 */
    ml: 'px-[0.625rem] py-[0.3125rem] font-wantedsans text-[0.5625rem] font-medium leading-[0.875rem]', /*진단서 대기중*/
    lg: 'px-[0.5rem] py-[0.25rem] font-wantedsans text-[0.625rem] font-medium leading-normal', /* 병원 정보, 협진 요약의 경미,권장 */
    xl: 'px-[0.625rem] py-[0.1875rem] font-wantedsans text-[0.625rem] font-medium leading-[0.875rem]', /*테두리 있는 증상들 병원전달용 */
    xxl: 'px-[0.75rem] py-[0.25rem] font-wantedsans text-[0.625rem] font-medium leading-normal', /* 붓기, 가려움 등 미리보기용 */
  };
  
 
  const Badge = ({
    children,
    tone = 'orange',
    icon,
    rounded = 'md',
    size = 'ml',
  }) => {
    return (
      <span
        className={`inline-flex items-center ${SIZE_CLASSES[size]} ${ROUNDED_CLASSES[rounded]} ${TONE_CLASSES[tone]}`}
      >
        {icon}
        {children}
      </span>
    );
  };
  
  export default Badge;