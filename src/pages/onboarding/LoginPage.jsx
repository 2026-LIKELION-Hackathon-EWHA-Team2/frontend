// [진입] 로그인 화면

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import Input from '../../components/Input';
import Button from '../../components/button/Button';
import CheckSquare from '../../components/Checksquare';
import useAuthStore from '../../store/useAuthStore';
import { useLoginMutation } from '../../hooks/useMockQueries';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginMutation = useLoginMutation();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  const isFilled = userId.trim() !== '' && password.trim() !== '';

  const handleLogin = () => {
    loginMutation.mutate(
      { userId, password }, // 기존엔 password를 안 보냈는데, 실제 로그인은 필수라서 추가함
      {
    
        // API 응답 형태 적용 { id, name, login_id, user_type, access, refresh, patient_id/hospital_id }
        onSuccess: (data) => {
          const role = data.user_type === 'HOSPITAL' ? 'hospital' : 'patient'; // 대문자 -> 소문자 변환 필수

          login(
            {
              userId: data.login_id,
              role,
              // origin_hospital_id/partner_hospital_id와 매칭되는 건 로그인 응답의 최상위 id! -> ㅠㅠ 휴 
              // (hospital_id 필드는 다른 값이라 못 씀 - 실제 응답으로 확인함: origin_hospital_id=5, 로그인 id=5, hospital_id=1)
              hospitalId: data.id ?? null,
              accessToken: data.access,
              refreshToken: data.refresh,
            },
            keepLoggedIn
          );

          navigate(role === 'hospital' ? '/hospital/home' : '/patient/home');
        },
        // 로그인 실패 처리 추가 (아이디/비번 틀림 등)
        onError: (error) => {
          console.error(error);
          alert('아이디 또는 비밀번호를 확인해주세요.');
        },
      }
    );
  };

  return (
    <PageContainer className="flex flex-col pt-25 pb-10">
      <img
        src="/icons/aftor-logo-box.svg"
        alt="aftor"
        className="mx-auto h-17.5 w-17.5"
      />

      <h1 className="mt-9 font-wantedsans text-[28px] font-normal leading-[1.3] text-[#181818]">
        로그인 후
        <br />
        이용이
        <br />
        가능합니다.
      </h1>

      <div className="mt-10 flex flex-col gap-5">
        <Input
          label="아이디"
          name="userId"
          placeholder="아이디 입력"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Input
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <label className="mt-3 flex w-fit cursor-pointer items-center gap-2">
        <CheckSquare
          checked={keepLoggedIn}
          onChange={setKeepLoggedIn}
          borderColor="border-[#4D4D4D]"
          activeClass="border-[#4D4D4D] bg-[#4D4D4D]"
          rounded="rounded-none"
        />
        <span className="font-wantedsans text-xs font-medium text-[#626262]">로그인 상태 유지</span>
      </label>

      <Button
        variant="primary"
        className="mt-8"
        disabled={!isFilled || loginMutation.isPending}
        onClick={handleLogin}
      >
        {loginMutation.isPending ? '로그인 중' : '로그인'}
      </Button>

      <Button variant="underline" to="/select-role" className="mx-auto mt-4">
        회원가입
      </Button>
    </PageContainer>
  );
};

export default LoginPage;