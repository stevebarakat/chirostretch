"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

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

  return (
    <section className={styles.section}>
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
          const imageUrl = slide.slideBackgroundImage?.node?.sourceUrl;
          const imageAlt =
            slide.slideBackgroundImage?.node?.altText || "Slide background";

          return (
            <SwiperSlide key={`slide-${index}-${imageUrl || "no-img"}`}>
              <div className={styles.slide}>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={imageAlt}
                    fill
                    sizes="100vw"
                    /* Optimal LCP behavior */
                    priority={index === 0}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    /* Slightly higher quality for hero clarity */
                    quality={75}
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
    </section>
  );
}
