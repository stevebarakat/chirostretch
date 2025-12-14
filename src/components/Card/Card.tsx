import type { ReactNode } from "react";
import "./card.css";

function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}

export default Card;
