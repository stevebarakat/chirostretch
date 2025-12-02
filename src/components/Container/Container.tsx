import "./container.css";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function Container({ children, className }: Props) {
  return <div className={`container ${className}`}>{children}</div>;
}

export default Container;
