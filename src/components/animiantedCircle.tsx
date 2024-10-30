"use client";
import React, { useEffect, useRef } from "react";

interface AnimatedCircleProps {
  mousePosition: { x: number; y: number };
}

const AnimatedCircle: React.FC<AnimatedCircleProps> = ({ mousePosition }) => {
  const circleRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const circleElement = circleRef.current;

    if (!circleElement) return;

    // Update position and rotation based on mouse position
    const updateCirclePosition = () => {
      const { x, y } = mousePosition;
      const rect = circleElement.getBoundingClientRect();
      const centerX = rect.left;
      const centerY = rect.top;

      // Calculate velocity based on the difference
      velocityRef.current.x = x - centerX;
      velocityRef.current.y = y - centerY;

      // Update the circle's position and rotation
      circleElement.style.transform = `translate(-50%, -50%) rotateX(${velocityRef.current.y}deg) rotateY(${velocityRef.current.x}deg)`;
    };

    // Call the update function immediately to set initial position
    updateCirclePosition();

    // This could be useful if you want to use requestAnimationFrame for smoother animation
    const animationFrame = requestAnimationFrame(updateCirclePosition);

    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition]);

  return (
    <div
      ref={circleRef}
      className="circle bg-gradient-to-br from-[#387478] to-[#D4A373] w-10 h-10 rounded-full absolute pointer-events-none transition-transform duration-150 ease-in-out"
      style={{
        left: mousePosition.x, // Centering the circle horizontally on the mouse
        top: mousePosition.y + 15, // Centering the circle just below the mouse
      }}
    ></div>
  );
};

export default AnimatedCircle;
