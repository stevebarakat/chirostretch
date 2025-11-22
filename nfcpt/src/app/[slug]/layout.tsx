import React from "react";
import "./page.css";
import "./blog.css";

export default function PageLayout({ children }: Children) {
  return <div>{children}</div>;
}
