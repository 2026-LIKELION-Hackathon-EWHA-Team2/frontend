import { Outlet } from 'react-router-dom';
import BottomGNB from './BottomGNB';

const NAV_ITEMS = [
  { path: '/patient/home', label: '홈', icon: 'gnb-home' },
  { path: '/patient/case/upload', label: '케이스', icon: 'gnb-case' },
  { path: '/patient/hospital', label: '병원', icon: 'gnb-hospital' },
  { path: '/patient/my', label: '마이', icon: 'gnb-my' },
];

/* 환자 측 화면 GNB shell */
const PatientShell = () => {
  return (
    <div className="app-shell pb-19.5">
      <Outlet />
      <BottomGNB items={NAV_ITEMS} />
    </div>
  );
}

export default PatientShell;