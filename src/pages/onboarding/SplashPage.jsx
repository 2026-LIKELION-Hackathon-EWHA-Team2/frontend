// [진입] 스플래시 화면 - 일정 시간 후 로그인 화면으로 자동 이동

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SPLASH_DURATION = 1800;

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-[#6B5DD6]">
      <img src="/icons/aftor-logo-white.svg" alt="aftor" className="h-12.25 w-[141.793px]" />
      <p className="font-wantedsans text-xs font-normal text-[#D1D1D1]">Aftercare without borders</p>
    </div>
  );
};

export default SplashPage;