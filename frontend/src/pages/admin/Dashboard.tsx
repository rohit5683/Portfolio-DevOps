import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AnimatedBackground from '../../components/layout/AnimatedBackground';
import api from '../../services/api';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    name: 'Admin',
    role: 'Developer'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes, expRes, eduRes] = await Promise.all([
          api.get('/profile').catch(() => ({ data: { name: 'Admin', role: 'Developer' } })),
          api.get('/projects').catch(() => ({ data: [] })),
          api.get('/skills').catch(() => ({ data: [] })),
          api.get('/experience').catch(() => ({ data: [] })),
          api.get('/education').catch(() => ({ data: [] }))
        ]);

        setStats({
          name: profileRes.data.name || 'Admin',
          role: profileRes.data.role || 'Developer',
          projects: projectsRes.data.length,
          skills: skillsRes.data.length,
          experience: expRes.data.length,
          education: eduRes.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const menuItems = [
    {
      title: 'Profile',
      description: 'Manage personal info',
      path: '/portal/profile',
      count: null,
      color: 'from-pink-500 to-rose-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      title: 'About',
      description: 'Manage bio & highlights',
      path: '/portal/about',
      count: null,
      color: 'from-orange-500 to-amber-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'Projects',
      description: 'Showcase your work',
      path: '/portal/projects',
      count: stats.projects,
      color: 'from-blue-500 to-cyan-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: 'Experience',
      description: 'Work history & jobs',
      path: '/portal/experience',
      count: stats.experience,
      color: 'from-purple-500 to-indigo-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Education',
      description: 'Degrees & certifications',
      path: '/portal/education',
      count: stats.education,
      color: 'from-emerald-500 to-teal-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      )
    },
    {
      title: 'Skills',
      description: 'Tech stack & tools',
      path: '/portal/skills',
      count: stats.skills,
      color: 'from-orange-500 to-amber-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      path: '/portal/users',
      count: null,
      color: 'from-red-500 to-pink-500',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto p-6 pt-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{stats.name.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-gray-400">Here's what's happening with your portfolio today.</p>
          </div>
          <div className="flex gap-4">
            <a 
              href="/" 
              target="_blank" 
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition-all flex items-center gap-2"
            >
              <span>View Live Site</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <button 
              onClick={logout} 
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-all flex items-center gap-2"
            >
              <span>Logout</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Projects', value: stats.projects, color: 'text-blue-400' },
            { label: 'Total Skills', value: stats.skills, color: 'text-orange-400' },
            { label: 'Experience', value: stats.experience, color: 'text-purple-400' },
            { label: 'Education', value: stats.education, color: 'text-emerald-400' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all">
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>
                {loading ? '-' : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(item.path)}
              className="group relative bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/15 transition-all cursor-pointer overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 blur-2xl rounded-full -mr-16 -mt-16 transition-opacity group-hover:opacity-20`}></div>
              
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.count !== null && (
                    <span className="px-3 py-1 bg-black/30 rounded-full text-xs text-gray-300 border border-white/10">
                      {item.count} Items
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-6">
                  {item.description}
                </p>

                <div className="flex items-center text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                  <span>Manage {item.title}</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
