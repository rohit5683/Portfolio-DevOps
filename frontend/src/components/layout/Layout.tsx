import Navbar from './Navbar';
import AnimatedBackground from './AnimatedBackground';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-32 px-6 pb-12 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
