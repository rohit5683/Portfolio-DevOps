import { useEffect, useState, useRef } from "react";
import Tilt from "react-parallax-tilt";
import api from "../../services/api";
import Skeleton from "../../components/common/Skeleton";
import SEO from "../../components/common/SEO";
import Modal from "../../components/common/Modal";

const SpotlightCard = ({ 
  children, 
  className = "", 
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string; 
  onClick?: () => void 
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const Experience = () => {
  const [experience, setExperience] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    api
      .get("/experience")
      .then((res) => {
        setExperience(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch experience", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 },
    );

    const cards = document.querySelectorAll(".experience-card-wrapper");
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, [experience]);

  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();

    const months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const yearString = years === 1 ? "year" : "years";
    const monthString = remainingMonths === 1 ? "month" : "months";

    if (years === 0) return `${remainingMonths} ${monthString}`;
    if (remainingMonths === 0) return `${years} ${yearString}`;
    return `${years} ${yearString} ${remainingMonths} ${monthString}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
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
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""} items-center w-full`}
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
                        <Skeleton
                          width={80}
                          height={20}
                          className="rounded-full"
                        />
                        <Skeleton
                          width={80}
                          height={20}
                          className="rounded-full"
                        />
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
    <div className="container mx-auto px-4 py-12">
      <SEO
        title="Experience"
        description="My professional work history and achievements as a DevOps Engineer."
        keywords={["Work Experience", "Resume", "Career History"]}
      />
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
              className={`experience-card-wrapper opacity-0 relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""} items-center w-full`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Dot */}
              <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-gray-900 z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>

              {/* Content Card */}
              <div className="w-full md:w-[calc(50%-2rem)] ml-16 md:ml-0">
                <div
                  className="animate-float"
                  style={{ animationDelay: `${index * 0.5}s` }}
                >
                  <Tilt
                    tiltMaxAngleX={3}
                    tiltMaxAngleY={3}
                    perspective={1000}
                    scale={1.02}
                    transitionSpeed={1500}
                    className="h-full"
                  >
                    <SpotlightCard
                      className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === exp._id ? null : exp._id)
                      }
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
                                e.currentTarget.style.display = "none";
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
                          <h3 
                            className="text-lg font-bold text-white group-hover:text-blue-400 transition-all duration-300 leading-tight cursor-pointer inline-block bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat bg-left-bottom hover:bg-[length:100%_2px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedExperience(exp);
                            }}
                          >
                            {exp.title}
                          </h3>
                          <p className="text-blue-400 font-semibold text-xs mt-0.5">
                            {exp.company}
                          </p>
                          {exp.location && (
                            <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              {exp.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date and Duration */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-[10px] font-mono text-gray-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.endDate ? formatDate(exp.endDate) : "Present"}
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
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 013.138-3.138z"
                              />
                            </svg>
                            <span className="font-medium">
                              {exp.achievements.length} Key Achievement
                              {exp.achievements.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <svg
                            className={`w-3 h-3 transition-transform duration-300 ${expandedId === exp._id ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Expanded Achievements */}
                      {expandedId === exp._id &&
                        exp.achievements &&
                        exp.achievements.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10 animate-fadeIn">
                            <ul className="space-y-1.5">
                              {exp.achievements.map(
                                (achievement: string, idx: number) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2 text-xs text-gray-300"
                                  >
                                    <span className="text-green-400 mt-0.5 flex-shrink-0">
                                      ✓
                                    </span>
                                    <span className="leading-relaxed">
                                      {achievement}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                    </SpotlightCard>
                  </Tilt>
                </div>
              </div>
            </div>
          ))}
        </div>

        {experience.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No experience entries found
            </h3>
            <p className="text-gray-400">
              Your professional journey will appear here
            </p>
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

      <Modal
        isOpen={!!selectedExperience}
        onClose={() => setSelectedExperience(null)}
      >
        {selectedExperience && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Sidebar - Meta Info */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden p-3 shadow-[0_0_30px_rgba(59,130,246,0.1)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-shadow">
                  {selectedExperience.companyLogo ? (
                    <img
                      src={selectedExperience.companyLogo}
                      alt={selectedExperience.company}
                      className="w-full h-full object-contain drop-shadow-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500">${selectedExperience.company.charAt(0)}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-500">
                      {selectedExperience.company.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white leading-tight tracking-tight">
                    {selectedExperience.title}
                  </h3>
                  <p className="text-base font-medium text-blue-400 mt-1">
                    {selectedExperience.company}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedExperience.location}
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                <div className="mb-6">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Duration
                  </h4>
                  <p className="text-base text-white font-semibold tracking-wide">
                    {formatDate(selectedExperience.startDate)} —{" "}
                    <span className={selectedExperience.endDate ? "text-gray-400" : "text-green-400"}>
                      {selectedExperience.endDate
                        ? formatDate(selectedExperience.endDate)
                        : "Present"}
                    </span>
                  </p>
                  <p className="text-xs text-blue-400/80 mt-1 font-mono">
                    {calculateDuration(
                      selectedExperience.startDate,
                      selectedExperience.endDate,
                    )}
                  </p>
                </div>

                {selectedExperience.techStack && selectedExperience.techStack.length > 0 && (
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedExperience.techStack.map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 text-[11px] font-medium bg-white/5 text-gray-300 rounded-lg border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-300 cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content - Description & Achievements */}
            <div className="lg:col-span-8 space-y-8">
              {/* Role Overview */}
              <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Role Overview
                </h4>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm/7 font-light">
                    {selectedExperience.description}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedExperience.roleDescription && (
                <div className="animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                    </div>
                    Description
                  </h4>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm/7 font-light">
                      {selectedExperience.roleDescription}
                    </p>
                  </div>
                </div>
              )}

              {/* Achievements */}
              {selectedExperience.achievements && selectedExperience.achievements.length > 0 && (
                <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Key Achievements
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedExperience.achievements.map((achievement: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="group relative flex items-start gap-4 p-4 bg-gradient-to-r from-white/[0.03] to-transparent rounded-xl border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:translate-x-1"
                        style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center mt-0.5 group-hover:bg-green-500/20 transition-colors">
                          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-300 leading-relaxed text-sm/6 group-hover:text-white transition-colors">
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges */}
              {selectedExperience.challenges && selectedExperience.challenges.length > 0 && (
                <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Key Challenges
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedExperience.challenges.map((challenge: string, idx: number) => (
                      <div 
                        key={idx} 
                        className="group relative flex items-start gap-4 p-4 bg-gradient-to-r from-white/[0.03] to-transparent rounded-xl border border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:translate-x-1"
                        style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 to-red-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center mt-0.5 group-hover:bg-orange-500/20 transition-colors">
                          <svg className="w-3.5 h-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <span className="text-gray-300 leading-relaxed text-sm/6 group-hover:text-white transition-colors">
                          {challenge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Experience;
