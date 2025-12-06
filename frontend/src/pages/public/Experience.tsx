import { useEffect, useState, useRef } from 'react';
import Tilt from 'react-parallax-tilt';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

const Experience = () => {
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    api.get('/experience')
      .then(res => {
        setExperience(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch experience', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
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

    const cards = document.querySelectorAll('.experience-card-wrapper');
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, [experience]);

  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths} mo`;
    if (remainingMonths === 0) return `${years} yr`;
    return `${years} yr ${remainingMonths} mo`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="text-center mb-16">
          <Skeleton width={300} height={48} className="mx-auto mb-6" />
          <Skeleton width={500} height={24} className="mx-auto" />
        </div>

        <div className="max-w-5xl mx-auto relative px-4">
          {/* Vertical Timeline Line Skeleton */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-white/10 rounded-full"></div>

          <div className="space-y-16">
            {Array(3).fill(0).map((_, index) => (
              <div 
                key={index} 
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center w-full`}
              >
                {/* Timeline Dot Skeleton */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/20 rounded-full border-4 border-gray-900 z-10"></div>

                {/* Content Card Skeleton */}
                <div className="w-full md:w-[calc(50%-2rem)] ml-16 md:ml-0">
                  <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                    <div className="flex items-start gap-3 mb-3">
                      <Skeleton width={48} height={48} variant="rounded" />
                      <div className="flex-1">
                        <Skeleton width={150} height={24} className="mb-2" />
                        <Skeleton width={100} height={16} />
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mb-3">
                      <Skeleton width={80} height={20} className="rounded-full" />
                      <Skeleton width={80} height={20} className="rounded-full" />
                    </div>

                    <div className="space-y-2 mb-3">
                      <Skeleton width="100%" height={12} />
                      <Skeleton width="100%" height={12} />
                      <Skeleton width="80%" height={12} />
                    </div>

                    <div className="flex gap-2">
                      <Skeleton width={60} height={20} className="rounded" />
                      <Skeleton width={60} height={20} className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
          Professional Journey
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          My career path and professional milestones
        </p>
      </div>

      <div className="max-w-5xl mx-auto relative px-4">
        {/* Vertical Timeline Line */}
        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-full"></div>

        <div className="space-y-16">
          {experience.map((exp, index) => (
            <div 
              key={exp._id} 
              className={`experience-card-wrapper opacity-0 relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} items-center w-full`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Dot */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>

              {/* Content Card */}
              <div className="w-full md:w-[calc(50%-2rem)] ml-16 md:ml-0">
                <div className="animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  <Tilt
                    tiltMaxAngleX={3}
                    tiltMaxAngleY={3}
                    perspective={1000}
                    scale={1.02}
                    transitionSpeed={1500}
                    className="h-full"
                  >
                  <div 
                    className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group cursor-pointer"
                    onClick={() => setExpandedId(expandedId === exp._id ? null : exp._id)}
                  >
                    {/* Header with Logo and Title */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* Company Logo */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden p-1.5">
                        {exp.companyLogo ? (
                          <img 
                            src={exp.companyLogo} 
                            alt={exp.company} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `<span class="text-xl font-bold text-blue-400">${exp.company.charAt(0)}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-xl font-bold text-blue-400">
                            {exp.company.charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Title and Company */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                          {exp.title}
                        </h3>
                        <p className="text-blue-400 font-semibold text-xs mt-0.5">{exp.company}</p>
                        {exp.location && (
                          <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {exp.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date and Duration */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-[10px] font-mono text-gray-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </span>
                      <span className="text-[10px] text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                        {calculateDuration(exp.startDate, exp.endDate)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-xs leading-relaxed mb-3">
                      {exp.description}
                    </p>

                    {/* Tech Stack */}
                    {exp.techStack && exp.techStack.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {exp.techStack.map((tech: string, idx: number) => (
                            <span 
                              key={idx}
                              className="px-1.5 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-300 rounded border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Achievements Toggle Indicator */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="flex items-center justify-between text-xs text-purple-400 border-t border-white/5 pt-3">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <span className="font-medium">{exp.achievements.length} Key Achievement{exp.achievements.length !== 1 ? 's' : ''}</span>
                        </div>
                        <svg 
                          className={`w-3 h-3 transition-transform duration-300 ${expandedId === exp._id ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    )}

                    {/* Expanded Achievements */}
                    {expandedId === exp._id && exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 animate-fadeIn">
                        <ul className="space-y-1.5">
                          {exp.achievements.map((achievement: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                              <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                              <span className="leading-relaxed">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Tilt>
              </div>
            </div>
            </div>
          ))}
        </div>

        {experience.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No experience entries found</h3>
            <p className="text-gray-400">Your professional journey will appear here</p>
          </div>
        )}
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
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Experience;
