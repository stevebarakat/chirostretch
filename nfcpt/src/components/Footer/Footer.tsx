"use client";
import Link from "next/link";
import { FaCircleUp } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import { Button } from "@/components/Button";
import styles from "./footer.module.css";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useRef, useState } from "react";
import { RawHtml } from "@/components/RawHtml";
import Image from "next/image";

type MenuType = {
  item: MenuItem;
};

function Menu({ item }: MenuType) {
  const dropdownButton = item?.childItems?.nodes;
  const isDropdownButton = dropdownButton && dropdownButton.length > 0;
  const ref = useRef<HTMLLIElement>(null);
  const [isActive, setIsActive] = useState(false);

  useOnClickOutside(ref, () => setIsActive(false));

  const footerMenu = (
    <li ref={ref}>
      {!isDropdownButton ? (
        <Link href={item.uri} passHref>
          {item.label}
        </Link>
      ) : (
        <button
          className="btn-link"
          onClick={() => {
            setIsActive((isActive) => !isActive);
          }}
        >
          {item.label}
          <FaCaretDown />
        </button>
      )}

      {item.childItems?.nodes.length! > 0 && (
        <ul className={isActive ? "" : "sr-only"}>
          {item.childItems?.nodes.map((item) => {
            return (
              <li key={item.id}>
                <Link href={item.uri} passHref>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
  return <menu>{footerMenu}</menu>;
}

type SocialMedia = {
  name: string;
  url: string;
  icon: {
    node: {
      altText: string;
      mediaDetails: {
        height: number;
        width: number;
      };
      sourceUrl: string;
    };
  };
};

type FooterContent = {
  footerCall: {
    footerHeadline: string;
    description: string;
  };
  footerBtn1: {
    link: any;
    btn1Text: string;
  };
  footerBtn2: {
    btn2Link: any;
    btn2Text: string;
  };
  contactInfo: string;
  officeHours: string;
  socialMedia: SocialMedia[];
};

export default function Footer({
  menuItems,
  content,
}: {
  menuItems: MenuItem[];
  content: FooterContent;
}) {
  const {
    footerCall,
    footerBtn1,
    footerBtn2,
    contactInfo,
    officeHours,
    socialMedia,
  } = content;
  const { btn1Text } = footerBtn1;
  const { btn2Text } = footerBtn2;

  const footerBtn1Link = footerBtn1.link.nodes[0].uri;
  const footerBtn2Link = footerBtn2.btn2Link.nodes[0].uri;

  const socialMediaLinks = socialMedia?.map((item) => {
    return (
      <li key={item.name}>
        <a className={styles.social} href={item.url}>
          <span className={styles.icon}>
            <Image
              src={item.icon.node.sourceUrl}
              alt={item.icon.node.altText}
              width={item.icon.node.mediaDetails.width - 12}
              height={item.icon.node.mediaDetails.height - 12}
            />
          </span>
          <span>{item.name}</span>
        </a>
      </li>
    );
  });

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.upperFooter}>
          <div>
            <span className={styles.headline}>{footerCall.footerHeadline}</span>
            <span className={styles.description}>{footerCall.description}</span>
          </div>
          <div className={styles.btnWrap}>
            <div className="flex">
              <div
                style={{
                  marginRight: "0.25rem",
                }}
              >
                <Link passHref href={footerBtn1Link}>
                  <Button
                    color="white"
                    textColor="var(--grey75)"
                    borderColor="var(--grey05)"
                  >
                    {btn1Text}
                  </Button>
                </Link>
              </div>
              <div
                style={{
                  marginLeft: "0.25rem",
                }}
              >
                <Link passHref href={footerBtn2Link}>
                  <Button
                    color="var(--accentColor)"
                    borderColor="var(--accentColor)"
                    textColor="white"
                  >
                    {btn2Text}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.innerFooter}>
          <div>
            <div className={styles.heading}>Office Hours</div>
            <RawHtml>{officeHours}</RawHtml>
          </div>

          <div>
            <menu className={styles.heading}>Sitemap</menu>
            {menuItems?.map((item) => (
              <Menu key={item.id} item={item} />
            ))}
          </div>

          <div>
            <div className={styles.heading}>Connect</div>
            <ul>{socialMediaLinks}</ul>
          </div>
          <div>
            <div className={styles.heading}>Contact Info</div>
            <RawHtml>{contactInfo}</RawHtml>
          </div>
        </div>
        <div className={styles.colophon}>
          <div>
            &copy;{new Date().getFullYear()} North Florida Chiropractic Physical
            Therapy
          </div>
          <div style={{ position: "relative" }}>
            Site by <a href="mailto:stevebarakat@gmail.com">S.Barakat</a>
            <a href="#top" aria-label="back to top" className="back-to-top">
              <FaCircleUp
                size={48}
                color="hsl(0 100% 100%/0.75)"
                style={{ filter: "contrast(0)" }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
