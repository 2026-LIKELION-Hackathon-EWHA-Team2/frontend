import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

/*
 * [어흥콘 리팩토링] 라우트 가드 ~.~ 
 * 원래는 로그인 여부와 무관하게 /patient, /hospital 하위 경로 URL을 알면 바로 접근 가능한 구조
 * -> useAuthStore(로그인 상태, role)를 확인해서 로그인 안 된 사용자는 /login으로 보내고,
 *   role이 requiredRole과 다른 경우(예: 환자 계정으로 /hospital/* 접근)에도 자기 role 홈으로 돌려보내도록!! 
 * -> App.jsx에서 PatientShell/HospitalShell을 감싸는 형태로 적용했어요!!! 
 */
const ProtectedRoute = ({ requiredRole, children }) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const role = useAuthStore((state) => state.role);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // 로그인은 되어 있지만 다른 role 영역에 잘못 들어온 경우 -> 자기 role의 홈으로 보내버리쟈
    return <Navigate to={role === 'hospital' ? '/hospital/home' : '/patient/home'} replace />;
  }

  return children;
};

export default ProtectedRoute;