"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Position for the ambient glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth lagging position for the 'Aurora' glow
  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, smoothOptions);
  const smoothY = useSpring(mouseY, smoothOptions);

  // Faster trailing dot
  const trailX = useSpring(mouseX, { damping: 25, stiffness: 250, mass: 0.6 });
  const trailY = useSpring(mouseY, { damping: 25, stiffness: 250, mass: 0.6 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovered(!!target.closest("button, a, [role='button'], .cursor-pointer"));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", () => setIsVisible(false));
    document.addEventListener("mouseenter", () => setIsVisible(true));

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", () => setIsVisible(false));
      document.removeEventListener("mouseenter", () => setIsVisible(true));
    };
  }, [mouseX, mouseY, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Ambient Aurora Glow */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.4 : 0.2,
          backgroundColor: isHovered ? "rgba(168, 85, 247, 0.4)" : "rgba(59, 130, 246, 0.3)",
        }}
        className="fixed top-0 left-0 w-32 h-32 rounded-full blur-3xl transition-colors duration-500"
      />

      {/* Trailing Soft Dot */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 2 : 1,
          opacity: isHovered ? 0.6 : 0.3,
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
      />

      {/* Subtle Ring (Follower) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 40 : 24,
          height: isHovered ? 40 : 24,
          borderColor: isHovered ? "rgba(168, 85, 247, 0.5)" : "rgba(59, 130, 246, 0.2)",
          opacity: isHovered ? 1 : 0.5,
        }}
        className="fixed top-0 left-0 rounded-full border border-white/20 transition-all duration-300"
      />
    </div>
  );
};

export default CustomCursor;
