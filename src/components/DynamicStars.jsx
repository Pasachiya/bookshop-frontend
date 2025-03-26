import React, { useEffect, useRef, useState, useMemo } from "react";
import "./DynamicStars.css";

const DynamicStars = React.memo(() => {
  const containerRef = useRef(null);
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const animationRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Calculate star count based on screen size
  const starCounts = useMemo(() => {
    const totalArea = dimensions.width * dimensions.height;
    const baseStarCount = Math.floor(totalArea / 5000); // Slightly fewer stars for better performance
    
    return {
      normalStars: baseStarCount,
      largeStars: Math.floor(baseStarCount / 12),
      pulsatingStars: Math.floor(baseStarCount / 20)
    };
  }, [dimensions]);

  // Create stars with different layers and types
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.innerHTML = ""; // Clear existing stars
    starsRef.current = [];
    shootingStarsRef.current = [];

    // Create normal stars with different layers
    for (let i = 0; i < starCounts.normalStars; i++) {
      const star = document.createElement("div");
      const size = Math.random() * 2 + 0.5;
      const layer = Math.ceil(Math.random() * 3);
      const parallaxFactor = (5 - layer) * 0.8; // Adjusted for smoother parallax
      
      star.className = `star star-layer-${layer}`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 3}s`;
      star.style.animationDuration = `${2 + Math.random() * 3}s`; // Varied durations
      star.dataset.parallax = parallaxFactor;
      
      container.appendChild(star);
      starsRef.current.push(star);
    }

    // Create larger stars
    for (let i = 0; i < starCounts.largeStars; i++) {
      const largeStar = document.createElement("div");
      const size = Math.random() * 3 + 2;
      
      largeStar.className = "large-star";
      largeStar.style.width = `${size}px`;
      largeStar.style.height = `${size}px`;
      largeStar.style.left = `${Math.random() * 100}%`;
      largeStar.style.top = `${Math.random() * 100}%`;
      largeStar.style.animationDelay = `${Math.random() * 3}s`;
      largeStar.style.animationDuration = `${1.5 + Math.random() * 2}s`;
      largeStar.dataset.parallax = 5;
      
      container.appendChild(largeStar);
      starsRef.current.push(largeStar);
    }

    // Create pulsating stars
    for (let i = 0; i < starCounts.pulsatingStars; i++) {
      const pulseStar = document.createElement("div");
      const size = Math.random() * 4 + 3;
      
      pulseStar.className = "pulse-star";
      pulseStar.style.width = `${size}px`;
      pulseStar.style.height = `${size}px`;
      pulseStar.style.left = `${Math.random() * 100}%`;
      pulseStar.style.top = `${Math.random() * 100}%`;
      pulseStar.style.animationDelay = `${Math.random() * 4}s`;
      pulseStar.style.animationDuration = `${4 + Math.random() * 3}s`;
      pulseStar.dataset.parallax = 6;
      
      container.appendChild(pulseStar);
      starsRef.current.push(pulseStar);
    }

    // Create constellations
    createConstellations(container);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, starCounts]);

  // Create constellations - groups of stars connected by lines
  const createConstellations = (container) => {
    const constellationCount = Math.floor(dimensions.width / 500);
    
    for (let c = 0; c < constellationCount; c++) {
      const constellation = document.createElement("div");
      constellation.className = "constellation";
      
      // Random position for this constellation
      const centerX = Math.random() * 80 + 10; // Stay away from edges
      const centerY = Math.random() * 80 + 10;
      
      // Create 3-6 stars in this constellation
      const starCount = Math.floor(Math.random() * 4) + 3;
      const constellationStars = [];
      
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement("div");
        const size = Math.random() * 2 + 1;
        
        // Position around the center point with some randomness
        const angle = (i / starCount) * Math.PI * 2;
        const distance = Math.random() * 50 + 20;
        const x = centerX + Math.cos(angle) * distance / dimensions.width * 100;
        const y = centerY + Math.sin(angle) * distance / dimensions.height * 100;
        
        star.className = "constellation-star";
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.dataset.parallax = 4;
        star.dataset.x = x;
        star.dataset.y = y;
        star.dataset.index = i;
        
        constellation.appendChild(star);
        constellationStars.push(star);
        starsRef.current.push(star);
      }
      
      // Create connecting lines
      for (let i = 0; i < constellationStars.length - 1; i++) {
        const line = document.createElement("div");
        const star1 = constellationStars[i];
        const star2 = constellationStars[i + 1];
        
        updateConstellationLine(line, star1, star2);
        line.className = "constellation-line";
        line.dataset.star1Index = star1.dataset.index;
        line.dataset.star2Index = star2.dataset.index;
        line.dataset.parallax = 4;
        
        constellation.appendChild(line);
        starsRef.current.push(line);
      }
      
      container.appendChild(constellation);
    }
  };
  
  // Update constellation line position
  const updateConstellationLine = (line, star1, star2) => {
    const x1 = parseFloat(star1.dataset.x);
    const y1 = parseFloat(star1.dataset.y);
    const x2 = parseFloat(star2.dataset.x);
    const y2 = parseFloat(star2.dataset.y);
    
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    line.style.width = `${length}%`;
    line.style.left = `${x1}%`;
    line.style.top = `${y1}%`;
    line.style.transform = `rotate(${angle}rad)`;
    line.style.transformOrigin = "0 0";
  };

  // Create shooting stars at random intervals
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let shootingStarInterval;
    
    const createStar = () => {
      const shootingStar = document.createElement("div");
      shootingStar.className = "shooting-star";
      
      // Random position and angle
      const startX = Math.random() * dimensions.width;
      const angle = -40 - Math.random() * 20; // -40 to -60 degrees
      
      shootingStar.style.left = `${startX}px`;
      shootingStar.style.top = "0px";
      shootingStar.style.transform = `rotate(${angle}deg)`;
      shootingStar.style.animationDuration = `${Math.random() * 0.5 + 1}s`;
      
      container.appendChild(shootingStar);
      shootingStarsRef.current.push(shootingStar);
      
      // Remove the shooting star after animation completes
      setTimeout(() => {
        if (container.contains(shootingStar)) {
          container.removeChild(shootingStar);
          shootingStarsRef.current = shootingStarsRef.current.filter(star => star !== shootingStar);
        }
      }, 2000);
    };

    // Create a burst of shooting stars when user hovers
    const createShootingStarBurst = () => {
      if (!isHovering) return;
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createStar(), i * 200);
      }
    };

    // Normal random shooting stars
    const createStarWithInterval = () => {
      if (Math.random() > 0.5) { // Only 50% chance to create a star each interval
        createStar();
      }
      shootingStarInterval = setTimeout(
        createStarWithInterval, 
        Math.random() * 8000 + 2000
      );
    };

    createStarWithInterval();
    
    // Setup intervals for burst mode when hovering
    const burstInterval = setInterval(createShootingStarBurst, 3000);

    return () => {
      clearTimeout(shootingStarInterval);
      clearInterval(burstInterval);
    };
  }, [dimensions, isHovering]);

  // Handle parallax effect with optimized mouse movement
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to center
      const mouseX = (e.clientX - dimensions.width / 2);
      const mouseY = (e.clientY - dimensions.height / 2);
      
      setMousePosition({ x: mouseX, y: mouseY });
      setIsHovering(true);
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    const updateStarPositions = () => {
      // Smooth transition to target position
      targetX += (mousePosition.x - targetX) * 0.03;
      targetY += (mousePosition.y - targetY) * 0.03;

      starsRef.current.forEach((star) => {
        const parallaxFactor = parseFloat(star.dataset.parallax || 1) * 0.01;
        star.style.transform = `translate(${targetX * parallaxFactor}px, ${targetY * parallaxFactor}px)`;
      });
      
      animationRef.current = requestAnimationFrame(updateStarPositions);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animationRef.current = requestAnimationFrame(updateStarPositions);

    // Handle window resize with debounce
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 250);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, mousePosition, isHovering]);

  return <div ref={containerRef} className="stars-container" />;
});

export default DynamicStars;