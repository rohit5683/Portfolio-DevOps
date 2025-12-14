import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { createPortal } from "react-dom";
import api from "../../services/api";
import SEO from "../../components/common/SEO";
import { getImageUrl } from "../../utils/imageUtils";

// Image Gallery Component for fullscreen viewing
const ImageGallery = ({
  imageUrl,
  certName,
  onClose,
}: {
  imageUrl: string;
  certName: string;
  onClose: () => void;
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleClose = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      onClose();
    },
    [onClose],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const isPDF = imageUrl.match(/\.pdf$/i);

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
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
            <h3 className="text-white font-semibold text-lg">{certName}</h3>
            <p className="text-gray-400 text-sm mt-1">
              {isPDF ? "PDF Document" : "Certificate Image"}
            </p>
          </div>
          <button
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
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
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center">
        {isPDF ? (
          <iframe
            src={getImageUrl(imageUrl)}
            className="w-full h-[85vh] rounded-lg shadow-2xl bg-white"
            title={certName}
          />
        ) : (
          <img
            src={getImageUrl(imageUrl)}
            alt={certName}
            className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-all duration-300 ${
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        )}
      </div>

      {/* Download Button */}
      <div className="absolute bottom-6 right-6 z-20">
        <a
          href={getImageUrl(imageUrl)}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>
    </div>,
    document.body,
  );
};

const SkeletonCard = () => (
  <div className="w-full h-full bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row relative animate-pulse">
    {/* Image Section Skeleton */}
    <div className="relative h-32 md:h-full md:w-2/5 bg-white/5"></div>

    {/* Content Section Skeleton */}
    <div className="flex-1 p-3 md:p-8 flex flex-col justify-between bg-black/20">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-5 w-16 bg-white/10 rounded-full"></div>
          <div className="h-5 w-20 bg-white/10 rounded-full"></div>
          <div className="h-3 w-24 bg-white/10 rounded ml-auto"></div>
        </div>
        <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-white/10 rounded"></div>
          <div className="h-3 w-full bg-white/10 rounded"></div>
          <div className="h-3 w-2/3 bg-white/10 rounded"></div>
        </div>
      </div>

      <div className="flex gap-4 mt-4 md:mt-6">
        <div className="h-10 md:h-12 flex-1 bg-white/10 rounded-xl"></div>
        <div className="h-10 md:h-12 w-12 bg-white/10 rounded-xl"></div>
      </div>
    </div>
  </div>
);

const Card = ({ cert, index, setIndex, openGallery }: any) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) {
      setIndex((prev: number) => prev - 1);
    } else if (info.offset.x < -100) {
      setIndex((prev: number) => prev + 1);
    }
  };

  return (
    <motion.div
      style={{
        x,
        opacity,
        zIndex: 100 - index,
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="cursor-grab active:cursor-grabbing touch-pan-y"
    >
      <div className="w-full h-full bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row relative group">
        {/* Image Section */}
        <div className="relative h-32 md:h-full md:w-2/5 overflow-hidden bg-black/20 flex items-center justify-center p-4 md:p-8">
          {cert.fileUrl && cert.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img
              src={getImageUrl(cert.fileUrl)}
              alt={cert.name}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          ) : (
            <div className="text-8xl text-gray-600">
              <svg className="w-24 h-24 md:w-32 md:h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-transparent to-black/60 md:to-black/40"></div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 md:p-8 flex flex-col justify-between bg-gradient-to-b md:bg-gradient-to-l from-black/40 to-black/60">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
              {cert.issuer && (
                <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] md:text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                  {cert.issuer}
                </span>
              )}
              {cert.type && (
                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${
                  cert.type === 'Internship' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                  cert.type === 'Award' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                  'bg-green-500/20 text-green-300 border-green-500/30'
                }`}>
                  {cert.type}
                </span>
              )}
              <span className="text-gray-400 text-[10px] md:text-xs font-mono">
                {new Date(cert.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
            </div>
            <h3 className="text-base md:text-3xl font-bold text-white mb-1 md:mb-3 leading-tight">
              {cert.name}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm line-clamp-3 md:line-clamp-4 leading-relaxed">
              {cert.description}
            </p>
          </div>

          <div className="flex gap-3 mt-3 md:mt-6">
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 md:py-3 bg-white text-black text-xs md:text-base font-bold rounded-xl text-center hover:bg-gray-200 transition-colors shadow-lg"
                onPointerDownCapture={(e) => e.stopPropagation()}
              >
                Verify Credential
              </a>
            )}
            {cert.fileUrl && (
              <button
                onClick={(e) => openGallery(e, cert.fileUrl, cert.name)}
                className="px-4 py-2 md:py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10"
                title="View File"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Certifications = () => {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [galleryData, setGalleryData] = useState<{
    imageUrl: string;
    certName: string;
  } | null>(null);

  const openGallery = (e: React.MouseEvent, imageUrl: string, certName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setGalleryData({ imageUrl, certName });
  };

  useEffect(() => {
    api
      .get("/certifications")
      .then((res) => {
        setCertifications(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch certifications", err);
        setLoading(false);
      });
  }, []);

  // Circular navigation logic
  const currentIndex = ((index % certifications.length) + certifications.length) % certifications.length;
  const nextIndex = (currentIndex + 1) % certifications.length;
  
  // We only render the current card and the next one for the stack effect
  const visibleCerts = certifications.length > 0 ? [certifications[nextIndex], certifications[currentIndex]] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden relative">
        <div className="text-center mb-12 relative z-10">
          <div className="h-12 w-96 bg-white/10 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-48 bg-white/10 rounded-lg mx-auto animate-pulse"></div>
        </div>
        <div className="relative w-[90vw] max-w-[800px] h-[420px] md:h-[450px]">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 overflow-hidden relative">
      <SEO
        title="Certifications"
        description="My professional certifications and credentials."
        keywords={["Certifications", "Credentials", "DevOps", "Cloud"]}
      />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="text-center mb-12 relative z-10">
        <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
          Certifications & Internships
        </h1>
        <p className="text-gray-400">Swipe to explore my credentials</p>
      </div>

      <div className="relative w-[90vw] max-w-[800px] h-[420px] md:h-[450px] perspective-1000">
        {certifications.length > 0 ? (
          <AnimatePresence initial={false}>
            {/* Render cards in reverse order so the current one is on top */}
            {visibleCerts.map((cert, i) => {
               // If it's the top card (last in array), it's interactive
               const isTop = i === 1; 
               return (
                 <motion.div
                   key={`${cert._id}-${isTop ? 'top' : 'back'}`}
                   className="absolute inset-0"
                   initial={isTop ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.9, y: 20, opacity: 0.4 }}
                   animate={isTop ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.95, y: 10, opacity: 0.6 }}
                   transition={{ duration: 0.4, ease: "easeOut" }}
                   style={{ zIndex: isTop ? 2 : 1 }}
                 >
                   {isTop ? (
                     <Card 
                        cert={cert} 
                        index={currentIndex} 
                        setIndex={setIndex}
                        openGallery={openGallery}
                     />
                   ) : (
                     // Background card (non-interactive visual)
                     <div className="w-full h-full bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden opacity-50 grayscale flex md:flex-row flex-col">
                         <div className="md:w-2/5 h-32 md:h-full bg-black/20"></div>
                     </div>
                   )}
                 </motion.div>
               );
            })}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white/5 rounded-3xl border border-white/10">
             <p>No certifications found</p>
          </div>
        )}
      </div>
      
      {/* Navigation Controls for non-touch */}
      <div className="flex gap-4 mt-12 relative z-10">
        <button 
          onClick={() => setIndex(prev => prev - 1)}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => setIndex(prev => prev + 1)}
          className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Image Gallery Modal */}
      {galleryData && (
        <ImageGallery
          imageUrl={galleryData.imageUrl}
          certName={galleryData.certName}
          onClose={() => setGalleryData(null)}
        />
      )}
    </div>
  );
};

export default Certifications;
