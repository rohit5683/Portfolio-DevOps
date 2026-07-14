"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { createPortal } from "react-dom";
import api from "../../services/api";
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
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          <div>
            <h3 className="text-white font-semibold text-base md:text-lg">{certName}</h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1">
              {isPDF ? "PDF Document" : "Certificate Image"}
            </p>
          </div>
          <button
            className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-full"
            onClick={handleClose}
          >
            <svg
              className="w-6 h-6 md:w-8 md:h-8"
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
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20">
        <a
          href={getImageUrl(imageUrl)}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white text-black text-sm md:text-lg font-bold rounded-full hover:bg-gray-200 transition-colors shadow-lg"
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
  <div className="w-[85vw] max-w-[320px] md:max-w-[400px] lg:max-w-[440px] h-[65vh] max-h-[460px] md:max-h-[560px] lg:max-h-[620px] bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)] mx-auto animate-pulse"></div>
);

const Card = ({ cert, offset, setIndex, openGallery, isFront, index, isInitialMount, isMobile }: any) => {
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (!isFront) return;
    if (info.offset.x > 50) {
      setIndex((prev: number) => prev - 1);
    } else if (info.offset.x < -50) {
      setIndex((prev: number) => prev + 1);
    }
  };

  // 3D Parallax Tilt Logic
  const xMouse = useMotionValue(0);
  const yMouse = useMotionValue(0);
  
  // Spotlight Glare Coordinates
  const mouseXPx = useMotionValue(-1000); // Start off-screen
  const mouseYPx = useMotionValue(-1000);
  
  const mouseXSpring = useSpring(xMouse, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(yMouse, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${mouseXPx}px ${mouseYPx}px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFront) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Parallax
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    xMouse.set(xPct);
    yMouse.set(yPct);

    // Glare
    mouseXPx.set(mouseX);
    mouseYPx.set(mouseY);
  };

  const handleMouseLeave = () => {
    xMouse.set(0);
    yMouse.set(0);
    // Move glare off-screen
    mouseXPx.set(-1000);
    mouseYPx.set(-1000);
  };

  const absOffset = Math.abs(offset);

  // Animation values based on the relative offset
  const scale = 1 - absOffset * 0.05;
  const rotateZ = offset * (isMobile ? 4 : 5);
  const x = offset * (isMobile ? 25 : 50); // Wider spread on desktop
  const y = absOffset * (isMobile ? 8 : 12);
  const zIndex = 100 - absOffset;
  const opacity = absOffset > 2 ? 0 : 1; 
  
  return (
    <motion.div
      style={{
        zIndex,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: "auto",
        rotateX: isFront ? rotateX : 0,
        rotateY: isFront ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 800, opacity: 0, scale: 0.5, rotateZ: Math.random() * 20 - 10 }}
      animate={{ scale, rotateZ, x, y, opacity }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        delay: isInitialMount ? index * 0.08 : 0
      }}
      className={`w-[80vw] h-[65vh] max-w-[320px] max-h-[460px] md:max-w-[400px] md:max-h-[560px] lg:max-w-[460px] lg:max-h-[640px] ${isFront ? 'cursor-grab active:cursor-grabbing touch-pan-y shadow-[0_0_80px_rgba(59,130,246,0.15)]' : 'pointer-events-none'}`}
    >
      {/* Holographic Inner Border Glow on Hover */}
      <div className={`absolute inset-0 rounded-[2rem] pointer-events-none transition-opacity duration-500 z-30 ${isFront ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`} 
           style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(59,130,246,0.3) 100%)', mixBlendMode: 'overlay' }}>
      </div>

      {/* Advanced Dynamic Spotlight Glare */}
      <motion.div 
        className={`absolute inset-0 z-40 pointer-events-none rounded-[2rem] mix-blend-overlay transition-opacity duration-300 ${isFront ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: glareBackground }}
      />

      <div className="w-full h-full bg-[#0a0a0a]/85 backdrop-blur-2xl rounded-[2rem] border border-white/10 overflow-hidden flex flex-col relative group shadow-[0_0_40px_rgba(0,0,0,0.5)] transform-style-3d transition-colors duration-500 hover:border-white/20">
        
        {/* Smart Silhouetting Container (Fades out when not in front) */}
        <div className={`relative z-10 flex flex-col h-full transition-all duration-700 ${isFront ? 'opacity-100' : 'opacity-0 blur-sm pointer-events-none'}`}>
          {/* Top: Issuer */}
          <div className="pt-8 pb-2 px-6 flex flex-col items-center justify-center text-center shrink-0">
            <h2 className={`font-black text-white tracking-tight uppercase ${cert.issuer && cert.issuer.length > 20 ? 'text-sm md:text-base leading-tight' : 'text-xl md:text-2xl'}`}>
              {cert.issuer || "CREDENTIAL"}
            </h2>
            <p className="text-[9px] md:text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-2">
              {cert.type || "Certification"}
            </p>
          </div>

          {/* Middle: Image */}
          <div className="flex-1 relative overflow-hidden flex items-center justify-center p-4 md:p-6 bg-white/5 mx-4 md:mx-6 rounded-2xl border border-white/5 shadow-inner my-2">
            {cert.coverUrl ? (
              <img
                src={getImageUrl(cert.coverUrl)}
                alt={cert.name}
                className="max-w-full max-h-[160px] md:max-h-[220px] object-contain drop-shadow-2xl brightness-90 group-hover:brightness-100 transition-all"
              />
            ) : cert.fileUrl && cert.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <img
                src={getImageUrl(cert.fileUrl)}
                alt={cert.name}
                className="max-w-full max-h-[160px] md:max-h-[220px] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] brightness-90 group-hover:brightness-100 transition-all"
              />
            ) : (
              <div className="text-white/20">
                <svg className="w-24 h-24 md:w-32 md:h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Bottom: Title & Action */}
          <div className="p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent flex flex-col items-center text-center shrink-0 mt-auto">
            <h3 className="text-base md:text-lg lg:text-xl font-bold text-white leading-tight mb-2 line-clamp-2">
              {cert.name}
            </h3>
            <p className="text-[11px] md:text-xs text-gray-400 mb-5 line-clamp-2 break-words w-full">
              {cert.description
                ? cert.description
                    .replace(/<[^>]+>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&[a-z]+;/gi, '')
                : new Date(cert.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </p>
            
            <div className="flex gap-3 w-full justify-center">
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-2.5 md:py-3 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-white text-xs md:text-sm font-bold rounded-xl text-center transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 border border-blue-500/30 ${!isFront ? 'pointer-events-none' : ''}`}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                >
                  Verify Credential
                </a>
              )}
              {cert.fileUrl && (
                <button
                  onClick={(e) => openGallery(e, cert.fileUrl, cert.name)}
                  className={`px-4 py-2.5 md:py-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all border border-white/10 shadow-sm hover:shadow-md active:scale-95 ${!isFront ? 'pointer-events-none' : ''}`}
                  title="View File"
                  onPointerDownCapture={(e) => e.stopPropagation()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MagneticButton = ({ children, onClick, className }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: xSpring, y: ySpring }}
      className={className}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
};

const Certifications = ({ initialCertifications }: { initialCertifications?: any[] }) => {
  const [certifications, setCertifications] = useState<any[]>(initialCertifications || []);
  const [loading, setLoading] = useState(!initialCertifications);
  const [loadedAll, setLoadedAll] = useState(!initialCertifications || initialCertifications.length < 6);
  const [index, setIndex] = useState(0);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately on mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
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
    if (initialCertifications && loadedAll) return;

    api
      .get("/certifications?limit=0")
      .then((res) => {
        setCertifications(res.data);
        setLoading(false);
        setLoadedAll(true);
        setTimeout(() => setIsInitialMount(false), res.data.length * 100 + 500);
      })
      .catch((err) => {
        console.error("Failed to fetch certifications", err);
        setLoading(false);
      });
  }, [initialCertifications, loadedAll]);

  useEffect(() => {
    if (initialCertifications && initialCertifications.length > 0) {
      setTimeout(() => setIsInitialMount(false), initialCertifications.length * 100 + 500);
    }
  }, [initialCertifications]);

  if (loading) {
    return (
      <div className="min-h-[100svh] flex flex-col items-center justify-center py-10 md:py-20 overflow-hidden relative">
        <div className="relative w-full h-[65vh] max-h-[500px] md:max-h-[700px]">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Handle circular indexing
  const numItems = certifications.length;
  const normalizedIndex = index % numItems < 0 ? (index % numItems) + numItems : index % numItems;

  return (
    <div className="min-h-[100svh] flex flex-col items-center justify-center py-6 md:py-20 overflow-hidden relative">

      {/* Massive Background Typography for 3D Depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center select-none">
         <h1 className="text-[10vw] md:text-[8vw] font-black text-white/[0.03] leading-none tracking-tighter whitespace-nowrap blur-[2px]">
           CREDENTIALS
         </h1>
      </div>
      
      {/* Glow Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-[1400px] h-[65vh] max-h-[500px] md:max-h-[750px] perspective-1000 flex items-center justify-center mt-4 md:mt-8">
        
        {/* Navigation Arrow Left */}
        <MagneticButton 
          onClick={() => setIndex(prev => prev + 1)} 
          className="absolute left-4 md:left-12 z-[200] p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-colors shadow-2xl group hidden sm:flex items-center justify-center w-14 h-14"
        >
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </MagneticButton>

        {/* Carousel Container */}
        <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
          {certifications.length > 0 ? (
            <AnimatePresence initial={false}>
              {certifications.map((cert, i) => {
                // Calculate the shortest distance to the current active index in the circle
                let offset = (i - normalizedIndex) % numItems;
                if (offset > Math.floor(numItems / 2)) offset -= numItems;
                if (offset < -Math.floor(numItems / 2)) offset += numItems;

                const isFront = offset === 0;

                return (
                  <Card 
                    key={cert._id}
                    cert={cert}
                    offset={offset}
                    setIndex={setIndex}
                    openGallery={openGallery}
                    isFront={isFront}
                    index={i}
                    isInitialMount={isInitialMount}
                    isMobile={isMobile}
                  />
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white/5 rounded-3xl border border-white/10 w-72 mx-auto">
               <p>No certifications found</p>
            </div>
          )}
        </div>

        {/* Navigation Arrow Right */}
        <MagneticButton 
          onClick={() => setIndex(prev => prev - 1)} 
          className="absolute right-4 md:right-12 z-[200] p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white transition-colors shadow-2xl group hidden sm:flex items-center justify-center w-14 h-14"
        >
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </MagneticButton>
      </div>
      
      {/* Mobile Navigation Controls */}
      <div className="flex gap-8 mt-2 relative z-10 sm:hidden">
        <button 
          onClick={() => setIndex(prev => prev + 1)}
          className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-95 shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => setIndex(prev => prev - 1)}
          className="p-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-95 shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
