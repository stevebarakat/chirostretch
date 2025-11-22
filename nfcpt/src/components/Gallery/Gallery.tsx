"use client";
import Image from "next/image";
import { RawHtml } from "@/components/RawHtml";
import { buildUrl } from "cloudinary-build-url";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { blurOptions } from "@/utils/constants";
import { Card } from "@/components/Card";
import "swiper/css/pagination";
import "swiper/css";
import "./gallery.css";

type Props = {
  images: {
    image: {
      node: {
        sourceUrl: string;
        altText: string;
        caption: string;
        slug: string;
      };
    };
  }[];
  title: string;
};

const breakpoints = {
  0: {
    slidesPerView: 1,
    spaceBetween: 10,
  },
  570: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  690: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
  980: {
    slidesPerView: 4,
    spaceBetween: 40,
  },
  1200: {
    slidesPerView: 5,
    spaceBetween: 50,
  },
};

const Gallery = ({ images, title }: Props) => {
  return (
    <div className="gallery">
      <div className="container">
        <span className="galleryHeader">{title}</span>
        <Swiper
          modules={[Autoplay, Pagination]}
          speed={750}
          spaceBetween={0}
          slidesPerView={4}
          slidesPerGroup={1}
          loop={true}
          pagination={{ clickable: true }}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: true,
          }}
          breakpoints={breakpoints}
        >
          {images.map((service, i) => {
            if (!service.image?.node.slug) return;
            const blur = buildUrl(service.image.node.slug, blurOptions);

            return (
              <SwiperSlide key={i}>
                <Card>
                  <RawHtml className="cardHeader">
                    {service.image.node.caption}
                  </RawHtml>
                  <div className="swiper-image">
                    <Image
                      width={200}
                      height={200}
                      placeholder="blur"
                      blurDataURL={blur}
                      src={service.image.node.sourceUrl}
                      alt={service.image.node.altText}
                    />
                  </div>
                </Card>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Gallery;
