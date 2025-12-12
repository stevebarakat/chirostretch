"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import styles from "./ImageMagnifier.module.css";

type ImageMagnifierProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  fetchPriority?: "auto" | "high" | "low";
  sizes?: string;
  className?: string;
};

const ZOOM_SCALE = 1.5;

export default function ImageMagnifier({
  src,
  alt,
  width,
  height,
  priority = false,
  fetchPriority = "auto",
  sizes,
  className,
}: ImageMagnifierProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Clamp to 0-1 range
    const clampedX = Math.max(0, Math.min(1, x));
    const clampedY = Math.max(0, Math.min(1, y));

    setPosition({
      x: clampedX,
      y: clampedY,
    });
    setIsHovered(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className || ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div
        ref={imageRef}
        className={`${styles.imageWrapper} ${isHovered ? styles.zoomed : ""}`}
        style={
          isHovered
            ? {
                transformOrigin: `${position.x * 100}% ${position.y * 100}%`,
              }
            : undefined
        }
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          fetchPriority={fetchPriority}
          sizes={sizes}
          className={styles.image}
        />
      </div>
    </div>
  );
}
