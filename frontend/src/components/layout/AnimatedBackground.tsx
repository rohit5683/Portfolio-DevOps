import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDark, setIsDark] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Detect mobile/tablet devices
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (isMobile) {
      // ============================================
      // MOBILE/TABLET: Gradient waves animation
      // ============================================
      let animationId: number;
      let offset = 0;

      const drawMobileAnimation = () => {
        // Clear with theme-aware background
        ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Create animated gradient waves
        const waves = [
          { y: canvas.height * 0.3, amplitude: 30, frequency: 0.02, speed: 0.5 },
          { y: canvas.height * 0.5, amplitude: 40, frequency: 0.015, speed: 0.3 },
          { y: canvas.height * 0.7, amplitude: 35, frequency: 0.025, speed: 0.4 },
        ];

        const waveColors = isDark 
          ? ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.08)', 'rgba(59, 130, 246, 0.06)']
          : ['rgba(59, 130, 246, 0.05)', 'rgba(139, 92, 246, 0.04)', 'rgba(59, 130, 246, 0.03)'];

        waves.forEach((wave, index) => {
          ctx.beginPath();
          ctx.moveTo(0, wave.y);

          for (let x = 0; x < canvas.width; x++) {
            const y = wave.y + Math.sin(x * wave.frequency + offset * wave.speed) * wave.amplitude;
            ctx.lineTo(x, y);
          }

          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();

          ctx.fillStyle = waveColors[index];
          ctx.fill();
        });

        // Add floating orbs with theme-aware colors
        const orbs = [
          { x: canvas.width * 0.2, y: canvas.height * 0.2, radius: 60 },
          { x: canvas.width * 0.8, y: canvas.height * 0.6, radius: 80 },
          { x: canvas.width * 0.5, y: canvas.height * 0.8, radius: 50 },
        ];

        const orbColors = isDark
          ? ['rgba(59, 130, 246, 0.15)', 'rgba(139, 92, 246, 0.12)', 'rgba(59, 130, 246, 0.1)']
          : ['rgba(59, 130, 246, 0.08)', 'rgba(139, 92, 246, 0.06)', 'rgba(59, 130, 246, 0.05)'];

        orbs.forEach((orb, index) => {
          const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
          gradient.addColorStop(0, orbColors[index]);
          gradient.addColorStop(1, isDark ? 'rgba(59, 130, 246, 0)' : 'rgba(59, 130, 246, 0)');

          ctx.beginPath();
          ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        });

        offset += 0.02;
        animationId = requestAnimationFrame(drawMobileAnimation);
      };

      drawMobileAnimation();

      return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', resizeCanvas);
      };
    } else {
      // ============================================
      // DESKTOP: Original particle system
      // ============================================
      
      // Gradient mesh points for background
      const gradientPoints: Array<{ x: number; y: number; vx: number; vy: number }> = [];
      const numGradientPoints = 4;

      for (let i = 0; i < numGradientPoints; i++) {
        gradientPoints.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }

      // Particle network
      const particles: Particle[] = [];
      const numParticles = 80;
      const maxDistance = 150;

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: Math.random() * 2 + 1,
        });
      }

      // Mouse interaction
      let mouse = { x: 0, y: 0, radius: 150 };
      
      const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      };
      
      window.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      let animationId: number;
      const animate = () => {
        // Draw gradient background based on theme
        ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw gradient blobs
        gradientPoints.forEach((point, index) => {
          point.x += point.vx;
          point.y += point.vy;

          if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
          if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, 350
          );

          const colors = isDark ? [
            ['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0)'],
            ['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0)'],
            ['rgba(236, 72, 153, 0.15)', 'rgba(236, 72, 153, 0)'],
            ['rgba(34, 211, 238, 0.15)', 'rgba(34, 211, 238, 0)'],
          ] : [
            ['rgba(59, 130, 246, 0.08)', 'rgba(59, 130, 246, 0)'],
            ['rgba(139, 92, 246, 0.08)', 'rgba(139, 92, 246, 0)'],
            ['rgba(236, 72, 153, 0.08)', 'rgba(236, 72, 153, 0)'],
            ['rgba(34, 211, 238, 0.08)', 'rgba(34, 211, 238, 0)'],
          ];

          const [color1, color2] = colors[index % colors.length];
          gradient.addColorStop(0, color1);
          gradient.addColorStop(1, color2);

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        // Update and draw particles
        particles.forEach((particle) => {
          // Mouse repulsion
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            particle.vx -= Math.cos(angle) * force * 0.5;
            particle.vy -= Math.sin(angle) * force * 0.5;
          }

          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Friction
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          // Bounce off edges
          if (particle.x < 0 || particle.x > canvas.width) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(canvas.width, particle.x));
          }
          if (particle.y < 0 || particle.y > canvas.height) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(canvas.height, particle.y));
          }

          // Draw particle with theme-aware color
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.8)' : 'rgba(59, 130, 246, 0.6)';
          ctx.fill();
        });

        // Draw connections with theme-aware color
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const opacity = (1 - distance / maxDistance) * 0.5;
              ctx.strokeStyle = isDark 
                ? `rgba(96, 165, 250, ${opacity})` 
                : `rgba(59, 130, 246, ${opacity * 0.7})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        window.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationId);
      };
    }
  }, [isDark, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBackground;
