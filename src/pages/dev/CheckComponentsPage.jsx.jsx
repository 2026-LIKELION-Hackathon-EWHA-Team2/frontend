import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Header from '../../components/layout/Header'
import PageContainer from '../../components/layout/PageContainer'

import MultiSelectToggle from '../../components/toggle/MultiSelectToggle';
import Button from '../../components/button/Button';
import SmallButton from '../../components/button/SmallButton';


/* 컴포넌트 확인용 페이지 - 자유롭게 쓰시면 됩니다!
path: /dev/components */

const CheckComponentsPage = () => {

    // 복수 선택 토글 상태 관리
  const [selectedLanguages, setSelectedLanguages] = useState(['영어']);

  // 토글에 들어갈 옵션 데이터
  const languageOptions = [
    { label: '영어', value: '영어' },
    { label: '중국어', value: '중국어' },
    { label: '일본어', value: '일본어' },
  ];

  return (
    <>
    <Header title="확인" showBack />
    <PageContainer className='px-6'>
        <h1 className="text-xl font-bold text-ink-900">공통 컴포넌트 check!!</h1>
        {/* 1. 언어 지원 복수 선택 토글                 */}
        <section className="flex flex-col gap-4">
          
          {/* 테스트 번호 제목 */}
          <h2 className="font-wantedsans text-lg mt-5 font-bold text-gray-800">
            1. 복수 선택 토글 (MultiSelectToggle)
          </h2>
          
          <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4">
            
            {/* 타이틀 영역 */}
            <div className="flex items-center gap-1.5">
              <span className="font-wantedsans text-[16px] font-bold text-[#181818]">
                언어 지원
              </span>
              <span className="font-wantedsans text-[14px] font-medium text-[#686868]">
                (복수 선택 가능)
              </span>
            </div>

            {/* 실제 컴포넌트 */}
            <MultiSelectToggle
              options={languageOptions}
              selectedValues={selectedLanguages}
              onChange={setSelectedLanguages}
            />
          </div>
        </section>

        {/* 2. + 아이콘이 붙은 보라색 버튼 */}
        <section className="flex flex-col gap-4 mt-5">
          <h2 className="font-wantedsans text-lg font-bold p text-gray-800">
            2. 왼쪽에 +가 붙은 버튼
          </h2>

          <div className="flex flex-col gap-3 p-4">
            <Button variant="primary-plus">
              새 케이스 시작하기
            </Button>

          </div>
        </section>

        {/* 3. 글씨만 있는 작은 버튼 (SmallButton variant="text") */}
        <section className="flex flex-col mt-5">
          <h2 className="font-wantedsans text-lg font-bold text-gray-800">
            3. 글씨만 있는 작은 버튼 (화살표 아이콘 x)
          </h2>

          <div className="flex flex-col gap-3 p-4">
            <SmallButton variant="text" label="변경" />
          </div>
        </section>


    </PageContainer>
    </>
      
);
};

export default CheckComponentsPage;