// API request를 위한 axios instance

import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json', // 일단 혹시 몰라서 명시해뒀어요
  },
});

// auth-storage에서 현재 저장된 인증 상태를 꺼내는 함수
// keepLoggedIn 값에 따라 localStorage 또는 sessionStorage에 저장되도록 했으니까
const getAuthStorage = () => {
  const raw = localStorage.getItem('auth-storage') || sessionStorage.getItem('auth-storage');
  return raw ? JSON.parse(raw).state : null;
};


// 요청 인터셉터: 모든 요청에 access_token을 자동으로 헤더에 붙여줌
// -> 새 API 함수 만들 때 이 토큰 관련 코드를 따로 안 써도 됨! (accounts 관련 API 포함 전부 자동 적용 되도록)

axiosInstance.interceptors.request.use(
  (config) => {
    const authState = getAuthStorage();
    if (authState?.accessToken) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: access_token이 만료(401)되면 재발급 시도 없이 바로 로그아웃 처리
// -> 백엔드에 refresh 전용 엔드포인트가 따로 없고,
// access_token 자체의 유효기간이 7시간 정도면? 괜찮은 거 같아서요...~

axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 통과

  (error) => {
    // 수정 -> 401이어도 '원래 로그인 상태였다가 만료된 경우'에만 세션만료 처리하도록 조건 추가했어요
    const hadAuthHeader = Boolean(error.config?.headers?.Authorization);
    const isLoginRequest = error.config?.url?.includes('/accounts/login/');

    if (error.response?.status === 401 && hadAuthHeader && !isLoginRequest) {
      // access_token 만료(또는 유효하지 않음) -> 재발급 시도 없이 바로 로그인 상태 초기화
      // store의 logout()을 호출해서 메모리 상태 + storage + keepLoggedIn 플래그까지 한번에 정리
      useAuthStore.getState().logout();

      // window.location.href 대신 커스텀 이벤트를 쏴서 -> 요거 좀 거친 거 같아서요 ㅠ.ㅠ
      // react-router의 navigate로 부드럽게 로그인 페이지로 이동시킴 (App.jsx에서 리스닝)
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;