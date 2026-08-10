import { Outlet } from 'react-router-dom';
import BottomGNB from './BottomGNB';

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
      <BottomGNB items={NAV_ITEMS} />
    </div>
  );
}

export default HospitalShell;