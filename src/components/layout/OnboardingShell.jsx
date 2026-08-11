import { Outlet } from 'react-router-dom';

/* 하단 GNB bar 가 없는 페이지 shell*/

const OnboardingShell = () => {
    return (
      <div className="app-shell">
        <Outlet />
      </div>
    );
  };
  
  export default OnboardingShell;