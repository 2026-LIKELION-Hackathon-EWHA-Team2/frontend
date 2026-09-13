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

const PUBLIC_ENDPOINTS = ['/accounts/login/', '/accounts/signup/'];
// [어흥콘 리팩토링] refresh 엔드포인트 자체도 Authorization 헤더가 필요 없는 공개 엔드포인트라 목록에 추가하기!!
const REFRESH_ENDPOINT = '/accounts/token/refresh/';
PUBLIC_ENDPOINTS.push(REFRESH_ENDPOINT);

// 요청 인터셉터: 모든 요청에 access_token을 자동으로 헤더에 붙여줌 (공개 엔드포인트는 제외)
// -> 새 API 함수 만들 때 이 토큰 관련 코드를 따로 안 써도 됨! (accounts 관련 API 포함 전부 자동 적용 되도록)

axiosInstance.interceptors.request.use(
  (config) => {
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((path) => config.url?.includes(path));
    const authState = getAuthStorage();
    if (authState?.accessToken && !isPublicEndpoint) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [어흥콘 리팩토링] access_token 재발급(refresh) 로직 추가
// -> 기존엔 refresh 엔드포인트가 없어서 401 뜨면 재발급 시도 없이 바로 로그아웃했는데,
// -> 백엔드에서 POST /accounts/token/refresh/ 를 지원하게 돼서 재발급을 먼저 시도하도록 변경하기 ^3^

// 동시에 여러 요청이 401을 맞았을 때 refresh를 여러 번 호출하지 않도록 하는 잠금 상태 설정
// -> refresh가 진행 중이면 그 Promise를 그대로 재사용(대기)하고, 끝나면 각자 원래 요청을 재시도하도록? 
let refreshPromise = null;

const requestTokenRefresh = (refreshToken) => {
  if (!refreshPromise) {
    refreshPromise = axiosInstance
      .post(REFRESH_ENDPOINT, { refresh: refreshToken })
      .then((res) => res.data)
      .finally(() => {
        refreshPromise = null; // 성공/실패 여부와 상관없이 다음 401을 위해 잠금 해제 ☆
      });
  }
  return refreshPromise;
};

// 응답 인터셉터
// -> 정상 흐름: access_token 만료(401) -> refresh_token으로 재발급 시도 -> 성공하면 새 토큰으로 원래 요청 재시도
// -> refresh_token까지 만료/무효(401 "Token is invalid" 등)인 경우에만 로그아웃 처리 !
axiosInstance.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 통과

  async (error) => {
    const originalRequest = error.config;
    const hadAuthHeader = Boolean(originalRequest?.headers?.Authorization);
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((path) => originalRequest?.url?.includes(path));
    const isRefreshRequestItself = originalRequest?.url?.includes(REFRESH_ENDPOINT);

    // access_token 만료로 보이는 401이고, 아직 재시도 안 한 요청이고, refresh 요청 자체의 401은 아닌 경우에만! 재발급 시도
    if (
      error.response?.status === 401 &&
      hadAuthHeader &&
      !isPublicEndpoint &&
      !isRefreshRequestItself &&
      !originalRequest._retry // 무한 재시도 방지 플래그..~
    ) {
      originalRequest._retry = true;

      const authState = getAuthStorage();
      const refreshToken = authState?.refreshToken;

      // refresh_token 자체가 없으면 재발급 시도 의미가 없으니 바로 로그아웃 흐름으로 가도록 하기
      if (refreshToken) {
        try {
          // ROTATE_REFRESH_TOKENS=True -> access, refresh 둘 다 새로 내려줌
          const { access, refresh } = await requestTokenRefresh(refreshToken);
          useAuthStore.getState().setTokens({ accessToken: access, refreshToken: refresh });

          // 새 access_token으로 원래 요청 헤더 갱신 후 재시도
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // refresh_token까지 만료/무효한 경우(401 "Token is invalid" 등)에만 로그아웃 처리
          useAuthStore.getState().logout();
          window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
          return Promise.reject(refreshError);
        }
      }
    }

    // refresh_token이 없거나, refresh 요청 자체가 401난 경우 -> 기존처럼 바로 로그아웃 처리
    if (error.response?.status === 401 && hadAuthHeader && !isPublicEndpoint) {
      useAuthStore.getState().logout();
      // window.location.href 대신 커스텀 이벤트를 쏴서 -> 요거 좀 거친 거 같아서요 ㅠ.ㅠ
      // react-router의 navigate로 부드럽게 로그인 페이지로 이동시킴 (App.jsx에서 리스닝)
      window.dispatchEvent(new CustomEvent('auth:sessionExpired'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;