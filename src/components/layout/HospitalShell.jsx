import { Outlet } from 'react-router-dom';
import BottomGNB from './BottomGNB';

const NAV_ITEMS = [
  { path: '/hospital/home', label: '홈', icon: 'gnb-home' },
  { path: '/hospital/consult', label: '케이스', icon: 'gnb-consult' },
  { path: '/hospital/patients', label: '채팅', icon: 'gnb-patient' },
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