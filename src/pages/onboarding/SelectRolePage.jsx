// [진입] 회원가입 전 - 개인/병원 계정 선택 화면

import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import useAuthStore from '../../store/useAuthStore';

const SelectRolePage = () => {
  const navigate = useNavigate();
  const setRole = useAuthStore((state) => state.setRole);

  const handleSelect = (role) => {
    setRole(role);
    navigate('/signup');
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#6B5DD6] px-6 pb-10 pt-25">
      <img src="/icons/aftor-logo-nobox.svg" alt="aftor" className="mx-auto h-17.5 w-17.5" />

      <h1 className="mt-9 font-wantedsans text-[28px] font-normal leading-[1.3] text-white">
        어떤 계정으로
        <br />
        시작하시겠어요?
      </h1>

      <div className="mt-80 flex flex-col gap-3">
        <Button variant="outline-white" onClick={() => handleSelect('patient')}>
          개인으로 시작하기
        </Button>
        <Button variant="outline" onClick={() => handleSelect('hospital')}>
          병원으로 시작하기
        </Button>
      </div>
    </div>
  );
};

export default SelectRolePage;
