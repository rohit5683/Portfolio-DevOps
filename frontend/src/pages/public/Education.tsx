import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Tilt from "react-parallax-tilt";
import api from "../../services/api";
import Skeleton from "../../components/common/Skeleton";
import { getImageUrl } from "../../utils/imageUtils";
import SEO from "../../components/common/SEO";

// Portal Document Preview Component
const DocumentPreview = ({
  documentUrl,
  onClose,
}: {
  documentUrl: string;
  onClose: () => void;
}) => {
  const isPdf = documentUrl.toLowerCase().endsWith(".pdf");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Memoize close handler
  const handleClose = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onClose();
    },
    [onClose],
  );

  // Keyboard navigation (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent scrolling

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

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
      {/* Close Button */}
      <button
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-50 p-2 hover:bg-white/10 rounded-full"
        onClick={handleClose}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Content */}
      <div
        className="relative w-full max-w-5xl h-[85vh] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {isPdf ? (
          <iframe
            src={getImageUrl(documentUrl)}
            className="w-full h-full"
            title="PDF Document"
            onLoad={() => setIsLoading(false)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/50">
            {!hasError ? (
              <img
                src={getImageUrl(documentUrl)}
                alt="Document preview"
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />
            ) : (
              <div className="text-center text-red-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <p>Failed to load image</p>
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="absolute bottom-6 right-6 flex gap-3">
          <a
            href={getImageUrl(documentUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-blue-500/30 flex items-center gap-2 transform hover:-translate-y-0.5"
            onClick={(e) => e.stopPropagation()}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in New Tab
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const Education = () => {
  const [education, setEducation] = useState<any[]>([]);
  const [filteredEducation, setFilteredEducation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEducation, setSelectedEducation] = useState<any | null>(null);
  const [previewDocument, setPreviewDocument] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const levels = [
    { id: "all", label: "All Levels", icon: "🎓" },
    { id: "high-school", label: "High School", icon: "🏫" },
    { id: "undergraduate", label: "Undergraduate", icon: "🎓" },
    { id: "postgraduate", label: "Postgraduate", icon: "👨‍🎓" },
  ];

  const statusColors = {
    completed: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/30",
      label: "Completed",
    },
    "in-progress": {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      label: "In Progress",
    },
    dropped: {
      bg: "bg-gray-500/10",
      text: "text-gray-400",
      border: "border-gray-500/30",
      label: "Dropped",
    },
  };

  useEffect(() => {
    api
      .get("/education")
      .then((res) => {
        setEducation(res.data);
        setFilteredEducation(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch education", err);
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

    const cards = document.querySelectorAll(".education-card-wrapper");
    cards.forEach((card) => observerRef.current?.observe(card));

    return () => observerRef.current?.disconnect();
  }, [filteredEducation]);

  useEffect(() => {
    let filtered = education;

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter((e) => e.level === selectedLevel);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          (e.schoolCollege || e.school || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          e.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.fieldOfStudy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (e.boardUniversity || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Sort: featured first, then by end date (most recent first)
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Compare end dates (assuming format like "2024")
      return parseInt(b.endDate) - parseInt(a.endDate);
    });

    setFilteredEducation(filtered);
  }, [selectedLevel, searchQuery, education]);

  const openDocumentPreview = (e: React.MouseEvent, docUrl: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewDocument(docUrl);
  };

  const closeDocumentPreview = useCallback(() => {
    setPreviewDocument(null);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <SEO
          title="Education"
          description="My academic background and degrees."
          keywords={["Education", "Degrees", "Academic Qualifications"]}
        />
        <div className="max-w-4xl mx-auto">
          <Skeleton width={300} height={48} className="mx-auto mb-6" />
          <Skeleton width={500} height={24} className="mx-auto" />
        </div>

        {/* Search and Filter Skeletons */}
        <div className="max-w-5xl mx-auto mb-16 space-y-8">
          <Skeleton
            width="100%"
            height={56}
            className="max-w-lg mx-auto rounded-xl"
          />
          <div className="flex flex-wrap justify-center gap-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  width={120}
                  height={48}
                  className="rounded-full"
                />
              ))}
          </div>
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
                          <Skeleton width={200} height={24} className="mb-2" />
                          <Skeleton width={100} height={16} />
                        </div>
                      </div>

                      <div className="flex gap-2 mb-3">
                        <Skeleton
                          width={120}
                          height={20}
                          className="rounded-full"
                        />
                        <Skeleton
                          width={80}
                          height={20}
                          className="rounded-full"
                        />
                      </div>

                      <Skeleton width={150} height={20} className="mb-3" />
                      <Skeleton width={100} height={16} className="mb-3" />

                      <div className="space-y-2 pt-3 border-t border-white/5">
                        <Skeleton width="100%" height={12} />
                        <Skeleton width="90%" height={12} />
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
    <>
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
            Education Journey
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            My academic journey across {education.length}{" "}
            institutions
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-5xl mx-auto mb-16 space-y-8">
          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 transition duration-300 blur"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search institutions, degrees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-xl"
              />
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 ${
                  selectedLevel === level.id
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                <span className="mr-2">{level.icon}</span>
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto relative px-4">
          {/* Vertical Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-pink-500/50 rounded-full"></div>

          <div className="space-y-16">
            {filteredEducation.map((edu, index) => {
              const statusStyle =
                statusColors[edu.status as keyof typeof statusColors] ||
                statusColors.completed;

              return (
                <div
                  key={edu._id}
                  className={`education-card-wrapper opacity-0 relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""} items-center w-full`}
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
                        <div
                          className={`relative bg-white/5 backdrop-blur-xl p-6 rounded-2xl border transition-all duration-300 group cursor-pointer overflow-hidden border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]`}
                          onClick={() =>
                            setSelectedEducation(
                              selectedEducation?._id === edu._id ? null : edu,
                            )
                          }
                        >
                          {/* Status Badge */}
                          <div
                            className={`absolute top-4 right-4 px-2 py-0.5 ${statusStyle.bg} ${statusStyle.text} text-[10px] font-semibold rounded-full border ${statusStyle.border} backdrop-blur-md`}
                          >
                            {statusStyle.label}
                          </div>

                          <div className="flex items-start gap-3 mb-3">
                            {edu.logoUrl ? (
                              <div className="w-12 h-12 rounded-xl bg-white/10 p-1.5 border border-white/10 flex-shrink-0">
                                <img
                                  src={getImageUrl(edu.logoUrl)}
                                  alt={edu.schoolCollege || edu.school}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl font-bold text-blue-400">🎓</div>`;
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                                🎓
                              </div>
                            )}

                            <div className="flex-1 min-w-0 pr-12">
                              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                                {edu.schoolCollege || edu.school}
                              </h3>
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                {edu.boardUniversity}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="text-[10px] font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 flex items-center gap-1">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {edu.startDate} - {edu.endDate}
                            </span>
                            {edu.grade && (
                              <span className="text-[10px] font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                {edu.gradeType === "Percentage"
                                  ? "Percentage"
                                  : "Grade"}
                                : {edu.grade}
                                {edu.gradeType === "Percentage" ? "%" : " CGPA"}
                              </span>
                            )}
                          </div>

                          <h4 className="text-base text-white font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                            {edu.degree}
                          </h4>
                          <p className="text-xs text-gray-400 mb-3">
                            {edu.fieldOfStudy}
                          </p>

                          {edu.description && (
                            <p className="text-gray-400 text-xs leading-relaxed border-t border-white/5 pt-3 mt-2">
                              {edu.description}
                            </p>
                          )}

                          {/* Documents Indicator */}
                          {edu.documents && edu.documents.length > 0 && (
                            <div className="mt-4 flex items-center justify-between text-xs border-t border-white/5 pt-3">
                              <div className="flex items-center gap-1.5 text-purple-400">
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {edu.documents.length} Document
                                  {edu.documents.length !== 1 ? "s" : ""}
                                </span>
                              </div>
                              <div
                                className={`flex items-center gap-1 text-gray-400 transition-transform duration-300 ${selectedEducation?._id === edu._id ? "text-blue-400" : ""}`}
                              >
                                <span>
                                  {selectedEducation?._id === edu._id
                                    ? "Hide"
                                    : "View"}
                                </span>
                                <svg
                                  className={`w-3 h-3 transition-transform duration-300 ${selectedEducation?._id === edu._id ? "rotate-180" : ""}`}
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
                            </div>
                          )}

                          {/* Expanded Documents Section */}
                          {selectedEducation?._id === edu._id &&
                            edu.documents &&
                            edu.documents.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-white/10 animate-fadeIn">
                                <div className="grid grid-cols-2 gap-3">
                                  {edu.documents.map(
                                    (doc: string, idx: number) => {
                                      const isPdf = doc
                                        .toLowerCase()
                                        .endsWith(".pdf");
                                      return (
                                        <div
                                          key={idx}
                                          className="relative group/doc cursor-pointer overflow-hidden rounded-lg border border-white/10 hover:border-blue-500/50 transition-all"
                                          onClick={(e) =>
                                            openDocumentPreview(e, doc)
                                          }
                                        >
                                          {isPdf ? (
                                            <div className="aspect-[4/3] bg-gray-800 flex flex-col items-center justify-center group-hover/doc:bg-gray-700 transition-colors">
                                              <svg
                                                className="w-10 h-10 text-red-400 mb-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                                />
                                              </svg>
                                              <span className="text-xs text-gray-300">
                                                PDF Document
                                              </span>
                                            </div>
                                          ) : (
                                            <div className="aspect-[4/3] relative">
                                              <img
                                                src={getImageUrl(doc)}
                                                alt={`Document ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                              />
                                              <div className="absolute inset-0 bg-black/0 group-hover/doc:bg-black/40 transition-colors flex items-center justify-center">
                                                <svg
                                                  className="w-8 h-8 text-white opacity-0 group-hover/doc:opacity-100 transition-opacity"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  viewBox="0 0 24 24"
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                  />
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                  />
                                                </svg>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    },
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </Tilt>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredEducation.length === 0 && (
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No education entries found
              </h3>
              <p className="text-gray-400 mb-6">
                Try adjusting your search or filters
              </p>
              <button
                onClick={() => {
                  setSelectedLevel("all");
                  setSearchQuery("");
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Document Preview Portal */}
        {previewDocument && (
          <DocumentPreview
            documentUrl={previewDocument}
            onClose={closeDocumentPreview}
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
    </>
  );
};

export default Education;
