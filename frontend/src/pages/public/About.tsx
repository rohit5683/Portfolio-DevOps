import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import Tilt from 'react-parallax-tilt';

const About = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    api.get('/profile')
      .then(res => {
        setProfile(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch profile', err);
        setLoading(false);
      });
  }, []);

  // Animated counter effect
  useEffect(() => {
    if (!loading && profile?.animatedStats) {
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        const newStats: any = {};
        profile.animatedStats.forEach((stat: any) => {
          newStats[stat.label] = Math.floor(stat.value * progress);
        });
        setStats(newStats);

        if (currentStep >= steps) {
          const finalStats: any = {};
          profile.animatedStats.forEach((stat: any) => {
            finalStats[stat.label] = stat.value;
          });
          setStats(finalStats);
          clearInterval(interval);
        }
      }, increment);

      return () => clearInterval(interval);
    }
  }, [loading, profile]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [loading]);

  const getProgressGradient = (index: number) => {
    const gradients = [
      'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500',
      'bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500',
      'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500',
      'bg-gradient-to-r from-rose-500 via-pink-500 to-red-500',
    ];
    return gradients[index % gradients.length];
  };

  const highlights = profile?.highlights || [
    { icon: '🏆', title: 'AWS Certified', description: 'Solutions Architect & DevOps Professional' },
    { icon: '🔧', title: 'Infrastructure as Code', description: 'Expert in Terraform & Ansible' },
    { icon: '🐳', title: 'Container Orchestration', description: 'Kubernetes & Docker specialist' },
    { icon: '📊', title: 'CI/CD Pipelines', description: 'Jenkins, GitHub Actions, GitLab CI' },
  ];

  if (loading) {
    return <div className="container mx-auto text-center text-white text-xl mt-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in-element opacity-0">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient">
            About Me
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            {profile?.aboutSubtitle || 'DevOps Engineer passionate about automation and cloud infrastructure'}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <Tilt
              tiltMaxAngleX={5}
              tiltMaxAngleY={5}
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="1rem"
              scale={1.02}
              transitionSpeed={2000}
            >
              <div className="fade-in-element opacity-0 bg-white/5 backdrop-blur-2xl p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] group">
                {profile?.headline && (
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300">
                    {profile.headline}
                  </h2>
                )}
                
                <div className="prose prose-lg prose-invert max-w-none">
                  <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
                    {profile?.about || "Passionate DevOps Engineer with extensive experience in cloud infrastructure, automation, and continuous integration/deployment. Specialized in building scalable, reliable systems that enable teams to deliver software faster and more efficiently."}
                  </p>
                </div>
              </div>
            </Tilt>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highlights.map((highlight: any, index: number) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={8}
                  tiltMaxAngleY={8}
                  glareEnable={true}
                  glareMaxOpacity={0.2}
                  glareColor="#60a5fa"
                  glarePosition="all"
                  glareBorderRadius="0.75rem"
                  scale={1.05}
                  transitionSpeed={1500}
                >
                  <div 
                    className="fade-in-element opacity-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-2xl p-6 rounded-xl border border-white/10 hover:border-blue-500/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] h-full group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{highlight.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{highlight.title}</h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{highlight.description}</p>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Animated Stats */}
            <Tilt
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="1rem"
              scale={1.03}
              transitionSpeed={2000}
            >
              <div className="fade-in-element opacity-0 bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Statistics
                </h3>
                <div className="space-y-5">
                  {profile?.animatedStats?.map((stat: any, index: number) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm font-medium">{stat.label}</span>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{stats[stat.label] || 0}+</span>
                      </div>
                      <div className="h-2.5 bg-white/10 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-2000 relative overflow-hidden ${getProgressGradient(index)}`}
                          style={{ width: `${Math.min((stats[stat.label] || 0) / stat.value * 100, 100)}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tilt>

            {/* Contact Info */}
            <Tilt
              tiltMaxAngleX={6}
              tiltMaxAngleY={6}
              glareEnable={true}
              glareMaxOpacity={0.15}
              glareColor="#ffffff"
              glarePosition="all"
              glareBorderRadius="1rem"
              scale={1.03}
              transitionSpeed={2000}
            >
              <div className="fade-in-element opacity-0 bg-white/5 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 hover:border-green-500/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📍</span> Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                      <span className="text-xl">💼</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Role</div>
                      <div className="text-white font-semibold group-hover:text-blue-400 transition-colors">{profile?.role || 'DevOps Engineer'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                      <span className="text-xl">🌍</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Location</div>
                      <div className="text-white font-semibold group-hover:text-green-400 transition-colors">{profile?.location || 'India'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/10">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">Availability</div>
                      <div className="text-green-400 font-semibold group-hover:text-green-300 transition-colors">{profile?.availability?.message || 'Open to opportunities'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt>

            {/* Download Resume */}
            <button className="fade-in-element opacity-0 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] flex items-center justify-center gap-3 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
              <svg className="w-6 h-6 relative group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="relative">Download Resume</span>
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <Tilt
          tiltMaxAngleX={3}
          tiltMaxAngleY={3}
          glareEnable={true}
          glareMaxOpacity={0.1}
          glareColor="#ffffff"
          glarePosition="all"
          glareBorderRadius="1rem"
          scale={1.01}
          transitionSpeed={2500}
        >
          <div className="fade-in-element opacity-0 text-center bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-2xl p-12 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 animate-gradient">
              Let's Work Together
            </h2>
            <p className="text-gray-300 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
              I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hi, feel free to reach out!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                <span className="relative">Get in Touch</span>
              </a>
              <a 
                href={profile?.contact?.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold backdrop-blur-md border border-white/20 hover:border-blue-500/40 transition-all duration-300 flex items-center gap-3 group hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              >
                <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </Tilt>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default About;
