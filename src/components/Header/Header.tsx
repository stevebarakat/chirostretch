"use client";
import { useState } from "react";
import Hamburger from "hamburger-react";
import { Logo } from "../Logo";
import { Menu } from "@/components/Menu";
import "./header.css";

export default function Header({ menuItems }: { menuItems?: MenuItem[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="site-header">
      <span className="sr-only">Open main menu</span>
      <div
        className="toggle-mobile-btn"
        onPointerUp={() => setMobileOpen((mobileOpen) => !mobileOpen)}
      >
        <Hamburger label="toggle menu" toggled={mobileOpen} size={20} />
      </div>
      <nav
        className="nav"
        style={
          {
            "--toggleMobile": mobileOpen
              ? "translateX(0)"
              : " translateX(-100%)",
          } as React.CSSProperties
        }
      >
        <div className="nav-container">
          <Logo isMobile={false} />
          <ul className="menu">
            {menuItems?.map((item) => (
              <Menu setMobileOpen={setMobileOpen} key={item.id} item={item} />
            ))}
          </ul>
          <div className="link tel">
            <a href="tel:904-272-4329">(904) 272-4329</a>
          </div>
        </div>
      </nav>
      <Logo isMobile={true} />
    </header>
  );
}
