import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Header from '../../components/layout/Header'
import PageContainer from '../../components/layout/PageContainer'

import Button from '../../components/button/Button';
import ListButton from '../../components/button/ListButton';
import QuickLaunch from '../../components/button/QuickLaunch';
import SmallButton from '../../components/button/SmallButton';
import ResultActionButton from '../../components/button/ResultActionButton';

import PillToggle from '../../components/toggle/PillToggle';
import DotToggle from '../../components/toggle/DotToggle';
import PageToggle from '../../components/toggle/PageToggle';
import ChipToggle from '../../components/toggle/ChipToggle';
import TextChipToggle from '../../components/toggle/TextChipToggle';

import ConsultCard from '../../components/card/ConsultCard';

/* 컴포넌트 확인용 페이지 - 자유롭게 쓰시면 됩니다!
path: /dev/components */

const CheckComponentsPage = () => {
  const [gender, setGender] = useState('여성');
  const [treatmentTime, setTreatmentTime] = useState('시술직후');

  const [painLevel, setPainLevel] = useState('보통');

  const [docMethod, setDocMethod] = useState('진단서 불러오기');
  const [historyType, setHistoryType] = useState('동의 철회 이력');

  const [selectedAreas, setSelectedAreas] = useState(['face']); // 기본값으로 얼굴 선택
  const [customArea, setCustomArea] = useState(''); // 직접 추가 텍스트 상태

  // 증상 부위 옵션 데이터 (총 6개)
  const symptomOptions = [
    { id: 'face', label: '얼굴', icon: '/icons/symptom-area-face.svg' },
    { id: 'chest', label: '가슴', icon: '/icons/symptom-area-chest.svg' },
    { id: 'eyes', label: '눈', icon: '/icons/symptom-area-eyes.svg' },
    { id: 'lips', label: '입술', icon: '/icons/symptom-area-lips.svg' },
    { id: 'nose', label: '코', icon: '/icons/symptom-area-nose.svg' },
    { id: 'custom', label: '직접 추가', icon: '/icons/symptom-area-plus.svg', isInput: true },
  ];

  // 부작용 다중 선택용 상태 추가 (배열)
  const [sideEffects, setSideEffects] = useState(['부종']); 

  // 부작용 옵션 리스트
  const sideEffectOptions = [
    '부종', '염증', '통증', '붉어짐', '감염 의심', '색소침착'
  ];

  // 상태 관리 추가
  const [selectedCard, setSelectedCard] = useState(null);


  return (
    <>
    <Header title="확인" showBack />
    <PageContainer className='px-6 py-6 flex flex-col gap-8'>
        <h1 className="text-xl font-bold text-ink-900">공통 컴포넌트 check!!</h1>
    
    {/* 버튼 테스트 영역 시작 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">1. 기본 버튼</h2>
        
        <div className="flex flex-col gap-3">
          {/* 활성화 상태 테스트 */}
          <Button disabled={false} >
            다음 (활성화 버튼)
          </Button>


          {/* 비활성화 상태 테스트 */}
          <Button disabled={true}>
            다음 (비활성화 버튼)
          </Button>

          {/* 하얀색 테두리 버튼 */}
          <Button variant="outline" disabled={false}>
            하얀색 테두리 버튼
          </Button>

          {/* 그림자가 있는 버튼 테스트 */}
          <Button variant="primary-shadow" disabled={false}>
            확인 (그림자 있는 버튼)
          </Button>

          {/* 하얀색 테두리 그림자 버튼 */}
          <Button variant="outline-shadow" disabled={false}>
            하얀색 테두리 그림자 버튼
          </Button>

          {/* 가로 반반 분할 버튼 레이아웃 (거부하기 / 동의합니다) */}
          <div className="mt-4 pt-4">
            
            <div className="flex w-full items-center justify-between gap-2.5">
              <Button variant="outline">
                거부하기
              </Button>
              <Button variant="primary" className="text-[16px]!">
                동의합니다
              </Button>
            </div>
          </div>

          {/* underline 버튼 */}
          <div className="flex justify-center mt-2">
            <Button 
              variant="underline" 
            >
              회원가입
            </Button>

           </div>
        </div>
      </section>

      {/* ListButton 테스트 영역 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">2. 리스트형 버튼</h2>
        
        <div className="flex flex-col gap-4">
          <ListButton 
            label="동의 철회 / 공유 이력" 
          />
          <ListButton 
            label="프로필 수정" 
          />
        </div>
      </section>

      {/* QuickLaunch 테스트 영역 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">3. 빠른 실행 버튼 (QuickLaunch)</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <QuickLaunch 
            title="증상 입력" 
            description="현재 증상을 자세히 입력하세요" 
            iconPath="/icons/home-camera.svg" 
          />
          <QuickLaunch 
            title="진단서 등록" 
            description={
              <>
                진단서를<br />업로드하세요
              </>
            } 
            iconPath="/icons/home-case.svg" 
          />
          <QuickLaunch 
            title="협진 요청함" 
            description="수신 케이스 확인" 
            iconPath="/icons/home-inbox.svg" 
          />
          <QuickLaunch 
            title="환자 조회" 
            description="요청 환자 조회" 
            iconPath="/icons/home-patient.svg" 
          />
        </div>
      </section>

      {/* SmallButton 테스트 영역 */}
      <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-800">4. 작은 기능 버튼</h2>
        
        <div className="flex flex-col gap-4">
          {/* 수정 버튼, 화살표 버튼 */}
          <div className="flex flex-wrap gap-3 items-center">
            <SmallButton variant="edit" label="수정" />
            <SmallButton label="상세 보기"/>
            <SmallButton label="미리보기" />
            <SmallButton label="변경" />
          </div>

          {/* 드롭다운(필터) 버튼 테스트 영역 */}
          <div className="flex flex-wrap gap-2 items-center">
            <SmallButton variant="dropdown" label="최신순" />
            <SmallButton variant="dropdown" label="거리순" />
            <SmallButton variant="dropdown" label="협진 경험순" />
            <SmallButton variant="dropdown" label="전문 분야 일치순" />
          </div>
        </div>
      </section>

      {/* 결과 액션 버튼 테스트 영역 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">5. 결과 버튼</h2>
        
        {/* 두 버튼이 가로로 나란히 배치되도록 flex 적용 */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* 공유하기 버튼 */}
          <ResultActionButton variant="share" />
          
          {/* 다운로드(PDF) 버튼 */}
          <ResultActionButton variant="download" />
          
        </div>
      </section>
  
      {/* PillToggle 테스트 영역 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-gray-800">6. 토글 버튼 (PillToggle)</h2>
          
          <div className="flex flex-col gap-6">
            
            {/* 남성/여성 선택 토글 */}
            <div className="flex flex-col gap-3">
              <span className="font-wantedsans text-sm font-bold text-gray-800">성별 (선택)</span>
              <PillToggle 
                options={['여성', '남성']} 
                selectedValue={gender} 
                onChange={setGender} 
              />
            </div>

            {/* 시술 시기 선택 토글 */}
            <div className="flex flex-col gap-3">
              <span className="font-wantedsans text-sm font-bold text-gray-800">시술 시기</span>
              <PillToggle 
                options={['시술 직후', '시술 후 며칠 뒤']} 
                selectedValue={treatmentTime} 
                onChange={setTreatmentTime} 
              />
            </div>
            
          </div>
        </section>

        {/* 통증 정도 토글 테스트 영역 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-gray-800">7. 통증 정도 토글 (DotToggle)</h2>
          
          <div className="flex flex-col gap-4">
            <span className="font-wantedsans text-sm font-bold text-gray-800">통증 정도</span>
            
            <DotToggle 
              options={['없음', '약간', '보통', '심함', '매우 심함']} 
              selectedValue={painLevel} 
              onChange={setPainLevel} 
            />
          </div>
        </section>

        {/* 페이지 전환 토글 테스트 영역 */}
        <section className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold text-gray-800">8. 페이지 탭 토글 (PageToggle)</h2>
          
          <div className="flex flex-col gap-6">
            
            {/* 진단서 첨부 방식 토글 */}
            <div className="flex flex-col gap-3">
              <span className="font-wantedsans text-sm font-bold text-gray-800">진단서 첨부 방식</span>
              <PageToggle 
                options={['진단서 불러오기', '직접 업로드']} 
                selectedValue={docMethod} 
                onChange={setDocMethod} 
              />
            </div>

            {/* 이력 조회 탭 토글  */}
            <div className="flex flex-col gap-3">
              <span className="font-wantedsans text-sm font-bold text-gray-800">이력 조회</span>
              <PageToggle 
                variant="underline" 
                options={['동의 철회 이력', '공유 이력']} 
                selectedValue={historyType} 
                onChange={setHistoryType} 
              />
            </div>
          </div>
        </section>

        {/* 다중 선택 칩 토글 (ChipToggle) 테스트 영역 */}
        <section className="flex flex-col gap-6 pb-10">
          <h2 className="text-lg font-semibold text-gray-800">9. 다중 선택 칩 (ChipToggle)</h2>
          
          <div className="flex flex-col gap-4">
            <span className="font-wantedsans text-sm font-bold text-gray-800">증상 부위</span>
            
            <ChipToggle 
              options={symptomOptions}
              selectedValues={selectedAreas}
              onChange={setSelectedAreas}
              customValue={customArea}
              onCustomChange={setCustomArea}
            />
          </div>
        </section>

        {/* 텍스트 다중 선택 칩 (TextChipToggle) 테스트 영역 */}
        <section className="flex flex-col gap-6 pb-10">
          <h2 className="text-lg font-semibold text-gray-800">10. 텍스트 다중 선택 (TextChipToggle)</h2>
          
          <div className="flex flex-col gap-4">
            <span className="font-wantedsans text-sm font-bold text-gray-800">부작용 유형</span>
            
            <TextChipToggle 
              options={sideEffectOptions}
              selectedValues={sideEffects}
              onChange={setSideEffects}
            />
          </div>
        </section>

        {/* 협진 카드 (ConsultCard) 테스트 영역 */}
        <section className="flex flex-col gap-6 pb-10">
          <h2 className="text-lg font-semibold text-gray-800">11. 협진 카드 (ConsultCard)</h2>
          
          <div className="flex flex-col gap-4">
            <ConsultCard 
            />

            <ConsultCard 
              caseId="2026-0708"
              hospitalName="Seoul Medical"
              date="2026.08.15"
              status="진단서 대기중"
            />
          </div>
        </section>
        


    </PageContainer>
    </>
);
};

export default CheckComponentsPage;