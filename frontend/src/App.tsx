import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Skills from './pages/public/Skills';
import Projects from './pages/public/Projects';
import Experience from './pages/public/Experience';
import Education from './pages/public/Education';
import EducationEdit from './pages/admin/EducationEdit';
import Contact from './pages/public/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProfileEdit from './pages/admin/ProfileEdit';
import ProjectsEdit from './pages/admin/ProjectsEdit';
import ExperienceEdit from './pages/admin/ExperienceEdit';
import SkillsEdit from './pages/admin/SkillsEdit';
import AboutEdit from './pages/admin/AboutEdit';
import UserManagement from './pages/admin/UserManagement';
import TotpSetup from './pages/admin/TotpSetup';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll without animation
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          <Route path="/portal/login" element={<Login />} />
          <Route path="/portal/totp-setup" element={<TotpSetup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/portal" element={<Dashboard />} />
            <Route path="/portal/profile" element={<ProfileEdit />} />
            <Route path="/portal/about" element={<AboutEdit />} />
            <Route path="/portal/projects" element={<ProjectsEdit />} />
            <Route path="/portal/experience" element={<ExperienceEdit />} />
            <Route path="/portal/education" element={<EducationEdit />} />
            <Route path="/portal/skills" element={<SkillsEdit />} />
            <Route path="/portal/users" element={<UserManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
