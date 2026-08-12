import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header'
import PageContainer from '../../components/layout/PageContainer'

/* 컴포넌트 확인용 페이지 - 자유롭게 쓰시면 됩니다!
path: /dev/components */

const CheckComponentsPage = () => (
    <>
    <Header title="확인" showBack />
    <PageContainer className='px-6'>
        <h1 className="text-xl font-bold text-ink-900">공통 컴포넌트 check!!</h1>
    </PageContainer>
    </>
      
)

export default CheckComponentsPage;