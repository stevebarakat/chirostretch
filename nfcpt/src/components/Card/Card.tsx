import "./card.css";

function Card({ children }: Children) {
  return <div className="card">{children}</div>;
}

export default Card;
