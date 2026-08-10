import { Outlet } from 'react-router-dom';
import BottomNav from './common/BottomNav';

const NAV_ITEMS = [
  { path: '/patient/home', label: '홈', icon: 'gnb-home' },
  { path: '/patient/case/new/upload', label: '케이스', icon: 'gnb-case' },
  { path: '/patient/hospital-match', label: '병원', icon: 'gnb-hospital' },
  { path: '/patient/my', label: '마이', icon: 'gnb-my' },
];

/* 환자 측 화면 GNB shell */
const PatientShell = () => {
  return (
    <div className="app-shell pb-[4.875rem]">
      <Outlet />
      <BottomNav items={NAV_ITEMS} />
    </div>
  );
}

export default PatientShell;