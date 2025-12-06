import { useEffect, useState, useRef } from 'react';
import api from '../../services/api';
import Tilt from 'react-parallax-tilt';
import Skeleton from '../../components/common/Skeleton';

const Skills = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const categories = [
    { id: 'all', label: 'All Skills', icon: '🎯', color: 'blue' },
    { id: 'cloud', label: 'Cloud', icon: '☁️', color: 'cyan' },
    { id: 'devops', label: 'DevOps', icon: '⚙️', color: 'purple' },
    { id: 'programming', label: 'Programming', icon: '💻', color: 'green' },
    { id: 'database', label: 'Database', icon: '🗄️', color: 'orange' },
    { id: 'tools', label: 'Tools', icon: '🛠️', color: 'pink' },
  ];

  // Categorize skills based on name (fallback logic)
  const categorizeSkill = (skillName: string): string => {
    const name = skillName.toLowerCase();
    if (name.includes('aws') || name.includes('azure') || name.includes('gcp') || name.includes('cloud')) return 'cloud';
    if (name.includes('docker') || name.includes('kubernetes') || name.includes('jenkins') || name.includes('terraform') || name.includes('ansible') || name.includes('ci/cd')) return 'devops';
    if (name.includes('python') || name.includes('javascript') || name.includes('java') || name.includes('go') || name.includes('bash')) return 'programming';
    if (name.includes('mongo') || name.includes('sql') || name.includes('postgres') || name.includes('redis') || name.includes('database')) return 'database';
    return 'tools';
  };

  useEffect(() => {
    api.get('/skills')
      .then(res => {
        const skillsData = res.data.map((skill: any) => ({
          ...skill,
          category: skill.category || categorizeSkill(skill.name),
        }));
        setSkills(skillsData);
        setFilteredSkills(skillsData);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch skills', err);
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

    const cards = document.querySelectorAll('.skill-card-wrapper');
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, [filteredSkills]);

  useEffect(() => {
    let filtered = skills;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort: Featured first, then by proficiency
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.proficiency - a.proficiency;
    });

    setFilteredSkills(filtered);
  }, [selectedCategory, searchQuery, skills]);

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 90) return 'from-green-400 to-emerald-600';
    if (proficiency >= 75) return 'from-blue-400 to-cyan-600';
    if (proficiency >= 60) return 'from-yellow-400 to-orange-600';
    return 'from-red-400 to-pink-600';
  };

  const getProficiencyLabel = (proficiency: number) => {
    if (proficiency >= 90) return 'Expert';
    if (proficiency >= 75) return 'Advanced';
    if (proficiency >= 60) return 'Intermediate';
    return 'Beginner';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="text-center mb-16">
          <Skeleton width={300} height={48} className="mx-auto mb-6" />
          <Skeleton width={500} height={24} className="mx-auto" />
        </div>

        {/* Search and Filter Skeletons */}
        <div className="max-w-7xl mx-auto mb-12 space-y-8">
          <Skeleton width="100%" height={56} className="max-w-lg mx-auto rounded-xl" />
          <div className="flex flex-wrap justify-center gap-4">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} width={100} height={48} className="rounded-full" />
            ))}
          </div>
        </div>

        {/* Skills Grid Skeleton */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-full bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton width={64} height={64} className="rounded-2xl" />
                  <div className="flex-1">
                    <Skeleton width={100} height={24} className="mb-2" />
                    <Skeleton width={60} height={16} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton width={60} height={12} />
                    <Skeleton width={30} height={12} />
                  </div>
                  <Skeleton width="100%" height={8} className="rounded-full" />
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                  <Skeleton width={80} height={16} />
                  <Skeleton width={60} height={16} />
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
          Technical Arsenal
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          A curated collection of tools and technologies I use to build scalable, resilient, and automated systems.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="max-w-7xl mx-auto mb-12 space-y-8">
        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xl"
            />
            <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredSkills.map((skill, index) => (
            <div 
              key={skill._id || skill.name} 
              className="skill-card-wrapper opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Tilt
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                perspective={1000}
                scale={1.02}
                transitionSpeed={1500}
                className="h-full"
              >
                <div className={`h-full bg-white/5 backdrop-blur-xl p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                  skill.featured 
                    ? 'border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] bg-gradient-to-br from-white/10 to-yellow-500/5' 
                    : 'border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                }`}>
                  
                  {/* Featured Badge */}
                  {skill.featured && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                        FEATURED
                      </div>
                    </div>
                  )}

                  {/* Skill Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center p-3 shadow-inner ${
                      skill.featured ? 'bg-yellow-500/10' : 'bg-white/5'
                    }`}>
                      {skill.iconUrl ? (
                        <img 
                          src={skill.iconUrl} 
                          alt={skill.name}
                          className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-3xl">
                          {categories.find(c => c.id === skill.category)?.icon || '🔧'}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {skill.name}
                      </h3>
                      <span className={`text-xs font-bold tracking-wider uppercase bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} bg-clip-text text-transparent`}>
                        {getProficiencyLabel(skill.proficiency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Proficiency</span>
                      <span className="text-white font-mono">{skill.proficiency}%</span>
                    </div>
                    <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full bg-gradient-to-r ${getProficiencyColor(skill.proficiency)} rounded-full relative overflow-hidden`}
                        style={{ width: `${skill.proficiency}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 w-full -translate-x-full animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>{categories.find(c => c.id === skill.category)?.icon}</span>
                      <span className="capitalize">{skill.category}</span>
                    </div>
                    {skill.yearsOfExperience > 0 && (
                      <div>{skill.yearsOfExperience} Yr{skill.yearsOfExperience !== 1 ? 's' : ''} Exp</div>
                    )}
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No skills found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
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

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
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

export default Skills;
