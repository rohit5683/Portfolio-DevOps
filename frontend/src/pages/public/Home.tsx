import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Tilt from "react-parallax-tilt";
import Skeleton from "../../components/common/Skeleton";
import SEO from "../../components/common/SEO";

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch profile and skills data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          api.get("/profile"),
          api.get("/skills"),
        ]);

        setProfile(profileRes.data);
        const featuredSkills = skillsRes.data.filter(
          (skill: any) => skill.featured,
        );
        setSkills(featuredSkills);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const roles = profile?.roles || [
    "DevOps Engineer",
    "Cloud Architect",
    "Infrastructure Automation Expert",
    "CI/CD Specialist",
  ];

  // Typing animation effect
  useEffect(() => {
    if (!roles.length) return;

    const currentRole = roles[currentRoleIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 1000 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting && displayedText === currentRole) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      } else {
        setDisplayedText(
          isDeleting
            ? currentRole.substring(0, displayedText.length - 1)
            : currentRole.substring(0, displayedText.length + 1),
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentRoleIndex, roles]);

  const stats = profile?.stats || [
    { label: "Years Experience", value: "3+", icon: "💼" },
    { label: "Projects Completed", value: "25+", icon: "🚀" },
    { label: "Cloud Deployments", value: "50+", icon: "☁️" },
    { label: "Certifications", value: "5+", icon: "📜" },
  ];

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return "from-green-400 to-emerald-600";
    if (proficiency >= 75) return "from-blue-400 to-cyan-600";
    return "from-gray-400 to-gray-600";
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 overflow-hidden">
      <SEO
        title="Home"
        description="Rohit Vishwakarma - DevOps Engineer specializing in AWS, Kubernetes, and Infrastructure Automation. View my portfolio and projects."
        keywords={[
          "DevOps Portfolio",
          "Cloud Engineer",
          "Infrastructure as Code",
        ]}
      />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1 relative z-10">
            <div className="inline-block mb-6 px-6 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full backdrop-blur-md animate-fade-in-up">
              <span className="text-blue-400 text-xs md:text-sm font-bold tracking-wide uppercase">
                🚀 Automating Infrastructure at Scale
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              Hi, I'm <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                {loading ? (
                  <Skeleton width={300} height={60} className="mt-2" />
                ) : (
                  profile?.name || "Rohit Vishwakarma"
                )}
              </span>
            </h1>

            <div
              className="h-16 mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <h2 className="text-xl md:text-3xl font-semibold text-gray-300">
                I am a <span className="text-blue-400">{displayedText}</span>
                <span className="animate-pulse text-blue-400">|</span>
              </h2>
            </div>

            <div
              className="text-base md:text-lg text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              {loading ? (
                <div className="space-y-2">
                  <Skeleton width="100%" height={20} />
                  <Skeleton width="80%" height={20} />
                </div>
              ) : (
                profile?.tagline ||
                "Building scalable infrastructure, automating deployments, and optimizing cloud solutions for high-performance applications."
              )}
            </div>

            <div
              className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <button
                onClick={() => navigate("/projects")}
                className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2 transform hover:-translate-y-1 text-sm md:text-base"
              >
                View Projects
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold backdrop-blur-md border border-white/10 hover:border-white/20 transition-all transform hover:-translate-y-1 text-sm md:text-base"
              >
                Contact Me
              </button>
              {loading ? (
                <Skeleton width={140} height={48} variant="rounded" />
              ) : (
                <a
                  href={profile?.contact?.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-blue-400 rounded-xl font-bold backdrop-blur-md border border-[#0077b5]/30 hover:border-[#0077b5]/50 transition-all flex items-center gap-2 transform hover:-translate-y-1 text-sm md:text-base"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center relative z-10">
            <Tilt
              tiltMaxAngleX={10}
              tiltMaxAngleY={10}
              perspective={1000}
              scale={1.05}
              transitionSpeed={2000}
              className="relative"
            >
              <div className="relative">
                {/* Animated rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 animate-pulse blur-xl"></div>
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-10 animate-spin-slow blur-2xl"></div>

                {/* Profile picture */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl backdrop-blur-sm bg-gradient-to-br from-blue-500/10 to-purple-500/10 group">
                  {loading ? (
                    <Skeleton variant="circular" width="100%" height="100%" />
                  ) : profile?.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl text-blue-400">
                      👨‍💻
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Floating badges */}
                {!loading &&
                  profile?.badges?.map((badge: any, index: number) => {
                    const getPositionClass = (pos: string) => {
                      switch (pos) {
                        case "top-right":
                          return "top-10 -right-4";
                        case "bottom-left":
                          return "bottom-10 -left-4";
                        case "top-left":
                          return "top-10 -left-4";
                        case "bottom-right":
                          return "bottom-10 -right-4";
                        default:
                          return "top-10 -right-4";
                      }
                    };

                    const getColorClass = (color: string) => {
                      switch (color) {
                        case "green":
                          return "text-green-400";
                        case "blue":
                          return "text-blue-400";
                        case "purple":
                          return "text-purple-400";
                        case "red":
                          return "text-red-400";
                        case "orange":
                          return "text-orange-400";
                        default:
                          return "text-blue-400";
                      }
                    };

                    return (
                      <div
                        key={index}
                        className={`absolute ${getPositionClass(badge.position)} px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl text-xs font-bold shadow-xl animate-float`}
                        style={{ animationDelay: `${index * 1.5}s` }}
                      >
                        <span className={`${getColorClass(badge.color)} mr-2`}>
                          {badge.icon}
                        </span>
                        {badge.text}
                      </div>
                    );
                  })}

                {/* Fallback if no badges */}
                {!loading &&
                  (!profile?.badges || profile.badges.length === 0) && (
                    <>
                      <div className="absolute top-10 -right-4 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl text-xs font-bold shadow-xl animate-float">
                        <span className="text-green-400 mr-2">●</span> Available
                        for hire
                      </div>
                      <div
                        className="absolute bottom-10 -left-4 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl text-xs font-bold shadow-xl animate-float"
                        style={{ animationDelay: "1.5s" }}
                      >
                        <span className="text-blue-400 mr-2">★</span> 5+ Years
                        Exp
                      </div>
                    </>
                  )}
              </div>
            </Tilt>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10"
                  >
                    <Skeleton width={40} height={40} className="mb-3" />
                    <Skeleton width={80} height={32} className="mb-1" />
                    <Skeleton width={100} height={16} />
                  </div>
                ))
            : stats.map((stat: any, index: number) => (
                <Tilt
                  key={index}
                  tiltMaxAngleX={15}
                  tiltMaxAngleY={15}
                  scale={1.05}
                  transitionSpeed={1500}
                  className="h-full"
                >
                  <div className="h-full bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150"></div>
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 transform origin-left">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1 tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-xs text-blue-200 font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                </Tilt>
              ))}
        </div>

        {/* Tech Stack Section */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Core Technologies
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
              My preferred stack for building robust and scalable solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 h-32 flex flex-col items-center justify-center gap-3"
                    >
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton width={80} height={16} />
                      <Skeleton width="100%" height={4} />
                    </div>
                  ))
              : skills.map((tech, index) => (
                  <Tilt
                    key={index}
                    tiltMaxAngleX={20}
                    tiltMaxAngleY={20}
                    scale={1.1}
                    transitionSpeed={400}
                  >
                    <div className="group relative bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] cursor-pointer h-full flex flex-col items-center justify-center gap-3">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getProficiencyColor(tech.proficiency)} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                      ></div>

                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                        {tech.iconUrl ? (
                          <img
                            src={tech.iconUrl}
                            alt={tech.name}
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <span>⚡</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                        {tech.name}
                      </div>

                      {/* Proficiency Bar */}
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                          className={`h-full bg-gradient-to-r ${getProficiencyColor(tech.proficiency)}`}
                          style={{ width: `${tech.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </Tilt>
                ))}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            className="h-full"
          >
            <div
              onClick={() => navigate("/experience")}
              className="h-full group bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-blue-500/30 transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] cursor-pointer relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <svg
                  className="w-32 h-32 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
                </svg>
              </div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 text-blue-400">
                  💼
                </div>
                <h4 className="text-xl font-bold text-white mb-3">
                  Experience
                </h4>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  Explore my professional journey, roles, and key achievements
                  across different companies.
                </p>
                <div className="text-blue-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-sm mt-auto">
                  View Timeline
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Tilt>

          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            className="h-full"
          >
            <div
              onClick={() => navigate("/education")}
              className="h-full group bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-purple-500/30 transition-all hover:shadow-[0_0_40px_rgba(168,85,247,0.1)] cursor-pointer relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <svg
                  className="w-32 h-32 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" />
                </svg>
              </div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 text-purple-400">
                  🎓
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Education</h4>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  Check out my academic background, degrees, and professional
                  certifications.
                </p>
                <div className="text-purple-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-sm mt-auto">
                  View Credentials
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Tilt>

          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            className="h-full"
          >
            <div
              onClick={() => navigate("/skills")}
              className="h-full group bg-gradient-to-br from-green-500/5 to-cyan-500/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-green-500/30 transition-all hover:shadow-[0_0_40px_rgba(34,197,94,0.1)] cursor-pointer relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <svg
                  className="w-32 h-32 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                </svg>
              </div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 text-green-400">
                  ⚡
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Skills</h4>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  Dive into my technical arsenal, tools, and proficiency levels.
                </p>
                <div className="text-green-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-sm mt-auto">
                  View Arsenal
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Tilt>

          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            className="h-full"
          >
            <div
              onClick={() => navigate("/projects")}
              className="h-full group bg-gradient-to-br from-orange-500/5 to-red-500/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-orange-500/30 transition-all hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] cursor-pointer relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <svg
                  className="w-32 h-32 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
              </div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 text-orange-400">
                  🚀
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Projects</h4>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  Browse through my portfolio of projects, applications, and solutions.
                </p>
                <div className="text-orange-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-sm mt-auto">
                  View Portfolio
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Tilt>

          <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            scale={1.02}
            className="h-full"
          >
            <div
              onClick={() => navigate("/certifications")}
              className="h-full group bg-gradient-to-br from-violet-500/5 to-indigo-500/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-violet-500/30 transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.1)] cursor-pointer relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                <svg
                  className="w-32 h-32 text-violet-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 bg-violet-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 text-violet-400">
                  📜
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Certifications</h4>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                  View my professional certifications, courses, and internships.
                </p>
                <div className="text-violet-400 font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-sm mt-auto">
                  View Credentials
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Tilt>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0;
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

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
