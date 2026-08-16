import { Outlet } from 'react-router-dom';
import BottomGNB from './BottomGNB';

const NAV_ITEMS = [
  { path: '/hospital/home', label: '홈', icon: 'gnb-home' },
  { path: '/hospital/case', label: '케이스', icon: 'gnb-case' },
  { path: '/hospital/chat', label: '채팅', icon: 'gnb-consult' },
];

/* 병원 측 화면 GNB shell */

const HospitalShell = () => {
  return (
    <div className="app-shell pb-19.5">
      <Outlet />
      <BottomGNB items={NAV_ITEMS} />
    </div>
  );
}

export default HospitalShell;