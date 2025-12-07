import { Outlet } from 'react-router-dom';
import SessionTimer from '../common/SessionTimer';

const AdminLayout = () => {
  return (
    <>
      {/* Session Timer - Floating Top Center */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <SessionTimer />
      </div>

      {/* Main Content */}
      <Outlet />
    </>
  );
};

export default AdminLayout;
