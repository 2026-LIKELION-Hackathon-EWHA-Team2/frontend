import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header'
import PageContainer from '../../components/layout/PageContainer'

import Button from '../../components/button/Button';
import ListButton from '../../components/button/ListButton';

/* 컴포넌트 확인용 페이지 - 자유롭게 쓰시면 됩니다!
path: /dev/components */

const CheckComponentsPage = () => (
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
      <section className="flex flex-col gap-8">
        <h2 className="text-lg font-semibold text-gray-800">2. 리스트형 버튼</h2>
        
        <div className="flex flex-col gap-4 p-4 rounded-xl">
          <ListButton 
            label="동의 철회 / 공유 이력" 
          />
          <ListButton 
            label="프로필 수정" 
          />
        </div>
      </section>


    </PageContainer>
    </>
      
)

export default CheckComponentsPage;