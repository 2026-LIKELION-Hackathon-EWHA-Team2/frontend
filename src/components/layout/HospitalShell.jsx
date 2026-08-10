import { Outlet } from 'react-router-dom';
import BottomNav from './common/BottomNav';

const NAV_ITEMS = [
  { path: '/hospital/home', label: '홈', icon: 'gnb-home' },
  { path: '/hospital/consult', label: '협진', icon: 'gnb-consult' },
  { path: '/hospital/patients', label: '환자', icon: 'gnb-patient' },
];

/* 병원 측 화면 GNB shell */

const HospitalShell = () => {
  return (
    <div className="app-shell pb-[4.875rem]">
      <Outlet />
      <BottomNav items={NAV_ITEMS} />
    </div>
  );
}

export default HospitalShell;