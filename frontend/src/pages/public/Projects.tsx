import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Tilt from 'react-parallax-tilt';
import api from '../../services/api';
import Skeleton from '../../components/common/Skeleton';

// Portal Gallery Component
const ImageGallery = ({ 
  images, 
  initialIndex, 
  projectTitle, 
  onClose 
}: { 
  images: string[]; 
  initialIndex: number; 
  projectTitle: string; 
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsZoomed(false);
    }
  }, [currentIndex, images.length]);

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsZoomed(false);
    }
  }, [currentIndex]);

  const handleClose = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    onClose();
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < images.length - 1) setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex, images.length, onClose]);

  return createPortal(
    <div 
      className="fixed inset-0 z-[2147483647] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 opacity-100"
      onClick={(e) => {
        // Only close if clicking the backdrop directly
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div>
            <h3 className="text-white font-semibold text-lg">{projectTitle}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          <button
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            onClick={handleClose}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {currentIndex > 0 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-all p-4 hover:bg-white/10 rounded-full backdrop-blur-sm bg-black/30 group"
          onClick={handlePrev}
        >
          <svg className="w-8 h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {currentIndex < images.length - 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white hover:text-gray-300 transition-all p-4 hover:bg-white/10 rounded-full backdrop-blur-sm bg-black/30 group"
          onClick={handleNext}
        >
          <svg className="w-8 h-8 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Main Image */}
      <div className="relative max-w-6xl max-h-[80vh] flex items-center justify-center">
        <img 
          src={images[currentIndex]} 
          alt={`${projectTitle} - ${currentIndex + 1}`}
          className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-all duration-300 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(!isZoomed);
          }}
        />
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-24 right-6 z-20 flex flex-col gap-2">
        <button
          className="text-white hover:text-gray-300 transition-all p-3 hover:bg-white/10 rounded-full backdrop-blur-sm bg-black/30"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(true);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
        <button
          className="text-white hover:text-gray-300 transition-all p-3 hover:bg-white/10 rounded-full backdrop-blur-sm bg-black/30"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(false);
          }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/50'
                      : 'border-white/20 hover:border-white/40 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Hints */}
      <div className="absolute bottom-6 left-6 z-20 text-white/60 text-sm hidden md:block">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
            Close
          </span>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [galleryData, setGalleryData] = useState<{
    images: string[];
    initialIndex: number;
    projectTitle: string;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  const categories = [
    { id: 'all', label: 'All Projects', icon: '🚀' },
    { id: 'web', label: 'Web Apps', icon: '🌐' },
    { id: 'devops', label: 'DevOps', icon: '⚙️' },
    { id: 'cloud', label: 'Cloud', icon: '☁️' },
    { id: 'mobile', label: 'Mobile', icon: '📱' },
  ];

  const statusColors = {
    'completed': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', label: 'Completed' },
    'in-progress': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'In Progress' },
    'archived': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', label: 'Archived' },
  };

  useEffect(() => {
    api.get('/projects')
      .then(res => {
        setProjects(res.data);
        setFilteredProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch projects', err);
        setLoading(false);
      });
  }, []);

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

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const cards = document.querySelectorAll('.project-card-wrapper');
    cards.forEach((card) => {
      if (observerRef.current) {
        observerRef.current.observe(card);
      }
    });
  }, [filteredProjects]);

  useEffect(() => {
    let filtered = projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.techStack?.some((tech: string) => tech.toLowerCase().includes(query))
      );
    }

    setFilteredProjects(filtered);
  }, [selectedCategory, searchQuery, projects]);

  const openGallery = (e: React.MouseEvent, images: string[], index: number, projectTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setGalleryData({ images, initialIndex: index, projectTitle });
  };

  const closeGallery = useCallback(() => {
    setGalleryData(null);
  }, []);

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
              <Skeleton key={i} width={120} height={48} className="rounded-full" />
            ))}
          </div>
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden flex flex-col">
              {/* Image Skeleton */}
              <Skeleton width="100%" height={256} className="rounded-none" />
              
              {/* Content Skeleton */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between mb-3">
                  <Skeleton width={200} height={32} />
                  <Skeleton width={80} height={24} />
                </div>
                
                <div className="space-y-2 mb-6">
                  <Skeleton width="100%" height={16} />
                  <Skeleton width="100%" height={16} />
                  <Skeleton width="80%" height={16} />
                </div>

                <div className="flex gap-2 mb-6">
                  <Skeleton width={80} height={24} className="rounded-full" />
                  <Skeleton width={80} height={24} className="rounded-full" />
                  <Skeleton width={80} height={24} className="rounded-full" />
                </div>

                <div className="mt-auto flex gap-3 pt-4 border-t border-white/5">
                  <Skeleton width="100%" height={48} className="rounded-xl" />
                  <Skeleton width="100%" height={48} className="rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
            My Projects
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A curated collection of my work showcasing various technologies and solutions
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
                placeholder="Search projects, technologies..."
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
            {categories.map((cat) => (
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {filteredProjects.map((project, index) => {
            const statusStyle = statusColors[project.status as keyof typeof statusColors] || statusColors.completed;
            
            return (
              <div 
                key={project._id} 
                className="project-card-wrapper opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Tilt
                  tiltMaxAngleX={5}
                  tiltMaxAngleY={5}
                  perspective={1000}
                  scale={1.02}
                  transitionSpeed={1500}
                  className="h-full"
                >
                  <div className={`h-full bg-white/5 backdrop-blur-xl rounded-2xl border transition-all duration-300 group relative overflow-hidden flex flex-col ${
                    project.featured 
                      ? 'border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.1)] bg-gradient-to-br from-white/10 to-yellow-500/5' 
                      : 'border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                  }`}>
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-0 left-0 z-20">
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-[10px] font-bold px-3 py-1 rounded-br-xl shadow-lg flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          FEATURED
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className={`absolute top-4 right-4 z-10 px-3 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs font-semibold rounded-full border ${statusStyle.border} backdrop-blur-md`}>
                      {statusStyle.label}
                    </div>

                    {/* Image Gallery */}
                    {project.images && project.images.length > 0 && (
                      <div className="relative h-64 bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden group-hover:h-72 transition-all duration-500">
                        <div className="flex gap-2 h-full p-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
                          {project.images.map((img: string, idx: number) => (
                            <button 
                              key={idx}
                              className="relative flex-shrink-0 h-full aspect-video cursor-pointer group/img overflow-hidden rounded-lg"
                              onClick={(e) => openGallery(e, project.images, idx, project.title)}
                            >
                              <img 
                                src={img} 
                                alt={`${project.title} - ${idx + 1}`}
                                className="h-full w-full object-cover transform group-hover/img:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-colors flex items-center justify-center">
                                <svg className="w-10 h-10 text-white opacity-0 group-hover/img:opacity-100 transform translate-y-4 group-hover/img:translate-y-0 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </div>
                            </button>
                          ))}
                        </div>
                        {/* Gradient Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col relative">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors flex-1">
                          {project.title}
                        </h3>
                        {project.completionDate && (
                          <span className="text-xs text-gray-400 ml-2 font-mono bg-white/5 px-2 py-1 rounded">
                            {new Date(project.completionDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {project.techStack?.map((tech: string, idx: number) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-white/5 text-blue-300 text-xs font-medium rounded-full border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Links */}
                      <div className="mt-auto flex gap-3 pt-4 border-t border-white/5">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium border border-white/10 hover:border-white/20 transform hover:-translate-y-0.5"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
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

      {/* Gallery Portal */}
      {galleryData && (
        <ImageGallery
          images={galleryData.images}
          initialIndex={galleryData.initialIndex}
          projectTitle={galleryData.projectTitle}
          onClose={closeGallery}
        />
      )}

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
    </>
  );
};

export default Projects;
