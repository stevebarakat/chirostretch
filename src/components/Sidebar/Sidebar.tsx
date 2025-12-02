"use client";
import styles from "./sidebar.module.css";
import { SignUp } from "@/components/SignUp";
import { Reviews } from "../Reviews";
import { Promotion } from "../Promotion";

type SidebarProps = {
  slug?: string;
  promo: {
    price: string;
    topLine: string;
    middleLine: string;
    bottomLine: string;
  };
};

const Sidebar = ({ slug, promo }: SidebarProps) => {
  return (
    <aside
      className={styles.sidebarWrap}
      style={
        slug === "pricing-plans"
          ? { marginBlockStart: "176px", position: "relative" }
          : {}
      }
    >
      <div
        className={styles.sidebarWidget}
        style={{ background: "var(--accentGradient)" }}
      >
        <div className={styles.promoImg}>
          <Promotion promo={{ ...promo, price: Number(promo.price) }} />
        </div>
        <SignUp />
      </div>
      <div
        className={styles.sidebarWidget}
        style={{ background: "var(--primaryGradient)" }}
      >
        <Reviews />
      </div>
    </aside>
  );
};

export default Sidebar;
