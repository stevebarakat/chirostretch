"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useState, useEffect } from "react";

import styles from "./HeroSlider.module.css";

type AcfLink = {
  url?: string;
  title?: string;
  target?: string;
};

type HeroSlide = {
  slideBackgroundImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  slideHeading?: string;
  slideSubheading?: string;
  slideCtaText?: string;
  slideCtaLink?: AcfLink;
};

type HeroSliderProps = {
  slides?: HeroSlide[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
  if (!slides || slides.length === 0) return null;

  const first = slides[0];
  const firstImage = first.slideBackgroundImage?.node?.sourceUrl || "";
  const firstAlt =
    first.slideBackgroundImage?.node?.altText || "Hero background";

  // Enable Swiper only on the client to avoid hydration blocking LCP
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  return (
    <section className={styles.section}>
      {/* ⭐ STATIC SSR LCP IMAGE */}
      <div className={styles.staticImageWrapper}>
        <Image
          src={firstImage}
          alt={firstAlt}
          fill
          priority
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className={styles.staticImage}
        />
      </div>

      {/* ⭐ Mount Swiper only after hydration */}
      {isClient && (
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={slides.length > 1}
          speed={600}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className={styles.swiper}
        >
          {slides.map((slide, index) => {
            const img = slide.slideBackgroundImage?.node;
            return (
              <SwiperSlide key={`slide-${index}`}>
                <div className={styles.slide}>
                  {img?.sourceUrl && (
                    <Image
                      src={img.sourceUrl}
                      alt={img.altText || ""}
                      fill
                      quality={75}
                      sizes="100vw"
                      className={styles.image}
                    />
                  )}

                  <div className={styles.overlay} />

                  <div className={styles.content}>
                    <div className={styles.contentInner}>
                      {slide.slideHeading && (
                        <h1 className={styles.heading}>{slide.slideHeading}</h1>
                      )}

                      {slide.slideSubheading && (
                        <p className={styles.subheading}>
                          {slide.slideSubheading}
                        </p>
                      )}

                      {slide.slideCtaText && slide.slideCtaLink?.url && (
                        <a
                          href={slide.slideCtaLink.url}
                          target={slide.slideCtaLink.target || undefined}
                          rel={
                            slide.slideCtaLink.target === "_blank"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className={styles.cta}
                        >
                          {slide.slideCtaText}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
}
