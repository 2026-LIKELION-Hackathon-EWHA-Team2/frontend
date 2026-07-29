// API request를 위한 axios instance
import axios from 'axios';

const axiosInstance = axios.create({
  // 백엔드 API 기본 주소 (추후 백엔드 서버 주소로 변경 필요!!)
  baseURL: 'http://localhost:8080/api', 
});

axiosInstance.interceptors.request.use(
  (config) => {
    // 추후 토큰을 추가 (토큰 없을 시 삭제)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;