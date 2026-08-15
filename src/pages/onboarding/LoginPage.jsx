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
  const setRole = useAuthStore((state) => state.setRole);
  const loginMutation = useLoginMutation();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

  const isFilled = userId.trim() !== '' && password.trim() !== '';

  const handleLogin = () => {
    loginMutation.mutate(
      { userId },
      {
        onSuccess: ({ userId: loggedInUserId, role }) => {
          login(loggedInUserId, keepLoggedIn);
          setRole(role);
          navigate(role === 'hospital' ? '/hospital/home' : '/patient/home');
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
        로그인
      </Button>

      <Button variant="underline" to="/select-role" className="mx-auto mt-4">
        회원가입
      </Button>
    </PageContainer>
  );
};

export default LoginPage;
