// [3/3] 회원가입 - 가입 완료 화면 (환자 / 병원 공통)

import { useNavigate } from 'react-router-dom';
import Button from '../../../../components/button/Button';

const Step3Complete = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col px-6 pb-10">
      <div className="mt-40 flex flex-col items-center gap-3 text-center">
        <p className="font-wantedsans text-xl font-semibold text-[#181818]">
          회원가입이 완료되었습니다!
        </p>
        <p className="font-wantedsans text-sm font-medium leading-[1.6] text-[#626262]">
          <span className="text-[#6B5DD6]">aftor</span>와 함께
          <br />
          안전한 회복 여정을 시작해보세요.
        </p>
      </div>

      <Button variant="primary" className="mt-auto" onClick={() => navigate('/login')}>
        시작하기
      </Button>
    </div>
  );
};

export default Step3Complete;
