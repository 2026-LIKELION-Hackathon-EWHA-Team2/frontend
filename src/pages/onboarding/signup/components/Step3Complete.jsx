// [3/3] 회원가입 - 가입 완료 화면 (환자 / 병원 공통)

import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/button/Button';

const Step3Complete = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col px-6 pb-10">
      <div className="mx-auto mt-40 flex flex-col items-center gap-6.75">
        <p className="whitespace-nowrap text-center font-wantedsans text-2xl font-medium leading-7.5 text-[#181818]">
          회원가입이 완료되었습니다!
        </p>
        <p className="text-center font-wantedsans text-base font-medium leading-5 tracking-[0.48px]">
          <span className="text-[#6B5DD6]">aftor</span>
          <span className="text-[#181818]">와 함께</span>
          <br />
          <span className="text-[#181818]">안전한 회복 여정을 시작해보세요.</span>
        </p>
      </div>

      <Button variant="primary" className="mt-auto" onClick={() => navigate('/login')}>
        시작하기
      </Button>
    </div>
  );
};

export default Step3Complete;
